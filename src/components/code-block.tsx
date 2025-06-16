
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code.trim());
      setCopied(true);
      toast({ title: 'Copied!', description: 'Code copied to clipboard.' });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to copy code.' });
    }
  };

  return (
    <div className="overflow-hidden rounded-md bg-muted font-mono text-sm shadow-inner">
      <div className="flex items-center justify-between bg-slate-200 p-2 text-xs dark:bg-slate-700">
        <span className="text-slate-600 dark:text-slate-400">{language || 'code'}</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className="h-6 w-6 text-slate-600 hover:bg-slate-300 dark:text-slate-400 dark:hover:bg-slate-600"
          aria-label="Copy code"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>
      <pre className="overflow-x-auto p-3">
        <code className={`language-${language}`}>{code.trim()}</code>
      </pre>
    </div>
  );
}
