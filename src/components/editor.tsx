'use client';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

export function Editor() {
  return (
    <div className="rounded-lg border bg-card">
      <div className="p-2 flex items-center gap-1 flex-wrap">
        <Button variant="ghost" size="icon" aria-label="Bold">
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Italic">
          <Italic className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Underline">
          <Underline className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Strikethrough">
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="h-8 mx-1" />
        <Button variant="ghost" size="icon" aria-label="Unordered List">
          <List className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Ordered List">
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="h-8 mx-1" />
        <Button variant="ghost" size="icon" aria-label="Quote">
          <Quote className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Code">
          <Code className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <Textarea
        placeholder="Bắt đầu viết ở đây..."
        className="min-h-[250px] w-full resize-y border-0 rounded-t-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
}
