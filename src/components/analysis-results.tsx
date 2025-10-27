'use client';

import { useState } from 'react';
import type { AnalysisOutput, AnalysisType } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Archive, ClipboardList, Download, RefreshCw, ShieldAlert, Send, Bot, User, Loader, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AnalysisResultsProps {
  result: AnalysisOutput;
  type: AnalysisType;
  onReset: () => void;
  onFollowUp: (question: string) => Promise<string | null>;
}

type Message = {
    sender: 'user' | 'bot';
    text: string;
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

const LogAnalysisResults = ({ result }: { result: Extract<AnalysisOutput, { anomalousPatterns: any }> }) => (
    <>
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
    </>
);

const CdrAnalysisResults = ({ result }: { result: Extract<AnalysisOutput, { correlationSummary: any }> }) => (
    <>
        <ResultCard
            icon={<Phone className="h-5 w-5" />}
            title="Correlation Summary"
            content={result.correlationSummary}
        />
        <ResultCard
            icon={<ClipboardList className="h-5 w-5" />}
            title="Detailed Analysis"
            content={result.detailedAnalysis}
        />
        <ResultCard
            icon={<Archive className="h-5 w-5" />}
            title="Key Data Points"
            content={result.keyDataPoints}
        />
    </>
);


export default function AnalysisResults({ result, type, onReset, onFollowUp }: AnalysisResultsProps) {
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);

  const handleExport = () => {
    const exportData = {
        analysis: result,
        chat: chatHistory,
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(exportData, null, 2)
    )}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'cybereye_analysis_with_chat.json';
    link.click();
  };

  const handleFollowUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpQuestion.trim()) return;

    const newHistory: Message[] = [...chatHistory, { sender: 'user', text: followUpQuestion }];
    setChatHistory(newHistory);
    setFollowUpQuestion('');
    setIsReplying(true);

    const answer = await onFollowUp(followUpQuestion);
    
    if (answer) {
        setChatHistory([...newHistory, { sender: 'bot', text: answer }]);
    }
    setIsReplying(false);
  };

  const isCdrResult = (res: AnalysisOutput): res is Extract<AnalysisOutput, { correlationSummary: any }> => {
    return type === 'cdr' && 'correlationSummary' in res;
  }
  
  const isLogResult = (res: AnalysisOutput): res is Extract<AnalysisOutput, { anomalousPatterns: any }> => {
    return type === 'logs' && 'anomalousPatterns' in res;
  }


  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold font-headline">Analysis Complete</h2>
        <p className="text-muted-foreground">The AI has identified the following items for review.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-1">
        {isCdrResult(result) && <CdrAnalysisResults result={result} />}
        {isLogResult(result) && <LogAnalysisResults result={result} />}
      </div>

      <Card className="animate-in fade-in-50 duration-900">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Ask a Follow-up</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <ScrollArea className="h-[200px] w-full rounded-md border p-4 space-y-4">
                    {chatHistory.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                             {msg.sender === 'bot' && <Bot className="h-5 w-5 text-primary"/>}
                             <div className={`rounded-lg px-3 py-2 ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                <p className="text-sm">{msg.text}</p>
                             </div>
                             {msg.sender === 'user' && <User className="h-5 w-5"/>}
                        </div>
                    ))}
                    {isReplying && (
                        <div className="flex items-start gap-3">
                            <Bot className="h-5 w-5 text-primary"/>
                            <div className="rounded-lg px-3 py-2 bg-muted flex items-center gap-2">
                                <Loader className="h-4 w-4 animate-spin" />
                                <p className="text-sm">AI is thinking...</p>
                            </div>
                        </div>
                    )}
                </ScrollArea>
                <form onSubmit={handleFollowUpSubmit} className="flex items-center gap-2">
                    <Input
                        value={followUpQuestion}
                        onChange={(e) => setFollowUpQuestion(e.target.value)}
                        placeholder="e.g., Which number made the most calls?"
                        disabled={isReplying}
                    />
                    <Button type="submit" disabled={isReplying || !followUpQuestion.trim()}>
                        <Send />
                    </Button>
                </form>
            </div>
        </CardContent>
      </Card>


      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <Button onClick={onReset} variant="outline">
          <RefreshCw />
          Analyze New Data
        </Button>
        <Button onClick={handleExport}>
          <Download />
          Export to JSON
        </Button>
      </div>
    </div>
  );
}
