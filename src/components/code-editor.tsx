'use client';

import { useEffect, useRef, useState } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { json } from '@codemirror/lang-json';
import { markdown } from '@codemirror/lang-markdown';
import { StreamLanguage } from '@codemirror/language';
import { lua } from '@codemirror/legacy-modes/mode/lua';
import { csharp } from '@codemirror/legacy-modes/mode/clike';
import { oneDark } from '@codemirror/theme-one-dark';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface CodeEditorProps {
    value: string;
    onChange: (value: string) => void;
    language?: string;
    onLanguageChange?: (language: string) => void;
}

const languageExtensions: Record<string, () => any> = {
    javascript: javascript,
    typescript: () => javascript({ typescript: true }),
    python: python,
    html: html,
    css: css,
    json: json,
    markdown: markdown,
    lua: () => StreamLanguage.define(lua),
    csharp: () => StreamLanguage.define(csharp),
    text: () => [],
};

const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'lua', label: 'Lua' },
    { value: 'csharp', label: 'C#' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'json', label: 'JSON' },
    { value: 'markdown', label: 'Markdown' },
    { value: 'text', label: 'Plain Text' },
];

export function CodeEditor({
    value,
    onChange,
    language = 'javascript',
    onLanguageChange,
}: CodeEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<EditorView | null>(null);
    const [currentLanguage, setCurrentLanguage] = useState(language);

    useEffect(() => {
        if (!editorRef.current) return;

        const langExt = languageExtensions[currentLanguage] || languageExtensions.text;

        const state = EditorState.create({
            doc: value,
            extensions: [
                basicSetup,
                langExt(),
                oneDark,
                EditorView.updateListener.of((update) => {
                    if (update.docChanged) {
                        onChange(update.state.doc.toString());
                    }
                }),
                EditorView.theme({
                    '&': {
                        height: '500px',
                        fontSize: '14px',
                    },
                    '.cm-scroller': {
                        overflow: 'auto',
                    },
                    '.cm-content': {
                        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
                    },
                }),
                EditorView.lineWrapping,
            ],
        });

        const view = new EditorView({
            state,
            parent: editorRef.current,
        });

        viewRef.current = view;

        return () => {
            view.destroy();
        };
    }, [currentLanguage]);

    useEffect(() => {
        if (viewRef.current) {
            const currentValue = viewRef.current.state.doc.toString();
            if (currentValue !== value) {
                viewRef.current.dispatch({
                    changes: {
                        from: 0,
                        to: currentValue.length,
                        insert: value,
                    },
                });
            }
        }
    }, [value]);

    const handleLanguageChange = (newLanguage: string) => {
        setCurrentLanguage(newLanguage);
        onLanguageChange?.(newLanguage);
    };

    return (
        <div className="rounded-lg border bg-card overflow-hidden">
            <div className="flex items-center justify-between p-2 border-b bg-muted/30">
                <div className="flex items-center gap-2">
                    <Label className="text-sm text-muted-foreground">Language:</Label>
                    <Select value={currentLanguage} onValueChange={handleLanguageChange}>
                        <SelectTrigger className="w-[150px] h-8">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {languageOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <span className="text-xs text-muted-foreground">Code Mode</span>
            </div>
            <div ref={editorRef} className="min-h-[500px]" />
        </div>
    );
}
