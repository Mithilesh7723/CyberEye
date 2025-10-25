'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Upload, Wand2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';


interface LogAnalyzerProps {
  onAnalyze: (data: { logData: string; featureList: string }) => void;
}

export default function LogAnalyzer({ onAnalyze }: LogAnalyzerProps) {
  const [logData, setLogData] = useState('');
  const [featureList, setFeatureList] = useState('');
  const [fileName, setFileName] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze({ logData, featureList });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (typeof text === 'string') {
          setLogData(text);
          setFileName(file.name);
          toast({
            title: 'File loaded',
            description: `${file.name} has been loaded.`,
          });
        }
      };
      reader.onerror = () => {
        toast({
            variant: "destructive",
            title: "File Error",
            description: "Could not read the selected file.",
        });
      };
      reader.readAsText(file);
    }
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
                <CardDescription>Paste logs, or upload a log file to begin analysis.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="paste" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="paste">Paste Logs</TabsTrigger>
                    <TabsTrigger value="upload">Upload File</TabsTrigger>
                </TabsList>
                <TabsContent value="paste" className="mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="logData">Log Data</Label>
                        <Textarea
                        id="logData"
                        placeholder="e.g., Nov 10 06:33:32 web-server-1 sshd[25291]: Failed password for invalid user admin from 123.45.67.89 port 3333 ssh2"
                        value={logData}
                        onChange={(e) => {
                            setLogData(e.target.value);
                            if (fileName) setFileName('');
                        }}
                        className="min-h-[250px] font-code text-xs"
                        />
                    </div>
                </TabsContent>
                <TabsContent value="upload" className="mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="logFile">Log File</Label>
                        <div className="relative">
                            <Input
                                id="logFile"
                                type="file"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                accept=".log, .txt, text/plain"
                            />
                            <div className="flex min-h-[250px] items-center justify-center rounded-md border-2 border-dashed border-input bg-background p-6 text-center">
                                {fileName ? (
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <FileText className="h-10 w-10" />
                                        <span className="font-medium text-foreground">{fileName}</span>
                                        <span>Ready for analysis.</span>
                                        <Button variant="link" size="sm" onClick={() => { setFileName(''); setLogData(''); (document.getElementById('logFile') as HTMLInputElement).value = ''; }} className="text-primary">
                                            Choose a different file
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <Upload className="h-10 w-10" />
                                        <p>
                                            <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs">Supported file types: .log, .txt</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

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
