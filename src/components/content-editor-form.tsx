'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud, Save, ArrowLeft, FileText, Code2 } from 'lucide-react';
import { Editor } from '@/components/editor';
import { CodeEditor } from '@/components/code-editor';
import { useRouter } from 'next/navigation';
import type { CategorySlug, KnowledgeEntry } from '@/lib/types';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ContentEditorFormProps {
    categorySlug: CategorySlug;
    initialData?: KnowledgeEntry;
    onSubmit: (data: Omit<KnowledgeEntry, 'id' | 'dateCreated' | 'dateModified' | 'userId'>) => Promise<void>;
    isSubmitting?: boolean;
}

type EditorMode = 'richtext' | 'code';

export function ContentEditorForm({
    categorySlug,
    initialData,
    onSubmit,
    isSubmitting = false,
}: ContentEditorFormProps) {
    const router = useRouter();
    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [content, setContent] = useState(initialData?.content || '');
    const [language, setLanguage] = useState<KnowledgeEntry['language'] | undefined>(initialData?.language);
    const [editorMode, setEditorMode] = useState<EditorMode>(initialData?.language ? 'code' : 'richtext');

    const handleSubmit = async () => {
        if (!title.trim()) {
            alert('Vui lòng nhập tiêu đề.');
            return;
        }
        if (!content.trim()) {
            alert('Vui lòng nhập nội dung.');
            return;
        }

        await onSubmit({
            title: title.trim(),
            description: description.trim() || title.trim(),
            content,
            type: categorySlug,
            language: editorMode === 'code' ? language : undefined,
        });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const textExtensions = ['.txt', '.js', '.ts', '.tsx', '.jsx', '.py', '.md', '.json', '.html', '.css', '.cs', '.lua', '.xml', '.yaml', '.yml', '.sql', '.sh', '.bash', '.ps1'];
        const isTextFile = file.type.startsWith('text/') || textExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

        if (isTextFile) {
            const text = await file.text();
            setContent(text);
            if (!title) setTitle(file.name.replace(/\.[^/.]+$/, '')); // Remove extension for title

            // Detect language and switch to code mode
            const ext = file.name.split('.').pop()?.toLowerCase();
            const langMap: Record<string, string> = {
                'py': 'python',
                'lua': 'lua',
                'html': 'html',
                'css': 'css',
                'js': 'javascript',
                'jsx': 'javascript',
                'ts': 'typescript',
                'tsx': 'typescript',
                'cs': 'csharp',
                'md': 'markdown',
                'json': 'json',
            };

            if (ext && langMap[ext]) {
                setLanguage(langMap[ext] as any);
                setEditorMode('code');
            }
        } else {
            alert("Hiện tại chỉ hỗ trợ đọc nội dung từ file text/code.");
        }
    };

    const handleModeChange = (mode: string) => {
        setEditorMode(mode as EditorMode);
        if (mode === 'richtext') {
            setLanguage(undefined);
        } else if (!language) {
            setLanguage('javascript');
        }
    };

    return (
        <div className="w-[95%] max-w-[1800px] mx-auto px-4 py-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="shrink-0"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-2xl font-bold font-headline">
                        {initialData ? 'Chỉnh sửa nội dung' : 'Tạo nội dung mới'}
                    </h1>
                </div>
                <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    size="lg"
                    className="shrink-0"
                >
                    <Save className="mr-2 h-4 w-4" />
                    {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
            </div>

            {/* Form */}
            <div className="grid gap-6 bg-card p-6 rounded-xl border shadow-sm">
                {/* Title and Description Row */}
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="title" className="text-sm font-medium">
                            Tiêu đề <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="title"
                            placeholder="Nhập tiêu đề..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="h-11 text-base"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description" className="text-sm font-medium">
                            Mô tả ngắn
                        </Label>
                        <Input
                            id="description"
                            placeholder="Mô tả ngắn gọn về nội dung..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="h-11"
                        />
                    </div>
                </div>

                {/* Content Area */}
                <div className="grid gap-3">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <Label className="text-sm font-medium">
                            Nội dung <span className="text-destructive">*</span>
                        </Label>
                        <div className="flex items-center gap-3">
                            {/* Mode Toggle */}
                            <Tabs value={editorMode} onValueChange={handleModeChange}>
                                <TabsList className="h-9">
                                    <TabsTrigger value="richtext" className="gap-1.5 px-3">
                                        <FileText className="h-4 w-4" />
                                        Rich Text
                                    </TabsTrigger>
                                    <TabsTrigger value="code" className="gap-1.5 px-3">
                                        <Code2 className="h-4 w-4" />
                                        Code
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>

                            {/* File Upload */}
                            <Input
                                type="file"
                                className="hidden"
                                id="file-upload"
                                onChange={handleFileUpload}
                            />
                            <Label htmlFor="file-upload" className="cursor-pointer">
                                <Button variant="outline" size="sm" asChild className="pointer-events-none h-9">
                                    <span>
                                        <UploadCloud className="mr-2 h-4 w-4" />
                                        Tải từ file
                                    </span>
                                </Button>
                            </Label>
                        </div>
                    </div>

                    {/* Editor */}
                    {editorMode === 'richtext' ? (
                        <Editor value={content} onChange={setContent} />
                    ) : (
                        <CodeEditor
                            value={content}
                            onChange={setContent}
                            language={language || 'javascript'}
                            onLanguageChange={(lang) => setLanguage(lang as any)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
