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
import { MoreVertical, Edit, Trash2, Link as LinkIcon } from 'lucide-react';
import { Badge } from './ui/badge';
import Link from 'next/link';

interface ContentCardProps {
  item: ContentItem;
}

export function ContentCard({ item }: ContentCardProps) {
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
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive">
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
            {item.type === 'code' && (
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
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Cập nhật: {new Date(item.date).toLocaleDateString('vi-VN')}
        </p>
      </CardFooter>
    </Card>
  );
}

    