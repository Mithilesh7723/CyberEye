'use server';
/**
 * @fileOverview A flow for asking follow-up questions about log data.
 *
 * - askFollowUp - A function that takes a question and log data and returns an answer.
 * - AskFollowUpInput - The input type for the askFollowUp function.
 * - AskFollowUpOutput - The return type for the askFollowUp function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AskFollowUpInputSchema = z.object({
  question: z.string().describe('The follow-up question about the log data.'),
  logData: z.string().describe('The original log data being analyzed.'),
});
export type AskFollowUpInput = z.infer<typeof AskFollowUpInputSchema>;

const AskFollowUpOutputSchema = z.object({
  answer: z.string().describe('The answer to the follow-up question.'),
});
export type AskFollowUpOutput = z.infer<typeof AskFollowUpOutputSchema>;

export async function askFollowUp(
  input: AskFollowUpInput
): Promise<AskFollowUpOutput> {
  return askFollowUpFlow(input);
}

const prompt = ai.definePrompt({
  name: 'askFollowUpPrompt',
  input: {schema: AskFollowUpInputSchema},
  output: {schema: AskFollowUpOutputSchema},
  prompt: `You are a cybersecurity analyst AI. You have already provided an initial analysis of the provided log data.
Now, the user has a follow-up question. Answer the question based *only* on the provided log data.

Log Data:
"""
{{{logData}}}
"""

User's Question:
"{{{question}}}"

Your Answer:
`,
});

const askFollowUpFlow = ai.defineFlow(
  {
    name: 'askFollowUpFlow',
    inputSchema: AskFollowUpInputSchema,
    outputSchema: AskFollowUpOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
