'use client';
import type { ContentItem } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';
import {
  Link as LinkIcon,
  Eye,
  Calendar,
  Pin,
  MoreVertical,
  Edit,
  Trash2,
} from 'lucide-react';
import { Badge } from './ui/badge';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const CodeBlock = dynamic(() => import('./ui/code-block').then((mod) => mod.CodeBlock), {
  loading: () => <div className="animate-pulse h-40 bg-muted rounded" />,
  ssr: false,
});

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Timestamp } from 'firebase/firestore';

interface ContentCardProps {
  item: ContentItem;
  onDeleteItem: (id: string) => void;
  onPinItem: (id: string, pinned: boolean) => void;
}

function formatDate(timestamp: any) {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate().toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
  return 'Đang chờ...';
}

export function ContentCard({ item, onDeleteItem, onPinItem }: ContentCardProps) {
  const isPinned = item.pinned === true;

  return (
    <Card className={`flex flex-col h-full group hover:shadow-md transition-all duration-200 ${isPinned ? 'ring-2 ring-primary/50 shadow-md' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {isPinned && (
              <Pin className="h-4 w-4 text-primary shrink-0 fill-primary" />
            )}
            <CardTitle className="font-headline text-lg leading-tight line-clamp-2">
              {item.title}
            </CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onPinItem(item.id, !isPinned)}
              >
                <Pin className={`mr-2 h-4 w-4 ${isPinned ? 'fill-current' : ''}`} />
                {isPinned ? 'Bỏ ghim' : 'Ghim lên đầu'}
              </DropdownMenuItem>
              <Link href={`/content/${item.type}/${item.id}/edit`} passHref>
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Chỉnh sửa
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDeleteItem(item.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="line-clamp-2 mt-1">
          {item.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow pb-3">
        <div className="flex items-center gap-2 flex-wrap">
          {item.language && (
            <Badge variant="secondary" className="text-xs">
              {item.language}
            </Badge>
          )}
          {item.link && (
            <Button variant="outline" size="sm" asChild className="h-7 text-xs">
              <Link href={item.link} target="_blank">
                <LinkIcon className="mr-1.5 h-3 w-3" />
                Link
              </Link>
            </Button>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          {formatDate(item.dateModified)}
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default" size="sm" className="h-8">
              <Eye className="mr-1.5 h-3.5 w-3.5" />
              Xem
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="shrink-0">
              <DialogTitle className="font-headline text-xl">{item.title}</DialogTitle>
              <DialogDescription className="text-sm">
                {item.description}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto mt-4 bg-muted/30 rounded-lg p-6">
              {item.language ? (
                <CodeBlock
                  language={item.language}
                  value={item.content}
                />
              ) : (
                <div
                  className="prose prose-sm dark:prose-invert max-w-none leading-relaxed [&>p]:mb-4 [&>h1]:mb-4 [&>h2]:mb-3 [&>h3]:mb-2 [&>ul]:mb-4 [&>ol]:mb-4 [&>blockquote]:mb-4"
                  style={{ lineHeight: '1.75' }}
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />
              )}
            </div>
            <div className="shrink-0 pt-4 border-t flex items-center justify-between">
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                Cập nhật: {formatDate(item.dateModified)}
              </p>
              <Link href={`/content/${item.type}/${item.id}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="mr-1.5 h-4 w-4" />
                  Chỉnh sửa
                </Button>
              </Link>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
