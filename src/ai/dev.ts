import { config } from 'dotenv';
config();

import '@/ai/flows/detect-anomalous-log-patterns.ts';
import '@/ai/flows/explain-flagged-events.ts';
import '@/ai/flows/ask-follow-up.ts';
import '@/ai/flows/analyze-cdr-data.ts';
