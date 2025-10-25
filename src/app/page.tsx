'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { analyzeLogs, type AnalysisOutput, askFollowUp } from '@/app/actions';
import Header from '@/components/header';
import LogAnalyzer from '@/components/log-analyzer';
import AnalysisResults from '@/components/analysis-results';
import { Loader } from 'lucide-react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisOutput | null>(null);
  const [logData, setLogData] = useState('');
  const { toast } = useToast();

  const handleAnalysis = async (formData: { logData: string; featureList: string }) => {
    if (!formData.logData.trim()) {
      toast({
        variant: 'destructive',
        title: 'Input Error',
        description: 'Log data cannot be empty.',
      });
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);
    setLogData(formData.logData); // Save log data for follow-ups

    try {
      const result = await analyzeLogs(formData);
      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Analysis Failed',
          description: result.error,
        });
      } else {
        setAnalysisResult(result.data);
      }
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'An unexpected error occurred',
        description: e instanceof Error ? e.message : 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFollowUp = async (question: string) => {
    const result = await askFollowUp({ question, logData });
    if (result.error) {
        toast({
            variant: 'destructive',
            title: 'Follow-up Failed',
            description: result.error,
        });
        return null;
    }
    return result.data?.answer || "Sorry, I couldn't find an answer.";
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setLogData('');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="w-full max-w-4xl mx-auto">
          {isLoading && (
            <div className="flex flex-col items-center justify-center gap-4 text-center p-8">
              <Loader className="h-12 w-12 animate-spin text-primary" />
              <h2 className="text-2xl font-headline font-semibold">Analyzing Logs...</h2>
              <p className="text-muted-foreground">The AI is searching for anomalous patterns. Please wait.</p>
            </div>
          )}

          {!isLoading && analysisResult && (
            <AnalysisResults result={analysisResult} onReset={handleReset} onFollowUp={handleFollowUp} />
          )}

          {!isLoading && !analysisResult && (
            <LogAnalyzer onAnalyze={handleAnalysis} />
          )}
        </div>
      </main>
    </div>
  );
}
