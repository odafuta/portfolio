# Web開発ベストプラクティス ガイド

## 目次
1. [プロジェクト構成とアーキテクチャ](#1-プロジェクト構成とアーキテクチャ)
2. [コード品質とメンテナビリティ](#2-コード品質とメンテナビリティ)
3. [パフォーマンス最適化](#3-パフォーマンス最適化)
4. [セキュリティ](#4-セキュリティ)
5. [アクセシビリティ](#5-アクセシビリティ)
6. [SEO対策](#6-seo対策)
7. [レスポンシブデザイン](#7-レスポンシブデザイン)
8. [データ管理](#8-データ管理)
9. [テスト戦略](#9-テスト戦略)
10. [デプロイメントとCI/CD](#10-デプロイメントとcicd)
11. [監視とログ](#11-監視とログ)
12. [ドキュメンテーション](#12-ドキュメンテーション)

---

## 1. プロジェクト構成とアーキテクチャ

### 1.1 ディレクトリ構造

```
portfolio-site/
├── components/           # 再利用可能なUIコンポーネント
│   ├── ui/              # 基本的なUIコンポーネント
│   ├── layout/          # レイアウト関連コンポーネント
│   └── features/        # 機能固有のコンポーネント
├── pages/               # Next.jsページファイル
├── lib/                 # ユーティリティ関数・設定
├── hooks/               # カスタムReactフック
├── types/               # TypeScript型定義
├── styles/              # CSSファイル
├── public/              # 静的ファイル
├── data/                # 静的データファイル
├── tests/               # テストファイル
└── docs/                # ドキュメント
```

### 1.2 設計原則

#### **SOLID原則の適用**
- **Single Responsibility**: 各コンポーネントは単一の責任を持つ
- **Open/Closed**: 拡張に開放的、修正に閉鎖的
- **Liskov Substitution**: 派生クラスは基底クラスと置換可能
- **Interface Segregation**: インターフェースは細分化
- **Dependency Inversion**: 抽象に依存、具象に依存しない

#### **Component-Driven Development**
```typescript
// ✅ Good: 単一責任の原則
const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <Card>
      <ProjectImage src={project.image} alt={project.title} />
      <ProjectContent project={project} />
      <ProjectActions project={project} />
    </Card>
  );
};

// ❌ Bad: 複数の責任を持つ
const ProjectCard = ({ project }: { project: Project }) => {
  // データフェッチング、UI表示、状態管理が混在
  const [data, setData] = useState();
  useEffect(() => { /* fetch logic */ }, []);
  return <div>{/* complex UI logic */}</div>;
};
```

### 1.3 状態管理アーキテクチャ

#### **状態の分類**
```typescript
// Server State (React Query/SWR)
const useProjects = () => {
  return useQuery(['projects'], fetchProjects);
};

// Client State (Zustand/Context)
interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  activeFilter: string;
}

// Local Component State (useState)
const [isExpanded, setIsExpanded] = useState(false);
```

---

## 2. コード品質とメンテナビリティ

### 2.1 TypeScript活用

#### **厳密な型定義**
```typescript
// ✅ Good: 厳密な型定義
interface Project {
  readonly id: string;
  title: string;
  description: string;
  technologies: readonly Technology[];
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

// 型ガード関数
const isValidProject = (data: unknown): data is Project => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'title' in data
  );
};
```

#### **ジェネリクスの活用**
```typescript
// API応答の型安全性
interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}

const useApiData = <T>(endpoint: string): ApiResponse<T> => {
  // 実装
};
```

### 2.2 コードスタイルとフォーマット

#### **ESLint設定**
```json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

#### **Prettier設定**
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

### 2.3 命名規則

```typescript
// ✅ Good: 明確で一貫した命名
const useProjectFilters = () => { /* */ };
const ProjectCard = () => { /* */ };
const PROJECT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
} as const;

// ❌ Bad: 曖昧な命名
const useData = () => { /* */ };
const Card = () => { /* */ };
const STATUS = ['draft', 'published'];
```

---

## 3. パフォーマンス最適化

### 3.1 Core Web Vitals対応

#### **Largest Contentful Paint (LCP)**
```typescript
// 画像最適化
import Image from 'next/image';

const ProjectImage = ({ src, alt }: ImageProps) => (
  <Image
    src={src}
    alt={alt}
    width={600}
    height={400}
    priority={true} // Above the fold images
    placeholder="blur"
    blurDataURL="data:image/jpeg;base64,..."
  />
);
```

#### **First Input Delay (FID)**
```typescript
// コード分割
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false, // クライアントサイドのみ
});
```

#### **Cumulative Layout Shift (CLS)**
```css
/* レイアウトシフト防止 */
.image-container {
  aspect-ratio: 16/9;
  position: relative;
}

.skeleton {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

### 3.2 バンドル最適化

#### **Tree Shaking**
```typescript
// ✅ Good: 名前付きインポート
import { debounce } from 'lodash-es';

// ❌ Bad: デフォルトインポート
import _ from 'lodash';
```

#### **動的インポート**
```typescript
// 条件付きロード
const loadAnalytics = async () => {
  if (process.env.NODE_ENV === 'production') {
    const { analytics } = await import('./analytics');
    return analytics;
  }
};
```

### 3.3 キャッシング戦略

#### **Next.js ISR (Incremental Static Regeneration)**
```typescript
export const getStaticProps: GetStaticProps = async () => {
  const projects = await fetchProjects();
  
  return {
    props: { projects },
    revalidate: 3600, // 1時間ごとに再生成
  };
};
```

#### **SWR/React Query設定**
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5分
      cacheTime: 10 * 60 * 1000, // 10分
      refetchOnWindowFocus: false,
    },
  },
});
```

---

## 4. セキュリティ

### 4.1 XSS対策

#### **サニタイゼーション**
```typescript
import DOMPurify from 'dompurify';

const SafeHTML = ({ content }: { content: string }) => {
  const sanitizedContent = DOMPurify.sanitize(content);
  return <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />;
};
```

#### **CSP (Content Security Policy)**
```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
    `.replace(/\s{2,}/g, ' ').trim()
  }
];
```

### 4.2 認証・認可

#### **JWT トークン管理**
```typescript
// セキュアなトークン保存
const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  
  const login = async (credentials: LoginCredentials) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    
    if (response.ok) {
      const { token } = await response.json();
      // HttpOnly cookieを推奨
      document.cookie = `token=${token}; secure; samesite=strict`;
    }
  };
};
```

### 4.3 入力検証

```typescript
import { z } from 'zod';

const ProjectSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(10).max(1000),
  technologies: z.array(z.string()).min(1),
  githubUrl: z.string().url().optional(),
});

type ProjectInput = z.infer<typeof ProjectSchema>;
```

---

## 5. アクセシビリティ

### 5.1 WCAG 2.1 AA準拠

#### **セマンティックHTML**
```tsx
// ✅ Good: セマンティックな構造
const ProjectList = ({ projects }: { projects: Project[] }) => (
  <section aria-labelledby="projects-heading">
    <h2 id="projects-heading">プロジェクト一覧</h2>
    <ul role="list">
      {projects.map(project => (
        <li key={project.id}>
          <article>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
          </article>
        </li>
      ))}
    </ul>
  </section>
);
```

#### **ARIA属性の適切な使用**
```tsx
const SearchFilter = () => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div>
      <label htmlFor="search-input">プロジェクト検索</label>
      <input
        id="search-input"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-describedby="search-help"
        aria-expanded={isExpanded}
      />
      <div id="search-help">
        プロジェクト名や技術名で検索できます
      </div>
    </div>
  );
};
```

### 5.2 キーボードナビゲーション

```tsx
const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isOpen) {
      // フォーカストラップ
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements?.length) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }
  }, [isOpen]);
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };
  
  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {children}
    </div>
  );
};
```

---

## 6. SEO対策

### 6.1 メタデータ管理

```tsx
import Head from 'next/head';

const SEOHead = ({ 
  title, 
  description, 
  image, 
  url 
}: SEOProps) => (
  <Head>
    <title>{title}</title>
    <meta name="description" content={description} />
    
    {/* Open Graph */}
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />
    <meta property="og:url" content={url} />
    <meta property="og:type" content="website" />
    
    {/* Twitter Card */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={image} />
    
    {/* 構造化データ */}
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "あなたの名前",
          "jobTitle": "Software Developer",
          "url": url,
        })
      }}
    />
  </Head>
);
```

### 6.2 サイトマップ生成

```typescript
// scripts/generate-sitemap.ts
const generateSitemap = async () => {
  const projects = await fetchAllProjects();
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://yoursite.com</loc>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
      </url>
      ${projects.map(project => `
        <url>
          <loc>https://yoursite.com/projects/${project.id}</loc>
          <lastmod>${project.updatedAt}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.8</priority>
        </url>
      `).join('')}
    </urlset>`;
  
  fs.writeFileSync('public/sitemap.xml', sitemap);
};
```

---

## 7. レスポンシブデザイン

### 7.1 モバイルファースト設計

```css
/* ✅ Good: モバイルファースト */
.project-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .project-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
}

@media (min-width: 1024px) {
  .project-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### 7.2 CSS-in-JS with Styled Components

```typescript
import styled from 'styled-components';

const ResponsiveContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 2rem;
  }
`;

const GridLayout = styled.div<{ columns?: number }>`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(${props => props.columns || 2}, 1fr);
    gap: 2rem;
  }
`;
```

---

## 8. データ管理

### 8.1 API設計

#### **RESTful API設計**
```typescript
// API Routes
// GET /api/projects - プロジェクト一覧取得
// GET /api/projects/[id] - 特定プロジェクト取得
// POST /api/projects - プロジェクト作成
// PUT /api/projects/[id] - プロジェクト更新
// DELETE /api/projects/[id] - プロジェクト削除

// 型安全なAPI クライアント
class ProjectsAPI {
  static async getAll(): Promise<Project[]> {
    const response = await fetch('/api/projects');
    if (!response.ok) throw new Error('Failed to fetch projects');
    return response.json();
  }
  
  static async getById(id: string): Promise<Project> {
    const response = await fetch(`/api/projects/${id}`);
    if (!response.ok) throw new Error('Project not found');
    return response.json();
  }
}
```

### 8.2 状態管理

#### **Zustand による状態管理**
```typescript
interface ProjectStore {
  projects: Project[];
  filters: ProjectFilters;
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateFilters: (filters: Partial<ProjectFilters>) => void;
}

const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  filters: { technology: '', status: 'all' },
  
  setProjects: (projects) => set({ projects }),
  
  addProject: (project) => set((state) => ({
    projects: [...state.projects, project]
  })),
  
  updateFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),
}));
```

---

## 9. テスト戦略

### 9.1 テストピラミッド

#### **Unit Tests (Jest + Testing Library)**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectCard } from './ProjectCard';

const mockProject: Project = {
  id: '1',
  title: 'Test Project',
  description: 'Test Description',
  technologies: ['React', 'TypeScript'],
  status: 'published',
};

describe('ProjectCard', () => {
  it('renders project information correctly', () => {
    render(<ProjectCard project={mockProject} />);
    
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });
  
  it('handles click events', () => {
    const onClickMock = jest.fn();
    render(<ProjectCard project={mockProject} onClick={onClickMock} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(onClickMock).toHaveBeenCalledWith(mockProject.id);
  });
});
```

#### **Integration Tests**
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ProjectList } from './ProjectList';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('ProjectList Integration', () => {
  it('fetches and displays projects', async () => {
    render(<ProjectList />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument();
    });
  });
});
```

### 9.2 E2E テスト (Playwright)

```typescript
import { test, expect } from '@playwright/test';

