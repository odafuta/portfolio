import { PhotoSlider } from '@/components/features/PhotoSlider';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { personalPhotos } from '@/data/photos';
import { siteConfig } from '@/lib/config';

export default function HomePage() {
  const { personal } = siteConfig;

  return (
    <div className="min-h-screen">
      {/* ヒーローセクション */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto max-w-container-xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* 写真スライダー */}
            <div className="order-1 lg:order-2">
              <PhotoSlider
                photos={personalPhotos}
                autoplay={true}
                interval={4000}
                showDots={true}
                showProgress={true}
                className="w-full max-w-lg mx-auto lg:max-w-none"
              />
            </div>

            {/* テキストコンテンツ */}
            <div className="order-2 lg:order-1 space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold text-secondary-900 leading-tight">
                  IT業界で価値を創造する
                  <span className="block text-primary-600">エンジニアを目指す</span>
                </h1>
                <p className="text-xl text-secondary-600 leading-relaxed">
                  技術力と人間力の両立で、チームと社会に貢献
                </p>
                <p className="text-secondary-600 leading-relaxed">
                  大学でプログラミングを学び、実践的なプロジェクトを通じて技術を磨いています。
                  継続的な学習と成長を重視し、将来はフルスタックエンジニアとして活躍したいと考えています。
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/projects">
                  <Button size="lg" className="w-full sm:w-auto">プロジェクトを見る</Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">プロフィール詳細</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* プロフィール概要セクション */}
      <section className="py-16 bg-secondary-50">
        <div className="container mx-auto max-w-container-xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-secondary-900 mb-12">
              プロフィール
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: '所属', value: personal.university },
                { label: '専攻', value: personal.major },
                { label: '得意分野', value: personal.skills },
                { label: '目標', value: personal.goal },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm border border-secondary-100"
                >
                  <dt className="text-sm font-medium text-secondary-600 mb-1">
                    {item.label}
                  </dt>
                  <dd className="text-lg font-semibold text-secondary-900">
                    {item.value}
                  </dd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 技術スキルセクション */}
      <section className="py-16">
        <div className="container mx-auto max-w-container-xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-secondary-900 mb-12">
              技術スキル
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  name: 'フロントエンド',
                  skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
                  level: '中級',
                  color: 'bg-blue-100 text-blue-800',
                },
                {
                  name: 'バックエンド',
                  skills: ['Node.js', 'Python', 'AWS Lambda', 'DynamoDB'],
                  level: '初級〜中級',
                  color: 'bg-green-100 text-green-800',
                },
                {
                  name: 'AI・データ分析',
                  skills: ['scikit-learn', 'OpenAI API', '時系列解析', 'Power BI'],
                  level: '初級',
                  color: 'bg-purple-100 text-purple-800',
                },
                {
                  name: 'インフラ・ツール',
                  skills: ['AWS Amplify', 'GitHub', 'Docker', 'OR-Tools'],
                  level: '初級',
                  color: 'bg-orange-100 text-orange-800',
                },
              ].map((category, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm border border-secondary-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-secondary-900">
                      {category.name}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${category.color}`}>
                      {category.level}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {category.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="inline-block bg-secondary-100 text-secondary-700 px-3 py-1 rounded-full text-sm mr-2 mb-2"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-accent-500">
        <div className="container mx-auto max-w-container-xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold text-white">
              一緒に価値を創造しませんか？
            </h2>
            <p className="text-xl text-white/90">
              新しい技術への挑戦と継続的な成長で、チームに貢献したいと考えています。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">お問い合わせ</Button>
              </Link>
              <Link href={siteConfig.links.resume}>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600 w-full sm:w-auto">履歴書ダウンロード</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
