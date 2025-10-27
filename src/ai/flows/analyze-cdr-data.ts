'use server';
/**
 * @fileOverview An AI agent for analyzing and correlating Call Detail Records (CDRs).
 *
 * - analyzeCdrData - A function that handles the CDR analysis process.
 * - AnalyzeCdrDataInput - The input type for the analyzeCdrData function.
 * - AnalyzeCdrDataOutput - The return type for the analyzeCdrData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCdrDataInputSchema = z.object({
  cdrData: z
    .string()
    .describe(
      'A string containing the content of multiple Call Detail Record (CDR) files, concatenated together.'
    ),
});
export type AnalyzeCdrDataInput = z.infer<typeof AnalyzeCdrDataInputSchema>;

const AnalyzeCdrDataOutputSchema = z.object({
  correlationSummary: z
    .string()
    .describe(
      'A summary of the correlations and key findings from the combined CDR data.'
    ),
  detailedAnalysis: z
    .string()
    .describe(
      'A detailed analysis of interesting patterns, anomalies, or potential fraud detected across the CDRs.'
    ),
  keyDataPoints: z
    .string()
    .describe(
      'Specific phone numbers, timestamps, durations, or other data points that are of high interest.'
    ),
});
export type AnalyzeCdrDataOutput = z.infer<typeof AnalyzeCdrDataOutputSchema>;

export async function analyzeCdrData(
  input: AnalyzeCdrDataInput
): Promise<AnalyzeCdrDataOutput> {
  return analyzeCdrDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCdrDataPrompt',
  input: {schema: AnalyzeCdrDataInputSchema},
  output: {schema: AnalyzeCdrDataOutputSchema},
  prompt: `You are an expert in telecommunications fraud and Call Detail Record (CDR) analysis.

You will analyze the provided CDR data, which may consist of multiple concatenated files. Your task is to correlate the information across all records to identify patterns, anomalies, and potential fraudulent activities.

Based on your analysis, you will provide:

1.  A high-level summary of the correlations and key findings.
2.  A detailed analysis of interesting patterns (e.g., unusual call frequencies, strange call destinations, long duration calls to premium numbers, etc.).
3.  A list of key data points (e.g., specific phone numbers, timestamps, IMSIs) that warrant further investigation.

CDR Data:
"""
{{{cdrData}}}
"""

Provide a comprehensive and actionable analysis.
`,
});

const analyzeCdrDataFlow = ai.defineFlow(
  {
    name: 'analyzeCdrDataFlow',
    inputSchema: AnalyzeCdrDataInputSchema,
    outputSchema: AnalyzeCdrDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
