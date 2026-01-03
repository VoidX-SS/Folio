'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Plus,
    MoreVertical,
    Edit,
    Trash2,
    GripVertical,
    FileText,
    FolderGit2,
    FolderGit,
    Wand2,
    Lightbulb,
    User,
    Archive,
    BookOpen,
    Code,
    Briefcase,
    Palette,
    Music,
    Film,
    Camera,
    Heart,
    Star,
    Bookmark,
    Tag,
    Database,
    Globe,
    Rocket,
    Trophy,
    Zap,
    Coffee,
    Gamepad2,
    Puzzle,
    Wrench,
    Cpu,
    Terminal,
    Smartphone,
    Settings,
} from 'lucide-react';
import type { DynamicCategory, IconName } from '@/lib/category-types';
import { availableIcons } from '@/lib/category-types';

// Icon mapping
const iconComponents: Record<IconName, React.ComponentType<{ className?: string }>> = {
    FileText,
    FolderGit2,
    FolderGit,
    Wand2,
    Lightbulb,
    User,
    Archive,
    BookOpen,
    Code,
    Briefcase,
    Palette,
    Music,
    Film,
    Camera,
    Heart,
    Star,
    Bookmark,
    Tag,
    Database,
    Globe,
    Rocket,
    Trophy,
    Zap,
    Coffee,
    Gamepad2,
    Puzzle,
    Wrench,
    Cpu,
    Terminal,
    Smartphone,
};

interface CategoryManagerProps {
    categories: DynamicCategory[];
    onCreateCategory: (data: { name: string; icon: string }) => void;
    onUpdateCategory: (id: string, data: { name?: string; icon?: string }) => void;
    onDeleteCategory: (id: string) => void;
}

export function CategoryManager({
    categories,
    onCreateCategory,
    onUpdateCategory,
    onDeleteCategory,
}: CategoryManagerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [newName, setNewName] = useState('');
    const [newIcon, setNewIcon] = useState<string>('FileText');
    const [editName, setEditName] = useState('');
    const [editIcon, setEditIcon] = useState('');

    const handleCreate = () => {
        if (newName.trim()) {
            onCreateCategory({ name: newName.trim(), icon: newIcon });
            setNewName('');
            setNewIcon('FileText');
            setIsCreating(false);
        }
    };

    const handleEdit = (category: DynamicCategory) => {
        setIsEditing(category.id);
        setEditName(category.name);
        setEditIcon(category.icon);
    };

    const handleSaveEdit = (id: string) => {
        if (editName.trim()) {
            onUpdateCategory(id, { name: editName.trim(), icon: editIcon });
            setIsEditing(null);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(null);
        setEditName('');
        setEditIcon('');
    };

    const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-start gap-2 h-8">
                    <Settings className="h-4 w-4" />
                    <span>Quản lý mục</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Quản lý danh mục
                    </DialogTitle>
                    <DialogDescription>
                        Thêm, chỉnh sửa hoặc xóa các danh mục trong thanh bên.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Add new category */}
                    {!isCreating ? (
                        <Button
                            variant="outline"
                            className="w-full justify-start gap-2"
                            onClick={() => setIsCreating(true)}
                        >
                            <Plus className="h-4 w-4" />
                            Thêm danh mục mới
                        </Button>
                    ) : (
                        <div className="space-y-3 p-3 border rounded-lg bg-muted/30">
                            <div className="space-y-2">
                                <Label htmlFor="new-name">Tên danh mục</Label>
                                <Input
                                    id="new-name"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="Nhập tên danh mục..."
                                    autoFocus
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Biểu tượng</Label>
                                <Select value={newIcon} onValueChange={setNewIcon}>
                                    <SelectTrigger>
                                        <SelectValue>
                                            <div className="flex items-center gap-2">
                                                {(() => {
                                                    const IconComp = iconComponents[newIcon as IconName];
                                                    return IconComp ? <IconComp className="h-4 w-4" /> : null;
                                                })()}
                                                <span>{newIcon}</span>
                                            </div>
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <ScrollArea className="h-60">
                                            {availableIcons.map((icon) => {
                                                const IconComp = iconComponents[icon];
                                                return (
                                                    <SelectItem key={icon} value={icon}>
                                                        <div className="flex items-center gap-2">
                                                            <IconComp className="h-4 w-4" />
                                                            <span>{icon}</span>
                                                        </div>
                                                    </SelectItem>
                                                );
                                            })}
                                        </ScrollArea>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" onClick={handleCreate}>
                                    Tạo
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                        setIsCreating(false);
                                        setNewName('');
                                    }}
                                >
                                    Hủy
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Category list */}
                    <ScrollArea className="h-[300px] pr-3">
                        <div className="space-y-2">
                            {sortedCategories.map((category) => {
                                const IconComp = iconComponents[category.icon as IconName] || FileText;
                                const isCurrentlyEditing = isEditing === category.id;

                                if (isCurrentlyEditing) {
                                    return (
                                        <div
                                            key={category.id}
                                            className="space-y-3 p-3 border rounded-lg bg-muted/30"
                                        >
                                            <div className="space-y-2">
                                                <Label>Tên</Label>
                                                <Input
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    autoFocus
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Biểu tượng</Label>
                                                <Select value={editIcon} onValueChange={setEditIcon}>
                                                    <SelectTrigger>
                                                        <SelectValue>
                                                            <div className="flex items-center gap-2">
                                                                {(() => {
                                                                    const Ic = iconComponents[editIcon as IconName];
                                                                    return Ic ? <Ic className="h-4 w-4" /> : null;
                                                                })()}
                                                                <span>{editIcon}</span>
                                                            </div>
                                                        </SelectValue>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <ScrollArea className="h-60">
                                                            {availableIcons.map((icon) => {
                                                                const Ic = iconComponents[icon];
                                                                return (
                                                                    <SelectItem key={icon} value={icon}>
                                                                        <div className="flex items-center gap-2">
                                                                            <Ic className="h-4 w-4" />
                                                                            <span>{icon}</span>
                                                                        </div>
                                                                    </SelectItem>
                                                                );
                                                            })}
                                                        </ScrollArea>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" onClick={() => handleSaveEdit(category.id)}>
                                                    Lưu
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                                                    Hủy
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <div
                                        key={category.id}
                                        className="flex items-center gap-2 p-2 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                                    >
                                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                                        <IconComp className="h-4 w-4 text-primary" />
                                        <span className="flex-1 text-sm font-medium truncate">
                                            {category.name}
                                        </span>
                                        {category.isDefault && (
                                            <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded">
                                                Mặc định
                                            </span>
                                        )}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEdit(category)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Chỉnh sửa
                                                </DropdownMenuItem>
                                                {!category.isDefault && (
                                                    <DropdownMenuItem
                                                        className="text-destructive focus:text-destructive"
                                                        onClick={() => onDeleteCategory(category.id)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Xóa
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                );
                            })}
                        </div>
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Export icon components for use in sidebar
export { iconComponents };
