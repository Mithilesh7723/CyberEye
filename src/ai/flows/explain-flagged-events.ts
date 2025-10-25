'use server';
/**
 * @fileOverview This file defines a Genkit flow for explaining flagged security events.
 *
 * - explainFlaggedEvent - An async function that takes a flagged event description and returns a natural language explanation with recommended actions and evidence to preserve.
 * - ExplainFlaggedEventInput - The input type for the explainFlaggedEvent function.
 * - ExplainFlaggedEventOutput - The return type for the explainFlaggedEvent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainFlaggedEventInputSchema = z.object({
  eventDescription: z.string().describe('A detailed description of the flagged security event.'),
});
export type ExplainFlaggedEventInput = z.infer<typeof ExplainFlaggedEventInputSchema>;

const ExplainFlaggedEventOutputSchema = z.object({
  explanation: z.string().describe('A natural language explanation of the event.'),
  recommendedActions: z.string().describe('Recommended immediate actions for investigators.'),
  evidenceToPreserve: z.string().describe('Specific evidence (log lines, IPs, timestamps, files) to preserve.'),
});
export type ExplainFlaggedEventOutput = z.infer<typeof ExplainFlaggedEventOutputSchema>;

export async function explainFlaggedEvent(input: ExplainFlaggedEventInput): Promise<ExplainFlaggedEventOutput> {
  return explainFlaggedEventFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainFlaggedEventPrompt',
  input: {schema: ExplainFlaggedEventInputSchema},
  output: {schema: ExplainFlaggedEventOutputSchema},
  prompt: `You are an AI assistant helping cybercrime investigators understand security events.
  Given the following event description, provide a natural language explanation, recommend immediate actions, and list evidence to preserve.

  Event Description: {{{eventDescription}}}

  Explanation:
  Recommended Actions:
  Evidence to Preserve: `,
});

const explainFlaggedEventFlow = ai.defineFlow(
  {
    name: 'explainFlaggedEventFlow',
    inputSchema: ExplainFlaggedEventInputSchema,
    outputSchema: ExplainFlaggedEventOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
