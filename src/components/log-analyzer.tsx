'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Upload, Wand2, Phone } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import type { AnalysisType } from '@/app/actions';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"


interface LogAnalyzerProps {
  onAnalyze: (data: { content: string; featureList?: string, type: AnalysisType }) => void;
}

export default function LogAnalyzer({ onAnalyze }: LogAnalyzerProps) {
  const [content, setContent] = useState('');
  const [featureList, setFeatureList] = useState('');
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [analysisType, setAnalysisType] = useState<AnalysisType>('logs');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze({ content, featureList, type: analysisType });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const allFileNames: string[] = [];
      const allFileContents: Promise<string>[] = [];
      
      for (const file of Array.from(files)) {
        allFileNames.push(file.name);
        allFileContents.push(file.text());
      }

      Promise.all(allFileContents).then(contents => {
        setContent(contents.join('\n\n--- End of File ---\n\n'));
        setFileNames(allFileNames);
        toast({
          title: 'Files loaded',
          description: `${allFileNames.join(', ')} has been loaded.`,
        });
      }).catch(() => {
        toast({
            variant: "destructive",
            title: "File Error",
            description: "Could not read the selected files.",
        });
      });
    }
  };

  const resetState = () => {
    setContent('');
    setFileNames([]);
    const fileInput = document.getElementById('file-upload-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  return (
    <Card className="w-full animate-in fade-in-50 duration-500">
      <CardHeader>
        <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                {analysisType === 'logs' ? <FileText className="h-6 w-6 text-primary" /> : <Phone className="h-6 w-6 text-primary" />}
            </div>
            <div>
                <CardTitle className="font-headline text-2xl">Data Analysis</CardTitle>
                <CardDescription>Select analysis type, then paste data or upload files.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label>Analysis Type</Label>
                <RadioGroup defaultValue="logs" value={analysisType} onValueChange={(value: AnalysisType) => setAnalysisType(value)} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="logs" id="r1" />
                        <Label htmlFor="r1">Cybersecurity Logs</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cdr" id="r2" />
                        <Label htmlFor="r2">Call Detail Records (CDRs)</Label>
                    </div>
                </RadioGroup>
            </div>
            
            <Tabs defaultValue="paste" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="paste">Paste Data</TabsTrigger>
                    <TabsTrigger value="upload">Upload File(s)</TabsTrigger>
                </TabsList>
                <TabsContent value="paste" className="mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="logData">
                            {analysisType === 'logs' ? 'Log Data' : 'CDR Data'}
                        </Label>
                        <Textarea
                            id="logData"
                            placeholder={analysisType === 'logs'
                                ? "e.g., Nov 10 06:33:32 web-server-1 sshd[25291]: Failed password..."
                                : "e.g., MSISDN,IMSI,CallType,StartTime,Duration,Destination..."
                            }
                            value={content}
                            onChange={(e) => {
                                setContent(e.target.value);
                                if (fileNames.length > 0) setFileNames([]);
                            }}
                            className="min-h-[250px] font-code text-xs"
                        />
                    </div>
                </TabsContent>
                <TabsContent value="upload" className="mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="file-upload-input">
                            {analysisType === 'logs' ? 'Log File(s)' : 'CDR File(s)'}
                        </Label>
                        <div className="relative">
                            <Input
                                id="file-upload-input"
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                accept=".log, .txt, .csv, text/plain"
                            />
                            <div className="flex min-h-[250px] items-center justify-center rounded-md border-2 border-dashed border-input bg-background p-6 text-center">
                                {fileNames.length > 0 ? (
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <FileText className="h-10 w-10" />
                                        <span className="font-medium text-foreground">{fileNames.join(', ')}</span>
                                        <span>Ready for analysis.</span>
                                        <Button variant="link" size="sm" onClick={resetState} className="text-primary">
                                            Choose different files
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <Upload className="h-10 w-10" />
                                        <p>
                                            <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs">You can select multiple files (.log, .txt, .csv)</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

          {analysisType === 'logs' && (
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
          )}

          <Button type="submit" className="w-full sm:w-auto">
            <Wand2 />
            Analyze
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
