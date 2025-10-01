
'use server';

/**
 * @fileOverview This file defines a Genkit flow for checking for password leaks
 * using the Google reCAPTCHA Enterprise API.
 * - checkPasswordLeak - The function that initiates the password leak check.
 * - PasswordLeakInput - The input type for the checkPasswordLeak function.
 * - PasswordLeakOutput - The return type for the checkPasswordLeak function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { GoogleAuth } from 'google-auth-library';
import { scrypt, createHash } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

const PasswordLeakInputSchema = z.object({
  email: z.string().email().describe('The user\'s email address.'),
  password: z.string().min(6).describe('The user\'s password.'),
});
export type PasswordLeakInput = z.infer<typeof PasswordLeakInputSchema>;

const PasswordLeakOutputSchema = z.object({
  leaked: z.boolean().describe('Whether the credentials have been leaked.'),
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
    if (!projectId) {
      throw new Error('Firebase project ID is not configured.');
    }

    try {
        const passwordBytes = Buffer.from(input.password, 'utf-8');

        const { lookup_hash_prefix, encrypted_user_credentials_hash } = await createHashes(input.email, passwordBytes);

        const auth = new GoogleAuth({
            scopes: 'https://www.googleapis.com/auth/cloud-platform',
        });
        const client = await auth.getClient();
        const accessToken = (await client.getAccessToken()).token;

        const url = `https://recaptchaenterprise.googleapis.com/v1/projects/${projectId}/assessments`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify({
                private_password_leak_verification: {
                    lookup_hash_prefix,
                    encrypted_user_credentials_hash,
                },
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('Password leak check failed:', errorBody);
            // In case of API error, we conservatively assume no leak to not block user.
            return { leaked: false };
        }

        const result = await response.json();

        // The presence of encryptedLeakMatchPrefixes indicates a leak.
        const leaked =
            result.privatePasswordLeakVerification &&
            Array.isArray(result.privatePasswordLeakVerification.encryptedLeakMatchPrefixes) &&
            result.privatePasswordLeakVerification.encryptedLeakMatchPrefixes.length > 0;
            
        return { leaked };

    } catch (error) {
      console.error('Error during password leak check:', error);
      // In case of any unexpected error, fail open (assume not leaked) to avoid blocking registration.
      return { leaked: false };
    }
  }
);