test('user can navigate through portfolio', async ({ page }) => {
  await page.goto('/');
  
  // ホームページの確認
  await expect(page.locator('h1')).toContainText('ポートフォリオ');
  
  // プロジェクト一覧への遷移
  await page.click('text=プロジェクト');
  await expect(page).toHaveURL('/projects');
  
  // プロジェクト詳細への遷移
  await page.click('[data-testid="project-card"]:first-child');
  await expect(page.locator('h1')).toBeVisible();
});
```

---

## 10. デプロイメントとCI/CD

### 10.1 GitHub Actions

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### 10.2 環境設定

```typescript
// lib/config.ts
const config = {
  env: process.env.NODE_ENV || 'development',
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET!,
  },
  database: {
    url: process.env.DATABASE_URL!,
  },
} as const;

export default config;
```

---

## 11. 監視とログ

### 11.1 エラーハンドリング

```typescript
// lib/error-handler.ts
import * as Sentry from '@sentry/nextjs';

class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleError = (error: Error) => {
  console.error('Application Error:', error);
  
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error);
  }
};

// React Error Boundary
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    handleError(error);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

### 11.2 Analytics

```typescript
// lib/analytics.ts
declare global {
  interface Window {
    gtag: any;
  }
}

export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// React Hook
export const useAnalytics = () => {
  const trackPageView = (url: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_location: url,
      });
    }
  };

  return { trackPageView, trackEvent };
};
```

