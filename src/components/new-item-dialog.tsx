'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Editor } from '@/components/editor';
import { UploadCloud, FolderUp } from 'lucide-react';
import type { CategorySlug } from '@/lib/types';
import { categories } from '@/lib/types';

interface NewItemDialogProps {
  categorySlug: CategorySlug;
}

export function NewItemDialog({ categorySlug }: NewItemDialogProps) {
  const categoryInfo = categories[categorySlug];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Thêm mới</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Thêm vào {categoryInfo.name}</DialogTitle>
          <DialogDescription>
            Điền thông tin chi tiết dưới đây. Nhấn lưu khi bạn hoàn tất.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Tiêu đề
            </Label>
            <Input id="title" placeholder="Tiêu đề của bạn" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="content" className="text-right pt-2">
              Nội dung
            </Label>
            <div className="col-span-3">
              <Editor />
            </div>
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Tệp đính kèm
            </Label>
            <div className="col-span-3 flex gap-2">
                <Button variant="outline">
                    <UploadCloud className="mr-2 h-4 w-4"/>
                    Tải tệp lên
                </Button>
                <Button variant="outline">
                    <FolderUp className="mr-2 h-4 w-4"/>
                    Tải thư mục
                </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Lưu thay đổi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
