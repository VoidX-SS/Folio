'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud, FolderUp } from 'lucide-react';
import type { CategorySlug, KnowledgeEntry } from '@/lib/types';
import { categories } from '@/lib/types';
import { Editor } from './editor';

interface NewItemDialogProps {
  categorySlug: CategorySlug;
  onAddItem: (item: Omit<KnowledgeEntry, 'id' | 'dateCreated' | 'dateModified' | 'userId'>) => void;
  initialData?: KnowledgeEntry;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function NewItemDialog({ categorySlug, onAddItem, initialData, open: controlledOpen, onOpenChange }: NewItemDialogProps) {
  const categoryInfo = categories[categorySlug];
  // Initialize state from initialData if present
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [language, setLanguage] = useState<KnowledgeEntry['language'] | undefined>(initialData?.language);

  // Use controlled state or internal state
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? onOpenChange! : setInternalOpen;

  // Update state when initialData changes (for controlled reuse)
  React.useEffect(() => {
    if (open && initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setContent(initialData.content);
      setLanguage(initialData.language);
    } else if (open && !initialData) {
      // Reset if opening in "Add" mode
      setTitle('');
      setDescription('');
      setContent('');
      setLanguage(undefined);
    }
  }, [open, initialData]);

  const handleSave = () => {
    if (!title || !description || !content) {
      alert('Vui lòng điền đầy đủ các trường.');
      return;
    }
    const newItem: Omit<KnowledgeEntry, 'id' | 'dateCreated' | 'dateModified' | 'userId'> = {
      title,
      description,
      content,
      type: categorySlug,
      language,
    };
    onAddItem(newItem);
    if (!isControlled) {
      setTitle('');
      setDescription('');
      setContent('');
      setLanguage(undefined);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button>Thêm mới</Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-headline">
            {initialData ? 'Chỉnh sửa' : 'Thêm vào'} {categoryInfo.name}
          </DialogTitle>
          <DialogDescription>
            Điền thông tin chi tiết dưới đây. Nhấn lưu khi bạn hoàn tất.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Tiêu đề
            </Label>
            <Input
              id="title"
              placeholder="Tiêu đề của bạn"
              className="col-span-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Mô tả
            </Label>
            <Input
              id="description"
              placeholder="Mô tả ngắn gọn"
              className="col-span-3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="content" className="text-right pt-2">
              Nội dung
            </Label>
            <div className="col-span-3">
              <Editor value={content} onChange={setContent} />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Tệp đính kèm</Label>
            <div className="col-span-3 flex gap-2 items-center">
              <Input
                type="file"
                className="hidden"
                id="file-upload"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  // Simple logic to read text/code files
                  if (
                    file.type.startsWith('text/') ||
                    file.name.endsWith('.js') ||
                    file.name.endsWith('.ts') ||
                    file.name.endsWith('.tsx') ||
                    file.name.endsWith('.py') ||
                    file.name.endsWith('.md') ||
                    file.name.endsWith('.json') ||
                    file.name.endsWith('.html') ||
                    file.name.endsWith('.css') ||
                    file.name.endsWith('.cs') ||
                    file.name.endsWith('.lua')
                  ) {
                    const text = await file.text();
                    setContent(text);
                    if (!title) setTitle(file.name);

                    // Detect language
                    if (file.name.endsWith('.py')) setLanguage('python');
                    else if (file.name.endsWith('.lua')) setLanguage('lua');
                    else if (file.name.endsWith('.html')) setLanguage('html');
                    else if (file.name.endsWith('.css')) setLanguage('css');
                    else if (file.name.endsWith('.js') || file.name.endsWith('.ts') || file.name.endsWith('.tsx')) setLanguage('javascript');
                    else if (file.name.endsWith('.cs')) setLanguage('csharp');
                    else if (file.name.endsWith('.md')) setLanguage('markdown');
                    else setLanguage(undefined);

                  } else {
                    alert("Hiện tại chỉ hỗ trợ đọc nội dung từ file text/code.");
                  }
                }}
              />
              <Label htmlFor="file-upload" className="cursor-pointer">
                <Button variant="outline" asChild className="pointer-events-none">
                  <span>
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Tải tệp lên
                  </span>
                </Button>
              </Label>
              <Button variant="outline" disabled>
                <FolderUp className="mr-2 h-4 w-4" />
                Tải thư mục
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Hủy</Button>
          </DialogClose>
          <Button onClick={handleSave}>Lưu thay đổi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
