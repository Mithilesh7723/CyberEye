'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { analyze, type AnalysisOutput, askFollowUp, AnalysisType } from '@/app/actions';
import Header from '@/components/header';
import LogAnalyzer from '@/components/log-analyzer';
import AnalysisResults from '@/components/analysis-results';
import { Loader } from 'lucide-react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisOutput | null>(null);
  const [analysisType, setAnalysisType] = useState<AnalysisType | null>(null);
  const [originalContent, setOriginalContent] = useState('');
  const { toast } = useToast();

  const handleAnalysis = async (formData: { content: string; featureList?: string; type: AnalysisType }) => {
    if (!formData.content.trim()) {
      toast({
        variant: 'destructive',
        title: 'Input Error',
        description: 'Input data cannot be empty.',
      });
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);
    setOriginalContent(formData.content); // Save content for follow-ups
    setAnalysisType(formData.type);

    try {
      const result = await analyze(formData);
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
    const result = await askFollowUp({ question, logData: originalContent });
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
    setOriginalContent('');
    setAnalysisType(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="w-full max-w-4xl mx-auto">
          {isLoading && (
            <div className="flex flex-col items-center justify-center gap-4 text-center p-8">
              <Loader className="h-12 w-12 animate-spin text-primary" />
              <h2 className="text-2xl font-headline font-semibold">Analyzing Data...</h2>
              <p className="text-muted-foreground">The AI is correlating patterns and searching for anomalies. Please wait.</p>
            </div>
          )}

          {!isLoading && analysisResult && analysisType && (
            <AnalysisResults result={analysisResult} type={analysisType} onReset={handleReset} onFollowUp={handleFollowUp} />
          )}

          {!isLoading && !analysisResult && (
            <LogAnalyzer onAnalyze={handleAnalysis} />
          )}
        </div>
      </main>
    </div>
  );
}
