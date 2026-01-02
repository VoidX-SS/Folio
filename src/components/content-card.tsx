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
  MoreVertical,
  Edit,
  Trash2,
  Link as LinkIcon,
  View,
} from 'lucide-react';
import { Badge } from './ui/badge';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Timestamp } from 'firebase/firestore';


interface ContentCardProps {
  item: ContentItem;
  onDeleteItem: (id: string) => void;
}

function formatDate(timestamp: any) {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate().toLocaleDateString('vi-VN');
    }
    // Fallback for cases where it might not be a timestamp yet (e.g., local state before Firestore sync)
    if(timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate().toLocaleDateString('vi-VN');
    }
    return 'Đang chờ...';
}

export function ContentCard({ item, onDeleteItem }: ContentCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="font-headline">{item.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem disabled>
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </DropdownMenuItem>
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
        <CardDescription>{item.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center gap-2">
          {item.type === 'fun-code' && (
            <Badge variant="secondary">{item.language}</Badge>
          )}
          {item.link && (
            <Button variant="outline" size="sm" asChild>
              <Link href={item.link} target="_blank">
                <LinkIcon className="mr-2 h-3 w-3" />
                Link
              </Link>
            </Button>
          )}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <View className="mr-2 h-3 w-3" />
                Xem
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-headline">{item.title}</DialogTitle>
                <DialogDescription>
                  {item.description}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 text-sm text-foreground bg-muted/50 p-4 rounded-md max-h-[50vh] overflow-y-auto">
                <pre className="whitespace-pre-wrap font-body">{item.content}</pre>
              </div>
              <DialogFooter>
                  <p className="text-sm text-muted-foreground">
                    Cập nhật: {formatDate(item.dateModified)}
                  </p>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
           Cập nhật: {formatDate(item.dateModified)}
        </p>
      </CardFooter>
    </Card>
  );
}
