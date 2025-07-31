# AWS Amplify Gen 2 設定履歴（公開版）

## 概要

本ドキュメントは、Next.js 15.1.0 + AWS Amplify Gen 2 ポートフォリオサイトプロジェクトにおけるAmplifyの設定から認証機能実装までの完全な実施履歴を記録しています。

### プロジェクト情報
- **プロジェクト名**: portfolio-site
- **フレームワーク**: Next.js 15.1.0
- **AWS Amplify**: Gen 2
- **認証方式**: IAM Identity Center (SSO)
- **リージョン**: ap-northeast-1
- **アカウントID**: [MASKED]

---

## 実施工程

### Phase 1: 事前準備と環境確認

#### 1.1 AWS CLI確認
```powershell
aws --version
# 結果: aws-cli/2.27.38 Python/3.13.4 Windows/11 exe/AMD64
```

#### 1.2 プロジェクト構成確認
```powershell
cd portfolio-site
cat package.json
```

**確認された依存関係:**
- `@aws-amplify/adapter-nextjs`: ^1.6.7
- `aws-amplify`: ^6.15.4
- `@aws-amplify/backend`: ^1.16.1
- `@aws-amplify/backend-cli`: ^1.8.0

#### 1.3 既存AWS設定確認
```powershell
aws configure list-profiles
# 結果: [YOUR_PROFILE_NAMES]
```

### Phase 2: 認証設定の確認と修復

#### 2.1 IAM Identity Center (SSO) 設定確認
```powershell
cat ~/.aws/config
```

**設定内容例:**
```ini
[profile your-profile-name]
sso_session = your-sso-session
sso_account_id = [YOUR_ACCOUNT_ID]
sso_role_name = AdministratorAccess
region = ap-northeast-1

[sso-session your-sso-session]
sso_start_url = [YOUR_SSO_URL]
sso_region = ap-northeast-1
sso_registration_scopes = sso:account:access
```

#### 2.2 SSOセッション更新
```powershell
aws sso login --profile your-profile-name
# 結果: Successfully logged into Start URL: [YOUR_SSO_URL]
```

#### 2.3 認証確認
```powershell
aws configure list --profile your-profile-name
# 結果: secret_key ****************[MASKED] sso
```

### Phase 3: CDKブートストラップ

#### 3.1 CDKインストール
```powershell
npm install -g aws-cdk
```

#### 3.2 環境変数設定（一時的）
```powershell
$env:AWS_PROFILE = "your-profile-name"
```

**注意:** この設定はPowerShellセッション限定の一時的な設定です。

#### 3.3 CDKブートストラップ実行
```powershell
cdk bootstrap aws://[YOUR_ACCOUNT_ID]/ap-northeast-1
```

**実行結果:**
```
✅ Environment aws://[YOUR_ACCOUNT_ID]/ap-northeast-1 bootstrapped.
```

**作成されたリソース:**
- CloudFormation Stack: CDKToolkit
- S3 Bucket: StagingBucket
- ECR Repository: ContainerAssetsRepository
- IAM Roles: 4個（ImagePublishing, FilePublishing, CloudFormationExecution, DeploymentAction, Lookup）
- SSM Parameter: CdkBootstrapVersion

### Phase 4: Amplifyサンドボックス環境起動

#### 4.1 初期エラーと解決
**問題:**
```powershell
npx ampx sandbox
# エラー: npm error could not determine executable to run
```

**解決策:**
```powershell
npx @aws-amplify/backend-cli sandbox
```

#### 4.2 サンドボックス正常起動
```
Amplify Sandbox
  Identifier:   [YOUR_IDENTIFIER]
  Stack:        amplify-[PROJECT_NAME]-[IDENTIFIER]-sandbox-[RANDOM_ID]
  Region:       ap-northeast-1

✔ Backend synthesized in 2.73 seconds
✔ Type checks completed in 0.56 seconds
✔ Built and published assets
✔ Deployment completed in 11.371 seconds
[Sandbox] Watching for file changes...
File written: amplify_outputs.json
```

### Phase 5: 認証機能の実装

#### 5.1 認証設定ファイル作成
**ファイル:** `amplify/auth/resource.ts`

```typescript
import { defineAuth } from '@aws-amplify/backend';

/**
 * ポートフォリオサイト用認証設定
 * 
 * 基本機能:
 * - メールアドレスでのユーザー登録・ログイン
 * - パスワード設定・変更
 * - メール認証
 */
export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailStyle: "CODE",
      verificationEmailSubject: "ポートフォリオサイトへようこそ - メール認証",
      verificationEmailBody: (createCode) =>
        `認証コード: ${createCode()}。このコードを入力してアカウントを確認してください。`,
    },
  },
  userAttributes: {
    preferredUsername: {
      required: false,
      mutable: true,
    },
    email: {
      required: true,
      mutable: true,
    },
    familyName: {
      required: false,
      mutable: true,
    },
    givenName: {
      required: false,
      mutable: true,
    },
  },
});
```

#### 5.2 バックエンド設定更新
**ファイル:** `amplify/backend.ts`

```typescript
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';

/**
 * Amplify Gen 2 Backend定義
 */
const backend = defineBackend({
  auth,
  // 将来的にStorage、Functionsなどを追加可能
});

export default backend;
```

#### 5.3 フロントエンド統合
**ファイル:** `src/app/layout.tsx`

```typescript
import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';

// Amplify設定の初期化
Amplify.configure(outputs);
```

---

## 技術的詳細

### 使用したコマンド一覧

