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

interface EditorProps {
    value: string;
    onChange: (value: string) => void;
}

export function Editor({ value, onChange }: EditorProps) {
  return (
    <div className="rounded-lg border bg-card">
      <div className="p-2 flex items-center gap-1 flex-wrap">
        <Button variant="ghost" size="icon" aria-label="Bold" disabled>
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Italic" disabled>
          <Italic className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Underline" disabled>
          <Underline className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Strikethrough" disabled>
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="h-8 mx-1" />
        <Button variant="ghost" size="icon" aria-label="Unordered List" disabled>
          <List className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Ordered List" disabled>
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="h-8 mx-1" />
        <Button variant="ghost" size="icon" aria-label="Quote" disabled>
          <Quote className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Code" disabled>
          <Code className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <Textarea
        placeholder="Bắt đầu viết ở đây..."
        className="min-h-[250px] w-full resize-y border-0 rounded-t-none focus-visible:ring-0 focus-visible:ring-offset-0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
