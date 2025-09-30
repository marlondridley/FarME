import { config } from 'dotenv';
config();

import '@/ai/flows/process-order-flow.ts';
import '@/ai/flows/discover-produce-flow.ts';
import '@/ai/flows/get-recipe-suggestions-flow.ts';