```powershell
# 環境確認
aws --version
aws configure list-profiles
cat ~/.aws/config

# 認証
aws sso login --profile your-profile-name
aws configure list --profile your-profile-name
aws sts get-caller-identity --profile your-profile-name

# CDK
npm install -g aws-cdk
cdk bootstrap aws://[YOUR_ACCOUNT_ID]/ap-northeast-1

# Amplify
npx @aws-amplify/backend-cli version
npx @aws-amplify/backend-cli sandbox
npx @aws-amplify/backend-cli info
```

### 重要な設定ポイント

#### セキュリティ設定
- **認証方式**: IAM Identity Center (SSO) - ベストプラクティス
- **MFA**: 有効化済み
- **権限**: AdministratorAccess (開発環境)
- **一時認証情報**: 自動更新

#### Amplify設定
- **サンドボックス**: リアルタイム開発環境
- **ファイル監視**: 自動デプロイ
- **型安全性**: TypeScript完全対応

---

## 環境変数設定の詳細

### AWS_PROFILE環境変数の設定方法

#### 1. 一時的設定（セッション限定）
```powershell
$env:AWS_PROFILE = "your-profile-name"
```
- **有効期間**: 現在のPowerShellセッションのみ
- **用途**: 一時的なテストや特定の作業

#### 2. 永続的設定（推奨）
```powershell
[Environment]::SetEnvironmentVariable("AWS_PROFILE", "your-profile-name", "User")
```
- **有効期間**: 永続的（新しいセッションでも有効）
- **用途**: 本格的な開発環境

#### 3. コマンド実行時指定
```powershell
npx @aws-amplify/backend-cli sandbox --profile your-profile-name
```
- **有効期間**: コマンド実行時のみ
- **用途**: 特定のコマンドでの使用

### 設定確認方法
```powershell
# 現在の設定確認
echo $env:AWS_PROFILE

# 永続設定の確認
[Environment]::GetEnvironmentVariable("AWS_PROFILE", "User")
```

---

## トラブルシューティング履歴

### 問題1: ampx コマンドエラー
**エラー:** `npm error could not determine executable to run`

**原因:** `npx ampx` の代わりに `npx @aws-amplify/backend-cli` を使用する必要があった

**解決策:**
```powershell
npx @aws-amplify/backend-cli sandbox
```

### 問題2: CDKブートストラップエラー
**エラー:** `The region ap-northeast-1 has not been bootstrapped`

**解決策:**
```powershell
cdk bootstrap aws://[YOUR_ACCOUNT_ID]/ap-northeast-1
```

### 問題3: TypeScript型エラー
**エラー:** `passwordPolicy does not exist in type`

**解決策:** passwordPolicy設定を削除し、基本設定のみに変更

### 問題4: 環境変数設定の不明確さ
**問題:** `$env:AWS_PROFILE` の設定場所と永続性が不明確

**解決策:** 
1. 一時的設定と永続的設定の違いを明確化
2. 永続的設定の実装
3. 設定確認方法の追加

---

## 現在の状況

### ✅ 完了事項
1. **AWS認証**: IAM Identity Center (SSO) 設定完了
2. **CDKブートストラップ**: ap-northeast-1リージョンで完了
3. **Amplifyサンドボックス**: 正常稼働中
4. **認証機能**: バックエンド・フロントエンド統合完了
5. **リアルタイム開発**: ファイル変更監視アクティブ
6. **環境変数設定**: 永続的設定完了

### 🚀 次のステップ
1. **認証UI実装**: Amplify UI Authenticatorの追加
2. **データベース**: DynamoDBテーブルの作成
3. **Storage**: S3バケットでのファイル管理
4. **Functions**: Lambda関数の実装
5. **本番デプロイ**: GitHub Actions CI/CD

---

## 参考情報

### 作成されたAWSリソース
- **CloudFormation Stack**: CDKToolkit
- **Amplify Sandbox Stack**: amplify-[PROJECT_NAME]-[IDENTIFIER]-sandbox-[RANDOM_ID]
- **S3 Bucket**: CDK Bootstrap用
- **ECR Repository**: コンテナイメージ用
- **IAM Roles**: 複数の実行ロール

### ファイル構造
```
portfolio-site/
├── amplify/
│   ├── auth/
│   │   └── resource.ts
│   └── backend.ts
├── src/
│   └── app/
│       └── layout.tsx
├── amplify_outputs.json
├── cdk.context.json
└── package.json
```

### 環境変数設定
```powershell
# 永続的設定（完了済み）
[Environment]::SetEnvironmentVariable("AWS_PROFILE", "your-profile-name", "User")

# セッション設定（必要に応じて）
$env:AWS_PROFILE = "your-profile-name"

# 確認
echo $env:AWS_PROFILE
```

---

## まとめ

AWS Amplify Gen 2とNext.js 15.1.0を使用したポートフォリオサイトのセットアップを完了しました。IAM Identity Center (SSO)を使用したセキュアな認証基盤の上に、TypeScript完全対応のリアルタイム開発環境を構築できました。

環境変数設定についても明確化し、永続的な設定を実装しました。今後は認証UIの実装、データベース機能、ファイルストレージ機能を段階的に追加し、本格的なポートフォリオサイトとして完成させる予定です。

**作成日**: 2025年7月31日  
**最終更新**: 2025年7月31日  
**作成者**: プロジェクト開発チーム

---

## 🔒 セキュリティ注意事項

本ドキュメントは公開版として作成されており、以下の情報は意図的にマスク化されています：
- AWSアカウントID
- SSO URL
- 組織固有のプロファイル名
- 個人を特定できる情報

実際の使用時は、これらの情報を適切に置き換えてください。 