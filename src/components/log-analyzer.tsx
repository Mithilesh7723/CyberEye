'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Wand2 } from 'lucide-react';

interface LogAnalyzerProps {
  onAnalyze: (data: { logData: string; featureList: string }) => void;
}

export default function LogAnalyzer({ onAnalyze }: LogAnalyzerProps) {
  const [logData, setLogData] = useState('');
  const [featureList, setFeatureList] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze({ logData, featureList });
  };

  return (
    <Card className="w-full animate-in fade-in-50 duration-500">
      <CardHeader>
        <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
                <CardTitle className="font-headline text-2xl">Log Analysis</CardTitle>
                <CardDescription>Paste or type your system logs below to begin analysis.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="logData">Log Data</Label>
            <Textarea
              id="logData"
              placeholder="e.g., Nov 10 06:33:32 web-server-1 sshd[25291]: Failed password for invalid user admin from 123.45.67.89 port 3333 ssh2"
              value={logData}
              onChange={(e) => setLogData(e.target.value)}
              className="min-h-[250px] font-code text-xs"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="featureList">Numeric Features (Optional)</Label>
            <Input
              id="featureList"
              placeholder="e.g., loginCounts, requestFrequencies"
              value={featureList}
              onChange={(e) => setFeatureList(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Comma-separated list of numeric features for advanced anomaly detection.
            </p>
          </div>
          <Button type="submit" className="w-full sm:w-auto">
            <Wand2 />
            Analyze Logs
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
