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
    <Card className={`flex flex-col h-full group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${isPinned ? 'ring-2 ring-primary/50 shadow-lg bg-primary/5' : 'hover:border-primary/30'}`}>
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2 min-w-0 flex-1">
            {isPinned && (
              <div className="shrink-0 mt-1">
                <Pin className="h-4 w-4 text-primary fill-primary" />
              </div>
            )}
            <CardTitle className="font-headline text-base sm:text-lg leading-snug line-clamp-2">
              {item.title}
            </CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
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
        <CardDescription className="line-clamp-2 mt-2 text-sm">
          {item.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        <div className="flex items-center gap-2 flex-wrap">
          {item.language && (
            <Badge variant="secondary" className="text-xs font-medium">
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

      <CardFooter className="pt-3 border-t flex items-center justify-between gap-2 flex-shrink-0">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{formatDate(item.dateModified)}</span>
          <span className="sm:hidden">{formatDate(item.dateModified)?.split(' ').slice(0, 2).join(' ')}</span>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default" size="sm" className="h-8 px-3">
              <Eye className="mr-1.5 h-3.5 w-3.5" />
              Xem
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-6xl h-[90vh] overflow-hidden flex flex-col">
            {/* Compact Header */}
            <DialogHeader className="shrink-0 pb-2 border-b">
              <DialogTitle className="font-headline text-lg sm:text-xl pr-8">{item.title}</DialogTitle>
              <DialogDescription className="text-xs">
                {item.description}
              </DialogDescription>
            </DialogHeader>
            {/* Content takes maximum space */}
            <div className="flex-1 overflow-y-auto py-3 min-h-0">
              <div className="bg-muted/30 rounded-lg p-4 sm:p-6 h-full">
                {item.language ? (
                  <CodeBlock
                    language={item.language}
                    value={item.content}
                  />
                ) : (
                  <div
                    className="prose prose-sm sm:prose-base dark:prose-invert max-w-none leading-relaxed"
                    style={{ lineHeight: '1.75' }}
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />
                )}
              </div>
            </div>
            {/* Compact Footer */}
            <div className="shrink-0 pt-2 border-t flex items-center justify-between gap-4 flex-wrap">
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
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
