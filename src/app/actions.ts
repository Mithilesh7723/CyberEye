'use server';

import { detectAnomalousLogPatterns } from '@/ai/flows/detect-anomalous-log-patterns';
import type { DetectAnomalousLogPatternsOutput } from '@/ai/flows/detect-anomalous-log-patterns';

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
