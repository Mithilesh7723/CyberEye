'use server';

import { detectAnomalousLogPatterns } from '@/ai/flows/detect-anomalous-log-patterns';
import type { DetectAnomalousLogPatternsOutput } from '@/ai/flows/detect-anomalous-log-patterns';
import { askFollowUp as askFollowUpFlow } from '@/ai/flows/ask-follow-up';
import type { AskFollowUpOutput } from '@/ai/flows/ask-follow-up';


export type AnalysisOutput = DetectAnomalousLogPatternsOutput;

export async function analyzeLogs(input: { logData: string; featureList: string }): Promise<{ data?: AnalysisOutput; error?: string }> {
  try {
    const result = await detectAnomalousLogPatterns({
      logData: input.logData,
      featureList: input.featureList,
    });
    return { data: result };
  } catch (error) {
    console.error('Error analyzing logs:', error);
    return { error: error instanceof Error ? error.message : 'An unknown error occurred during analysis.' };
  }
}

export async function askFollowUp(input: { question: string; logData: string }): Promise<{ data?: AskFollowUpOutput; error?: string }> {
  try {
    const result = await askFollowUpFlow(input);
    return { data: result };
  } catch (error) {
    console.error('Error asking follow-up:', error);
    return { error: error instanceof Error ? error.message : 'An unknown error occurred during follow-up.' };
  }
}
