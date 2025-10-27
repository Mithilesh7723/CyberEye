'use server';
/**
 * @fileOverview An anomaly detection AI agent for identifying unusual patterns in system logs.
 *
 * - detectAnomalousLogPatterns - A function that handles the anomaly detection process.
 * - DetectAnomalousLogPatternsInput - The input type for the detectAnomalousLogPatterns function.
 * - DetectAnomalousLogPatternsOutput - The return type for the detectAnomalousLogPatterns function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectAnomalousLogPatternsInputSchema = z.object({
  logData: z
    .string()
    .describe('System log data to analyze for anomalous patterns.'),
  featureList: z
    .string()
    .describe('A comma separated list of numeric log features to analyze (e.g., loginCounts, requestFrequencies).'),
});
export type DetectAnomalousLogPatternsInput = z.infer<
  typeof DetectAnomalousLogPatternsInputSchema
>;

const DetectAnomalousLogPatternsOutputSchema = z.object({
  anomalousPatterns: z
    .string()
    .describe(
      'A description of any anomalous patterns detected in the log data, formatted as a markdown bulleted list.'
    ),
  recommendedActions: z
    .string()
    .describe(
      'Recommended actions for cybercrime investigators based on the detected anomalies, formatted as a markdown bulleted list.'
    ),
  evidenceToPreserve: z
    .string()
    .describe(
      'Specific log lines, IPs, timestamps, or files that should be preserved as evidence, formatted as a markdown bulleted list.'
    ),
});
export type DetectAnomalousLogPatternsOutput = z.infer<
  typeof DetectAnomalousLogPatternsOutputSchema
>;

export async function detectAnomalousLogPatterns(
  input: DetectAnomalousLogPatternsInput
): Promise<DetectAnomalousLogPatternsOutput> {
  return detectAnomalousLogPatternsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectAnomalousLogPatternsPrompt',
  input: {schema: DetectAnomalousLogPatternsInputSchema},
  output: {schema: DetectAnomalousLogPatternsOutputSchema},
  prompt: `You are an expert in cybersecurity log analysis, specializing in anomaly detection. Your audience is non-technical.

You will analyze the provided system log data for unusual patterns based on the specified numeric features.

Based on the detected anomalies, you will provide:

1.  **Anomalous Patterns**: A concise description of the anomalous patterns.
2.  **Recommended Actions**: Recommended immediate actions for cybercrime investigators.
3.  **Evidence to Preserve**: Specific log lines, IPs, timestamps, or files that should be preserved as evidence.

**Formatting Rules:**
-   Respond in clear, simple language suitable for individuals without a technical background.
-   **USE MARKDOWN** for all outputs.
-   **USE BULLET POINTS** extensively to make the information easy to scan and digest.

Log Data:
"""
{{{logData}}}
"""
Numeric Features: {{{featureList}}}

Provide a comprehensive and actionable analysis following all the rules.
`,
});

const detectAnomalousLogPatternsFlow = ai.defineFlow(
  {
    name: 'detectAnomalousLogPatternsFlow',
    inputSchema: DetectAnomalousLogPatternsInputSchema,
    outputSchema: DetectAnomalousLogPatternsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
