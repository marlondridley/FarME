
'use server';

/**
 * @fileOverview This file defines a Genkit flow for checking for password leaks
 * and verifying a reCAPTCHA token.
 * - checkPasswordLeak - The function that initiates the password leak check.
 * - PasswordLeakInput - The input type for the checkPasswordLeak function.
 * - PasswordLeakOutput - The return type for the checkPasswordLeak function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { GoogleAuth } from 'google-auth-library';
import { scrypt, createHash } from 'crypto';
import { promisify } from 'util';
import { RecaptchaEnterpriseServiceClient } from '@google-cloud/recaptcha-enterprise';

const scryptAsync = promisify(scrypt);

const PasswordLeakInputSchema = z.object({
  email: z.string().email().describe("The user's email address."),
  password: z.string().min(6).describe("The user's password."),
  token: z.string().describe('The reCAPTCHA token from the client.'),
});
export type PasswordLeakInput = z.infer<typeof PasswordLeakInputSchema>;

const PasswordLeakOutputSchema = z.object({
  leaked: z.boolean().describe('Whether the credentials have been leaked.'),
  assessment: z.object({
    score: z.number().optional(),
    valid: z.boolean(),
    actionMatches: z.boolean(),
  }).describe('Result of the reCAPTCHA assessment.'),
});
export type PasswordLeakOutput = z.infer<typeof PasswordLeakOutputSchema>;

export async function checkPasswordLeak(
  input: PasswordLeakInput
): Promise<PasswordLeakOutput> {
  return passwordLeakFlow(input);
}

// Helper function to create the required hashes
async function createHashes(email: string, password_bytes: Buffer) {
    const canonical_username = email.split('@')[0];
    const hash = createHash('sha256').update(canonical_username).digest();
    const lookup_hash_prefix = hash.subarray(0, 4);

    const salt = Buffer.from('1122334455667788', 'hex');
    const derivedKey = await scryptAsync(password_bytes, salt, 32, { N: 16384, r: 8, p: 1 });
    
    return {
        lookup_hash_prefix: lookup_hash_prefix.toString('base64'),
        encrypted_user_credentials_hash: derivedKey.toString('base64'),
    };
}


const passwordLeakFlow = ai.defineFlow(
  {
    name: 'passwordLeakFlow',
    inputSchema: PasswordLeakInputSchema,
    outputSchema: PasswordLeakOutputSchema,
  },
  async (input) => {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    const recaptchaAction = 'REGISTER';

    if (!projectId || !recaptchaKey) {
      throw new Error('reCAPTCHA environment variables not set.');
    }

    // 1. Create and verify reCAPTCHA assessment
    const client = new RecaptchaEnterpriseServiceClient();
    const projectPath = client.projectPath(projectId);
    const request = ({
      assessment: {
        event: {
          token: input.token,
          siteKey: recaptchaKey,
        },
      },
      parent: projectPath,
    });

    const [ response ] = await client.createAssessment(request);
    
    const assessmentResult = {
      score: response.riskAnalysis?.score,
      valid: response.tokenProperties?.valid ?? false,
      actionMatches: response.tokenProperties?.action === recaptchaAction,
    };

    if (!assessmentResult.valid || !assessmentResult.actionMatches) {
        if (!assessmentResult.valid) {
            console.warn(`reCAPTCHA token was invalid: ${response.tokenProperties.invalidReason}`);
        }
        if (!assessmentResult.actionMatches) {
            console.warn(`reCAPTCHA action did not match. Expected: ${recaptchaAction}, Got: ${response.tokenProperties.action}`);
        }
      return { leaked: false, assessment: assessmentResult };
    }
    
    console.log(`reCAPTCHA score: ${assessmentResult.score}`);

    // 2. Proceed with password leak check
    const passwordBytes = Buffer.from(input.password, 'utf-8');
    const { lookup_hash_prefix, encrypted_user_credentials_hash } = await createHashes(input.email, passwordBytes);

    const auth = new GoogleAuth({
        scopes: 'https://www.googleapis.com/auth/cloud-platform',
    });
    const authClient = await auth.getClient();
    const accessToken = (await authClient.getAccessToken())?.token;
    
    if (!accessToken) {
        throw new Error("Could not get access token for password leak check.");
    }
    
    const url = `https://passwordleak.googleapis.com/v1beta1/leakedCredentials:search`;
    const leakResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json; charset=utf-8',
          'X-Goog-User-Project': projectId,
        },
        body: JSON.stringify({
            lookup_hash_prefix,
            encrypted_user_credentials_hash,
        }),
    });

    if (!leakResponse.ok) {
        const errorBody = await leakResponse.text();
        console.error('Password leak check failed with status:', leakResponse.status, errorBody);
        // In case of API error, we conservatively assume no leak to not block user.
        return { leaked: false, assessment: assessmentResult };
    }

    const leakResult = await leakResponse.json();
    const leaked =
        leakResult &&
        Array.isArray(leakResult.encryptedLeakMatchPrefixes) &&
        leakResult.encryptedLeakMatchPrefixes.length > 0;
        
    return { leaked, assessment: assessmentResult };
  }
);
