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
import { Textarea } from './ui/textarea';

interface NewItemDialogProps {
  categorySlug: CategorySlug;
  onAddItem: (item: Omit<KnowledgeEntry, 'id' | 'dateCreated' | 'dateModified' | 'userId'>) => void;
}

export function NewItemDialog({ categorySlug, onAddItem }: NewItemDialogProps) {
  const categoryInfo = categories[categorySlug];
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [open, setOpen] = useState(false);

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
    };
    onAddItem(newItem);
    setTitle('');
    setDescription('');
    setContent('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Thêm mới</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle className="font-headline">
            Thêm vào {categoryInfo.name}
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
              <Textarea
                placeholder="Bắt đầu viết ở đây..."
                className="min-h-[250px] w-full resize-y"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Tệp đính kèm</Label>
            <div className="col-span-3 flex gap-2">
              <Button variant="outline" disabled>
                <UploadCloud className="mr-2 h-4 w-4" />
                Tải tệp lên
              </Button>
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
