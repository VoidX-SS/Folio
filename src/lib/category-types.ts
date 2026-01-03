// Dynamic category type for user-created categories
export type DynamicCategory = {
    id: string;
    slug: string;
    name: string;
    icon: string;
    order: number;
    isDefault: boolean; // System categories can't be deleted
    dateCreated: any;
    dateModified: any;
};

// Available icons for categories
export const availableIcons = [
    'FileText',
    'FolderGit2',
    'FolderGit',
    'Wand2',
    'Lightbulb',
    'User',
    'Archive',
    'BookOpen',
    'Code',
    'Briefcase',
    'Palette',
    'Music',
    'Film',
    'Camera',
    'Heart',
    'Star',
    'Bookmark',
    'Tag',
    'Database',
    'Globe',
    'Rocket',
    'Trophy',
    'Zap',
    'Coffee',
    'Gamepad2',
    'Puzzle',
    'Wrench',
    'Cpu',
    'Terminal',
    'Smartphone',
] as const;

export type IconName = typeof availableIcons[number];

// Default categories that come with the app
export const defaultCategories: Omit<DynamicCategory, 'id' | 'dateCreated' | 'dateModified'>[] = [
    { slug: 'novels', name: 'Tiểu thuyết & Truyện', icon: 'FileText', order: 0, isDefault: true },
    { slug: 'large-projects', name: 'Dự Án Lớn', icon: 'FolderGit2', order: 1, isDefault: true },
    { slug: 'small-projects', name: 'Dự Án Nhỏ', icon: 'FolderGit', order: 2, isDefault: true },
    { slug: 'fun-code', name: 'Code Quậy Phá', icon: 'Wand2', order: 3, isDefault: true },
    { slug: 'ideas', name: 'Ý Tưởng', icon: 'Lightbulb', order: 4, isDefault: true },
    { slug: 'account', name: 'Tài Khoản', icon: 'User', order: 5, isDefault: true },
    { slug: 'exceptions', name: 'Ngoại Lệ', icon: 'Archive', order: 6, isDefault: true },
];
