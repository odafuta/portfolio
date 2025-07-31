// 基本的な型定義

/**
 * プロジェクトの状態
 */
export type ProjectStatus = 'draft' | 'published' | 'archived';

/**
 * プロジェクトのカテゴリ
 */
export type ProjectCategory = 'web-development' | 'data-analysis' | 'ai-ml' | 'infrastructure';

/**
 * 技術の分類
 */
export type TechnologyCategory = 'frontend' | 'backend' | 'database' | 'infrastructure' | 'tool';

/**
 * スキルレベル (1: 初心者, 5: エキスパート)
 */
export type SkillLevel = 1 | 2 | 3 | 4 | 5;

/**
 * 個人写真のカテゴリ
 */
export type PhotoCategory = 'professional' | 'casual' | 'working' | 'presentation' | 'learning';

/**
 * アスペクト比
 */
export type AspectRatio = '16/9' | '4/3' | '1/1';

/**
 * 個人写真の型定義
 */
export interface PersonalPhoto {
  id: string;
  filename: string;
  src: string;
  alt: string;
  title?: string;
  description?: string;
  category: PhotoCategory;
  aspectRatio: AspectRatio;
  order: number;
  isHero: boolean; // ヒーローセクションで使用するか
  metadata: {
    capturedAt?: Date;
    location?: string;
    photographer?: string;
    equipment?: string;
  };
  optimization: {
    webp: string;
    avif?: string;
    blurDataURL: string;
    width: number;
    height: number;
  };
}

/**
 * 技術情報
 */
export interface Technology {
  name: string;
  category: TechnologyCategory;
  level: SkillLevel;
  reason: string; // なぜこの技術を選んだか
}

/**
 * 設計判断
 */
export interface DesignDecision {
  decision: string;
  alternatives: string[];
  reasoning: string;
  tradeoffs: string[];
}

/**
 * 技術的課題
 */
export interface Challenge {
  problem: string;
  solution: string;
  learnings: string[];
  timeSpent?: number; // 時間（時間）
}

/**
 * 成果・結果
 */
export interface Outcome {
  type: 'quantitative' | 'qualitative';
  description: string;
  value?: string; // "30%向上", "2倍高速化" など
  evidence?: string; // 証拠・根拠
}

/**
 * メトリクス
 */
export interface Metric {
  name: string;
  value: number;
  unit: string;
  context: string;
  improvement?: {
    before: number;
    after: number;
    percentage: number;
  };
}

/**
 * タイムライン項目
 */
export interface TimelineItem {
  date: Date;
  title: string;
  description: string;
  milestone?: boolean;
}

/**
 * プロジェクト画像
 */
export interface ProjectImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
}

/**
 * プロジェクト動画
 */
export interface ProjectVideo {
  id: string;
  src: string;
  thumbnail: string;
  title: string;
  duration?: number;
}

/**
 * プロジェクトの型定義
 */
export interface Project {
  // 基本情報
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  
  // 4つのフレームワーク
  why: {
    problem: string;
    background: string;
    importance: string;
    existingSolutions: string[];
    targetUsers: string[];
  };
  
  how: {
    technologies: Technology[];
    architecture: string;
    designDecisions: DesignDecision[];
    challenges: Challenge[];
    timeline: TimelineItem[];
  };
  
  what: {
    outcomes: Outcome[];
    metrics: Metric[];
    businessValue: string;
    improvements: string[];
    demonstration: {
      demoUrl?: string;
      videoUrl?: string;
      screenshots: string[];
    };
  };
  
  soWhat: {
    technicalLearnings: string[];
    failures: string[];
    nextSteps: string[];
    applicability: string[];
    reflection: string;
  };
  
  // メタデータ
  status: ProjectStatus;
  featured: boolean;
  complexity: SkillLevel; // 1: 簡単, 5: 非常に複雑
  category: ProjectCategory;
  technologies: string[];
  
  // 期間・工数
  startDate: Date;
  endDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  
  // リンク
  githubUrl?: string;
  demoUrl?: string;
  articleUrl?: string;
  
  // メディア
  images: ProjectImage[];
  videos?: ProjectVideo[];
  
  // SEO
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  
  // 管理
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  viewCount?: number;
}

/**
 * スキル情報
 */
export interface Skill {
  name: string;
  level: SkillLevel;
  experience?: string; // "6ヶ月", "1年" など
  projects?: number; // 使用プロジェクト数
}

/**
 * スキルカテゴリ
 */
export interface SkillCategory {
  name: string;
  skills: Skill[];
  color?: string;
  icon?: string;
}

/**
 * プロジェクトフィルター
 */
export interface ProjectFilters {
  search: string;
  technologies: string[];
  category: ProjectCategory | 'all';
  status: ProjectStatus | 'all';
  complexity?: SkillLevel;
}

/**
 * ナビゲーション項目
 */
export interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
  current?: boolean;
  external?: boolean;
  download?: boolean;
}

/**
 * ページのメタデータ
 */
export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
}

/**
 * フォームの状態
 */
export interface FormState {
  isSubmitting: boolean;
  errors: Record<string, string>;
  success?: boolean;
  message?: string;
}

/**
 * API レスポンス
 */
export interface ApiResponse<T = any> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}

/**
 * 検索結果
 */
export interface SearchResult {
  projects: Project[];
  total: number;
  page: number;
  limit: number;
} 