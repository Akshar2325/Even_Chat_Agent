
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
    <div className="overflow-hidden rounded-xl bg-[hsl(228,18%,10%)] font-mono text-sm shadow-lg border border-white/5">
      <div className="flex items-center justify-between px-4 py-2 bg-white/[0.04] border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/60"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/60"></span>
          </div>
          <span className="text-xs text-white/40 ml-1">{language || 'code'}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className="h-6 w-6 text-white/40 hover:text-white/80 hover:bg-white/10 transition-all"
          aria-label="Copy code"
        >
          {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed">
        <code className={`language-${language} text-green-300/90`}>{code.trim()}</code>
      </pre>
    </div>
  );
}
