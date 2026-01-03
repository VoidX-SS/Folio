export const categories = {
  dashboard: { name: 'Bảng điều khiển', icon: 'LayoutDashboard' },
  novels: { name: 'Tiểu thuyết & Truyện', icon: 'FileText' },
  'large-projects': { name: 'Dự Án Lớn', icon: 'FolderGit2' },
  'small-projects': { name: 'Dự Án Nhỏ', icon: 'FolderGit' },
  'fun-code': { name: 'Code Quậy Phá', icon: 'Wand2' },
  ideas: { name: 'Ý Tưởng', icon: 'Lightbulb' },
  account: { name: 'Tài Khoản', icon: 'User' },
  exceptions: { name: 'Ngoại Lệ', icon: 'Archive' },
} as const;

export type CategorySlug = keyof typeof categories;

// This is an alias for KnowledgeEntry for simplicity in the UI code
export type ContentItem = KnowledgeEntry;

export type KnowledgeEntry = {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: CategorySlug;
  content: string;
  filePaths?: string[];
  links?: string[];
  dateCreated: any;
  dateModified: any;
  language?: 'python' | 'lua' | 'html' | 'css' | 'javascript' | 'csharp' | 'markdown';
  imageUrl?: string;
  link?: string;
  pinned?: boolean; // Pin items to show at top
};
