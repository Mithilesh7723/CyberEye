'use server';

import { detectAnomalousLogPatterns } from '@/ai/flows/detect-anomalous-log-patterns';
import type { DetectAnomalousLogPatternsOutput } from '@/ai/flows/detect-anomalous-log-patterns';
import { askFollowUp as askFollowUpFlow } from '@/ai/flows/ask-follow-up';
import type { AskFollowUpOutput } from '@/ai/flows/ask-follow-up';
import { analyzeCdrData as analyzeCdrDataFlow } from '@/ai/flows/analyze-cdr-data';
import type { AnalyzeCdrDataOutput } from '@/ai/flows/analyze-cdr-data';


export type AnalysisOutput = DetectAnomalousLogPatternsOutput | AnalyzeCdrDataOutput;
export type AnalysisType = 'logs' | 'cdr';

export async function analyze(input: { content: string; featureList?: string, type: AnalysisType }): Promise<{ data?: AnalysisOutput; error?: string }> {
  try {
    if (input.type === 'cdr') {
        const result = await analyzeCdrDataFlow({ cdrData: input.content });
        return { data: result };
    } else {
        const result = await detectAnomalousLogPatterns({
            logData: input.content,
            featureList: input.featureList || '',
        });
        return { data: result };
    }
  } catch (error) {
    console.error('Error analyzing:', error);
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