---

## 12. ドキュメンテーション

### 12.1 README.md構成

```markdown
# Portfolio Site

## 概要
27卒IT職採用向けポートフォリオサイト

## 技術スタック
- **Frontend**: Next.js, TypeScript, Styled Components
- **Backend**: AWS Lambda, Amplify
- **Database**: DynamoDB
- **AI**: OpenAI GPT, Pinecone (RAG)

## 開発環境セットアップ
\`\`\`bash
# 依存関係インストール
npm install

# 環境変数設定
cp .env.example .env.local

# 開発サーバー起動
npm run dev
\`\`\`

## スクリプト
- `npm run dev` - 開発サーバー起動
- `npm run build` - プロダクションビルド
- `npm run test` - テスト実行
- `npm run lint` - Lint実行

## ディレクトリ構成
[構成説明]

## コントリビューション
[ガイドライン]
```

### 12.2 コンポーネントドキュメント

```typescript
/**
 * プロジェクトカードコンポーネント
 * 
 * @param project - 表示するプロジェクトデータ
 * @param onClick - クリック時のコールバック関数
 * @param className - 追加のCSSクラス
 * 
 * @example
 * ```tsx
 * <ProjectCard 
 *   project={project} 
 *   onClick={(id) => router.push(`/projects/${id}`)}
 * />
 * ```
 */
interface ProjectCardProps {
  project: Project;
  onClick?: (id: string) => void;
  className?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  onClick, 
  className 
}) => {
  // 実装
};
```

---

## まとめ

### 優先度の高いベストプラクティス

1. **型安全性の確保** - TypeScript の厳密な設定
2. **パフォーマンス最適化** - Core Web Vitals 対応
3. **アクセシビリティ** - WCAG 2.1 AA 準拠
4. **セキュリティ** - XSS, CSRF 対策
5. **テスト** - ユニット〜E2Eテストの実装
6. **CI/CD** - 自動化されたデプロイメント

### 継続的改善

- **コードレビュー** の徹底
- **パフォーマンス監視** の実装
- **ユーザーフィードバック** の収集
- **A/Bテスト** による最適化

このガイドに従って開発することで、高品質で保守性の高いポートフォリオサイトを構築できます。

---

**更新日**: 2025年7月
**次回更新予定**: 開発進捗に応じて随時更新 