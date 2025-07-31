# AWS Amplify Gen 2 - IAMユーザー認証情報ベストプラクティスガイド

## 概要

本ガイドでは、AWS Amplify Gen 2プロジェクトで`npx ampx configure profile`を実行する際のIAMユーザー認証情報のベストプラクティスについて、初心者から上級者まで理解できるよう段階的に解説します。

### 対象プロジェクト
- **プロジェクト種別**: Next.js 15.1.0 + AWS Amplify Gen 2
- **現在の状況**: 静的ホスティングのみ設定済み
- **将来予定**: Auth、Storage、Functions の追加

---

## 目次

1. [AWS Amplify Gen 2 のセキュリティ原則](#1-aws-amplify-gen-2-のセキュリティ原則)
2. [IAMユーザー vs IAM Identity Center](#2-iamユーザー-vs-iam-identity-center)
3. [開発環境別の認証戦略](#3-開発環境別の認証戦略)
4. [IAMユーザー作成のベストプラクティス](#4-iamユーザー作成のベストプラクティス)
5. [プロファイル設定の実装](#5-プロファイル設定の実装)
6. [セキュリティ監査とローテーション](#6-セキュリティ監査とローテーション)
7. [トラブルシューティング](#7-トラブルシューティング)

---

## 1. AWS Amplify Gen 2 のセキュリティ原則

### 🎯 基本原則

1. **最小権限の原則 (Principle of Least Privilege)**
   - 必要最小限の権限のみ付与
   - 定期的な権限レビュー

2. **多要素認証 (MFA) の必須化**
   - すべての管理者アカウントでMFA有効化
   - ハードウェアトークンの推奨

3. **一時的認証情報の活用**
   - 長期間有効なアクセスキーの回避
   - STS (Security Token Service) の活用

4. **監査とログ記録**
   - CloudTrail による API 呼び出しの記録
   - 定期的なアクセスレビュー

### 🔒 Gen 2 固有のセキュリティ考慮事項

```typescript
// amplify/backend.ts - 現在の設定例
import { defineBackend } from '@aws-amplify/backend';

const backend = defineBackend({
  // 将来的にAuth、Storage、Functionsを追加予定
  // 現在は静的サイトのホスティングのみ
});

export default backend;
```

---

## 2. IAMユーザー vs IAM Identity Center

### 🚨 重要な判断基準

| 項目 | IAMユーザー | IAM Identity Center |
|------|------------|-------------------|
| **推奨度** | ❌ 非推奨 | ✅ 強く推奨 |
| **セキュリティ** | パスワード管理が困難 | 統合認証、MFA強制 |
| **管理性** | アクセスキーローテーション必要 | 一元管理、自動更新 |
| **コスト** | 無料 | 無料（基本機能） |
| **適用例** | レガシーシステム | 新規プロジェクト |

### 📋 推奨アプローチ

**優先順位:**
1. **IAM Identity Center** (最優先)
2. **IAMロール + AssumeRole** (次善策)
3. **IAMユーザー** (最後の手段)

---

## 3. 開発環境別の認証戦略

### 🏗️ 環境設計

```mermaid
graph TD
    A[開発者] --> B[IAM Identity Center]
    B --> C[開発環境プロファイル]
    B --> D[ステージング環境プロファイル]
    B --> E[本番環境プロファイル]
    
    C --> F[開発用リソース]
    D --> G[ステージング用リソース]
    E --> H[本番用リソース]
```

### 📁 プロファイル構成例

```bash
# ~/.aws/config
[profile amplify-dev]
sso_start_url = https://your-company.awsapps.com/start
sso_region = us-east-1
sso_account_id = 123456789012
sso_role_name = AmplifyDeveloperRole
region = us-east-1

[profile amplify-staging]
sso_start_url = https://your-company.awsapps.com/start
sso_region = us-east-1
sso_account_id = 123456789013
sso_role_name = AmplifyDeployerRole
region = us-east-1

[profile amplify-prod]
sso_start_url = https://your-company.awsapps.com/start
sso_region = us-east-1
sso_account_id = 123456789014
sso_role_name = AmplifyProductionRole
region = us-east-1
```

---

## 4. IAMユーザー作成のベストプラクティス

### ⚠️ やむを得ずIAMユーザーを使用する場合

#### 4.1 ユーザー作成手順

```bash
# 1. IAMユーザーの作成
aws iam create-user --user-name amplify-dev-user

# 2. プログラマティックアクセスの設定
aws iam create-access-key --user-name amplify-dev-user
```

#### 4.2 最小権限ポリシーの適用

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "amplify:*",
        "iam:CreateRole",
        "iam:AttachRolePolicy",
        "iam:DetachRolePolicy",
        "iam:DeleteRole",
        "iam:PassRole",
        "cloudformation:*",
        "s3:CreateBucket",
        "s3:DeleteBucket",
        "s3:PutBucketPolicy",
        "s3:GetBucketPolicy",
        "cognito-idp:*",
        "cognito-identity:*",
        "apigateway:*",
        "lambda:*",
        "dynamodb:*",
        "appsync:*"
      ],
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "aws:RequestedRegion": ["us-east-1", "ap-northeast-1"]
        }
      }
    }
  ]
}
```

#### 4.3 MFA設定の強制

```bash
# MFA デバイスの作成
aws iam create-virtual-mfa-device \
  --virtual-mfa-device-name amplify-dev-user-mfa \
  --outfile QRCode.png \
  --bootstrap-method QRCodePNG

# MFA デバイスの有効化
aws iam enable-mfa-device \
  --user-name amplify-dev-user \
  --serial-number arn:aws:iam::ACCOUNT-ID:mfa/amplify-dev-user-mfa \
  --authentication-code1 123456 \
  --authentication-code2 654321
```

#### 4.4 条件付きポリシーでMFA強制

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Deny",
      "Action": "*",
      "Resource": "*",
      "Condition": {
        "BoolIfExists": {
          "aws:MultiFactorAuthPresent": "false"
        }
      }
    }
  ]
}
```

---

## 5. プロファイル設定の実装

### 🔧 ampx configure profile の実行

#### 5.1 基本的な設定

```bash
# IAM Identity Center を使用する場合（推奨）
npx ampx configure profile --profile amplify-dev

# IAMユーザーを使用する場合
npx ampx configure profile --profile amplify-dev-user
```

#### 5.2 環境変数による設定

```bash
# 開発環境用
export AWS_PROFILE=amplify-dev
export AWS_REGION=us-east-1

# プロファイル確認
aws sts get-caller-identity
```

#### 5.3 プロファイル設定ファイルの検証

```bash
# 設定内容の確認
cat ~/.aws/config
cat ~/.aws/credentials

# プロファイル一覧の表示
aws configure list-profiles

# 特定プロファイルの設定確認
aws configure list --profile amplify-dev
```

### 📝 設定例テンプレート

#### ~/.aws/config
```ini
[default]
region = us-east-1
output = json

[profile amplify-dev]
region = us-east-1
output = json
mfa_serial = arn:aws:iam::123456789012:mfa/amplify-dev-user-mfa

[profile amplify-staging]
region = us-east-1
output = json
role_arn = arn:aws:iam::123456789013:role/AmplifyDeployerRole
source_profile = amplify-dev

[profile amplify-prod]
region = us-east-1
output = json
role_arn = arn:aws:iam::123456789014:role/AmplifyProductionRole
source_profile = amplify-dev
mfa_serial = arn:aws:iam::123456789012:mfa/amplify-dev-user-mfa
```

#### ~/.aws/credentials
```ini
[amplify-dev]
aws_access_key_id = AKIAXXXXXXXXXXXXXXXX
aws_secret_access_key = xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 6. セキュリティ監査とローテーション

### 🔍 定期監査のチェックリスト

#### 6.1 アクセスキー監査

```bash
# 1. アクセスキーの一覧取得
aws iam list-access-keys --user-name amplify-dev-user

# 2. アクセスキーの最終使用日確認
aws iam get-access-key-last-used --access-key-id AKIAXXXXXXXXXXXXXXXX

# 3. 90日以上未使用のキー検出
aws iam generate-credential-report
aws iam get-credential-report
```

#### 6.2 権限レビュー

```bash
# ユーザーにアタッチされたポリシー確認
aws iam list-attached-user-policies --user-name amplify-dev-user

# インラインポリシー確認
aws iam list-user-policies --user-name amplify-dev-user

# ポリシー内容の詳細確認
aws iam get-user-policy --user-name amplify-dev-user --policy-name PolicyName
```

### 🔄 アクセスキーローテーション手順

```bash
# 1. 新しいアクセスキーの作成
aws iam create-access-key --user-name amplify-dev-user

# 2. 新しいキーでの動作確認
export AWS_ACCESS_KEY_ID=NEW_ACCESS_KEY
export AWS_SECRET_ACCESS_KEY=NEW_SECRET_KEY
aws sts get-caller-identity

# 3. 古いキーの削除
aws iam delete-access-key --user-name amplify-dev-user --access-key-id OLD_ACCESS_KEY

# 4. 設定ファイルの更新
npx ampx configure profile --profile amplify-dev
```

### 📊 CloudTrail による監査

```bash
# Amplify関連のAPIコールを確認
aws logs filter-log-events \
  --log-group-name CloudTrail/AmplifyLogGroup \
  --filter-pattern '{ $.eventSource = "amplify.amazonaws.com" }'

# 失敗したAPIコールの確認
aws logs filter-log-events \
  --log-group-name CloudTrail/AmplifyLogGroup \
  --filter-pattern '{ $.errorCode = "*" }'
```

---

## 7. トラブルシューティング

### 🚨 よくある問題と解決策

#### 7.1 認証エラー

**問題**: `Unable to locate credentials`
```bash
# 解決策1: プロファイル設定の確認
aws configure list --profile amplify-dev

# 解決策2: 環境変数の確認
echo $AWS_PROFILE
echo $AWS_DEFAULT_REGION

# 解決策3: 認証情報の再設定
npx ampx configure profile --profile amplify-dev
```

#### 7.2 権限エラー

**問題**: `AccessDenied` エラー
```bash
# 現在の認証情報確認
aws sts get-caller-identity

# ポリシーシミュレーター（CLIツール）
aws iam simulate-principal-policy \
  --policy-source-arn arn:aws:iam::123456789012:user/amplify-dev-user \
  --action-names amplify:CreateApp \
  --resource-arns "*"
```

#### 7.3 MFA関連エラー

**問題**: MFA認証が失敗する
```bash
# MFAトークン取得
aws sts get-session-token \
  --serial-number arn:aws:iam::123456789012:mfa/amplify-dev-user-mfa \
  --token-code 123456

# 一時認証情報の設定
export AWS_ACCESS_KEY_ID=TEMPORARY_ACCESS_KEY
export AWS_SECRET_ACCESS_KEY=TEMPORARY_SECRET_KEY
export AWS_SESSION_TOKEN=SESSION_TOKEN
```

### 🔧 デバッグ用コマンド

```bash
# AWS CLI設定の詳細確認
aws configure list
aws configure list --profile amplify-dev

# 認証情報の確認
aws sts get-caller-identity

# リージョン設定の確認
aws configure get region

# プロファイル切り替えテスト
AWS_PROFILE=amplify-dev aws sts get-caller-identity
```

---

## 8. 本プロジェクト向け推奨設定

### 🎯 ポートフォリオサイト専用設定

#### 8.1 最小権限ポリシー（カスタム）

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AmplifyHostingAccess",
      "Effect": "Allow",
      "Action": [
        "amplify:CreateApp",
        "amplify:UpdateApp",
        "amplify:DeleteApp",
        "amplify:GetApp",
        "amplify:ListApps",
        "amplify:CreateBranch",
        "amplify:UpdateBranch",
        "amplify:DeleteBranch",
        "amplify:GetBranch",
        "amplify:ListBranches"
      ],
      "Resource": "*"
    },
    {
      "Sid": "CloudFormationAccess",
      "Effect": "Allow",
      "Action": [
        "cloudformation:CreateStack",
        "cloudformation:UpdateStack",
        "cloudformation:DeleteStack",
        "cloudformation:DescribeStacks",
        "cloudformation:DescribeStackEvents",
        "cloudformation:DescribeStackResources"
      ],
      "Resource": "arn:aws:cloudformation:*:*:stack/amplify-*"
    },
    {
      "Sid": "S3HostingAccess",
      "Effect": "Allow",
      "Action": [
        "s3:CreateBucket",
        "s3:DeleteBucket",
        "s3:PutBucketPolicy",
        "s3:PutBucketWebsite",
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::amplify-*",
        "arn:aws:s3:::amplify-*/*"
      ]
    }
  ]
}
```

#### 8.2 段階的権限拡張

```javascript
// Phase 1: 静的ホスティングのみ（現在）
const currentPermissions = [
  'amplify:*',
  's3:*',
  'cloudformation:*'
];

// Phase 2: 認証追加時
const authPermissions = [
  'cognito-idp:*',
  'cognito-identity:*',
  'iam:CreateRole',
  'iam:AttachRolePolicy'
];

// Phase 3: データベース追加時
const dataPermissions = [
  'dynamodb:*',
  'appsync:*'
];

// Phase 4: Functions追加時
const functionPermissions = [
  'lambda:*',
  'apigateway:*'
];
```

### 📋 セットアップチェックリスト

- [ ] AWS CLI のインストール確認
- [ ] IAM Identity Center の評価
- [ ] 開発用IAMユーザーの作成（必要に応じて）
- [ ] MFA の設定
- [ ] 最小権限ポリシーの適用
- [ ] プロファイル設定の実行
- [ ] 動作確認テスト
- [ ] CloudTrail ログの確認設定
- [ ] アクセスキーローテーション計画

---

## 9. 継続的セキュリティ運用

### 📅 定期メンテナンススケジュール

| 頻度 | タスク | 担当者 |
|------|--------|--------|
| 毎日 | CloudTrail ログ確認 | 開発者 |
| 週次 | 権限使用状況レビュー | チームリーダー |
| 月次 | アクセスキーローテーション | セキュリティ担当者 |
| 四半期 | ポリシー見直し | アーキテクト |
| 年次 | 包括的セキュリティ監査 | セキュリティチーム |

### 🚀 自動化の推奨事項

```bash
# 1. アクセスキー有効期限アラート
aws events put-rule \
  --name "AccessKeyRotationAlert" \
  --schedule-expression "rate(30 days)"

# 2. 未使用リソース検出
aws resourcegroupstaggingapi get-resources \
  --tag-filters "Key=Project,Values=portfolio-site" \
  --resource-type-filters "amplify"

# 3. コスト監視アラート
aws budgets create-budget \
  --account-id 123456789012 \
  --budget file://budget-config.json
```

---

## まとめ

本ガイドでは、AWS Amplify Gen 2プロジェクトにおけるIAM認証情報のベストプラクティスを包括的に解説しました。

### 🔑 重要なポイント

1. **IAM Identity Center を最優先で検討**
2. **最小権限の原則を厳守**
3. **MFA の必須化**
4. **定期的な権限レビューとローテーション**
5. **包括的な監査とログ記録**

### 🎯 次のステップ

1. 現在の認証設定の見直し
2. セキュリティポリシーの策定
3. 自動化スクリプトの導入
4. チーム内でのセキュリティ教育

これらのベストプラクティスに従うことで、セキュアで管理しやすいAWS Amplify Gen 2環境を構築できます。

---

**参考リンク:**
- [AWS Amplify Gen 2 Documentation](https://docs.amplify.aws/)
- [AWS IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [AWS Security Best Practices](https://aws.amazon.com/architecture/security-identity-compliance/)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/) 