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
      verificationEmailBody: (createCode: () => string) =>
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