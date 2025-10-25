'use client';

import type { AnalysisOutput } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Archive, ClipboardList, Download, RefreshCw, ShieldAlert } from 'lucide-react';

interface AnalysisResultsProps {
  result: AnalysisOutput;
  onReset: () => void;
}

export default function AnalysisResults({ result, onReset }: AnalysisResultsProps) {
  const handleExport = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(result, null, 2)
    )}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'cybereye_analysis.json';
    link.click();
  };

  const ResultCard = ({ icon, title, content }: { icon: React.ReactNode; title: string; content: string }) => (
    <Card className="animate-in fade-in-50 duration-700">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
          <CardTitle className="font-headline text-xl">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="whitespace-pre-wrap rounded-md bg-card p-4 text-sm font-code text-card-foreground border">
          {content}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold font-headline">Analysis Complete</h2>
        <p className="text-muted-foreground">The AI has identified the following items for review.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-1">
        <ResultCard
          icon={<ShieldAlert className="h-5 w-5" />}
          title="Anomalous Patterns"
          content={result.anomalousPatterns}
        />
        <ResultCard
          icon={<ClipboardList className="h-5 w-5" />}
          title="Recommended Actions"
          content={result.recommendedActions}
        />
        <ResultCard
          icon={<Archive className="h-5 w-5" />}
          title="Evidence to Preserve"
          content={result.evidenceToPreserve}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <Button onClick={onReset} variant="outline">
          <RefreshCw />
          Analyze New Log
        </Button>
        <Button onClick={handleExport}>
          <Download />
          Export to JSON
        </Button>
      </div>
    </div>
  );
}
