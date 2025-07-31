// 環境変数から設定を読み込む設定ファイル

export const siteConfig = {
  // サイト基本情報
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'ポートフォリオサイト',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  
  // 個人情報
  personal: {
    name: process.env.NEXT_PUBLIC_PERSONAL_NAME || 'あなたの名前',
    university: process.env.NEXT_PUBLIC_PERSONAL_UNIVERSITY || '○○大学 ○○学部 3年',
    major: process.env.NEXT_PUBLIC_PERSONAL_MAJOR || '情報工学・コンピューターサイエンス',
    skills: process.env.NEXT_PUBLIC_PERSONAL_SKILLS || 'Web開発、データ分析、AI・機械学習',
    goal: process.env.NEXT_PUBLIC_PERSONAL_GOAL || 'フルスタックエンジニア',
    email: process.env.NEXT_PUBLIC_EMAIL || 'your.email@example.com',
  },
  
  // SNS・連絡先
  links: {
    github: process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/yourusername',
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://linkedin.com/in/yourusername',
    resume: process.env.NEXT_PUBLIC_RESUME_URL || '/resume.pdf',
  },
  
  // アナリティクス
  analytics: {
    googleId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
  },
};

// 型定義
export type SiteConfig = typeof siteConfig; 