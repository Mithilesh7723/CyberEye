import { Eye } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center">
          <div className="flex items-center gap-2">
            <Eye className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold font-headline text-foreground">
              CyberEye
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
}
