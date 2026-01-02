'use client';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface CodeBlockProps {
    language: string;
    value: string;
    className?: string;
}

export function CodeBlock({ language, value, className }: CodeBlockProps) {
    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = () => {
        if (!value) return;
        navigator.clipboard.writeText(value);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className={`relative rounded-lg overflow-hidden border bg-zinc-950 ${className}`}>
            <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
                <span className="text-xs text-zinc-400 font-mono">{language}</span>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={copyToClipboard}
                    className="h-6 w-6 text-zinc-400 hover:text-white"
                >
                    {isCopied ? (
                        <Check className="h-3 w-3" />
                    ) : (
                        <Copy className="h-3 w-3" />
                    )}
                    <span className="sr-only">Copy code</span>
                </Button>
            </div>
            <div className="text-sm overflow-x-auto">
                <SyntaxHighlighter
                    language={language || 'text'}
                    style={vscDarkPlus}
                    customStyle={{ margin: 0, padding: '1rem', background: 'transparent' }}
                    wrapLines={true}
                >
                    {value}
                </SyntaxHighlighter>
            </div>
        </div>
    );
}
