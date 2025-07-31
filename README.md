# ポートフォリオサイト

27卒IT職採用を目指したポートフォリオサイト。Next.js 14 + TypeScript + Tailwind CSSで構築され、写真スライダーを含む現代的なデザインを特徴としています。

## 🚀 特徴

### 📸 **写真スライダー**
- 5枚の個人写真による第一印象の最適化
- プロフェッショナルさと親しみやすさのバランス
- 自動再生・手動操作・キーボードナビゲーション対応

### 📊 **4つのフレームワーク**
各プロジェクトで以下の構造を実装：
- **Why**: 課題解決思考の可視化
- **How**: 技術選択の論理性アピール
- **What**: 成果の定量化と価値創造
- **So What**: 成長意欲と学習能力の証明

### 🎨 **モダンなデザイン**
- レスポンシブデザイン（モバイルファースト）
- アクセシビリティ対応（WCAG 2.1 AA準拠）
- ダークモード対応（予定）
- アニメーション・マイクロインタラクション

## 🛠 技術スタック

### **フロントエンド**
- **Next.js 15.1** - App Router、SSG、ISR
- **React 18** - Server Components、Suspense
- **TypeScript 5.7** - 型安全性の確保
- **Tailwind CSS 3.4** - ユーティリティファーストCSS

### **UIライブラリ**
- **Framer Motion** - アニメーション
- **Headless UI** - アクセシブルなUI要素
- **Lucide React** - アイコンライブラリ

### **開発ツール**
- **ESLint + Prettier** - コード品質管理
- **Husky + lint-staged** - Git hooks
- **Jest + Testing Library** - ユニットテスト
- **Playwright** - E2Eテスト

### **今後追加予定**
- **AWS Amplify** - ホスティング・認証
- **OpenAI API** - AI支援機能
- **Power BI** - データ可視化埋め込み

## 📁 プロジェクト構造

```
portfolio-site/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/
│   │   ├── ui/             # 再利用可能なUIコンポーネント
│   │   ├── layout/         # レイアウトコンポーネント
│   │   └── features/       # 機能別コンポーネント
│   ├── lib/                # ユーティリティ関数
│   ├── hooks/              # カスタムReact hooks
│   ├── types/              # TypeScript型定義
│   └── data/               # 静的データ
├── public/                 # 静的ファイル
├── docs/                   # ドキュメント
└── tests/                  # テストファイル
```

## 🚀 セットアップ

### **必要な環境**
- Node.js 18.0以上
- npm 9.0以上

### **インストール**

```bash
# リポジトリのクローン
git clone <repository-url>

# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env.local
# .env.localファイルを編集して必要な環境変数を設定

# 開発サーバーの起動
npm run dev
```

### **環境変数**

```bash
# サイトの基本設定
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=ポートフォリオサイト

# Google Analytics（本番用）
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=

# OpenAI API（AI機能用）
OPENAI_API_KEY=

# AWS設定
AWS_REGION=ap-northeast-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

## 📝 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# 本番サーバー起動
npm start

# ESLint実行
npm run lint

# ESLint自動修正
npm run lint:fix

# Prettier実行
npm run format

# 型チェック
npm run type-check

# ユニットテスト
npm run test

# E2Eテスト
npm run test:e2e

# バンドルサイズ分析
npm run analyze
```

## 🎯 開発ガイドライン

### **コードスタイル**
- **TypeScript**を使用し、`strict`モードを有効化
- **関数型コンポーネント**とReact Hooksを使用
- **Tailwind CSS**を使用し、カスタムCSSは最小限に
- **ESLint + Prettier**による自動フォーマット

### **コンポーネント設計**
- **Single Responsibility Principle**を遵守
- **Props**は明確に型定義
- **アクセシビリティ**を考慮した実装
- **再利用性**を重視した設計

### **Git Workflow**
- **feature**ブランチでの開発
- **プルリクエスト**でのコードレビュー
- **Conventional Commits**の使用
- **自動テスト**の通過が必須

## 📊 パフォーマンス目標

### **Core Web Vitals**
- **LCP**: < 2.5秒
- **FID**: < 100ms
- **CLS**: < 0.1

### **その他指標**
- **Lighthouse Score**: 90+
- **バンドルサイズ**: < 250KB (初期ロード)
- **アクセシビリティ**: WCAG 2.1 AA準拠

## 🗺 ロードマップ

### **Phase 1: 基盤構築** ✅
- [x] プロジェクトセットアップ
- [x] 基本コンポーネント作成
- [x] デザインシステム実装
- [x] 写真スライダー実装

### **Phase 2: コア機能（Week 3-5）**
- [ ] ホームページ実装
- [ ] プロジェクト管理機能
- [ ] 検索・フィルタ機能
- [ ] レスポンシブ対応

### **Phase 3: 高度な機能（Week 6-7）**
- [ ] AI機能統合
- [ ] RAG検索実装
- [ ] データ可視化
- [ ] パフォーマンス最適化

### **Phase 4: 公開・運用（Week 8）**
- [ ] AWS Amplifyデプロイ
- [ ] ドメイン設定
- [ ] アナリティクス設定
- [ ] CI/CD設定

## 🤝 貢献

このプロジェクトは個人開発ですが、フィードバックや提案は歓迎します。

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

---

**作成日**: 2025年7月  
**最終更新**: 2025年7月  
**開発者**: [あなたの名前]
# portfolio
