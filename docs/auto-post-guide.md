# X自動投稿 運用ガイド

## 概要

GitHub Actionsを使って、Xに1日3回（8:00 / 12:00 / 19:00 JST）自動投稿します。

## 仕組み

```
data/posts.json（投稿データ）
        ↓
scripts/post-to-x.mjs（投稿スクリプト）
        ↓ ランダム選択 → X APIで投稿
state/post-state.json（使用済み記録を更新）
        ↓
GitHub Actionsが自動コミット
```

## 投稿ルール

- **配分**: A（寄り添い）: B（紹介）= 2:1
- **順番**: A → A → B → A → A → B ... のローテーション
- **選択**: 各タイプ内でランダム（重複なし）
- **一巡後**: リセットして最初から + メールで通知

## 投稿データ

- **管理ファイル**: `data/posts.json`
- A（寄り添い系）: 20本
- B（紹介系）: 10本

### 投稿を追加する方法

1. `data/posts.json` を開く
2. 該当タイプの最後に新しい投稿を追加

**Aタイプ（寄り添い）の例:**
```json
{ "id": "A-21", "type": "A", "text": "投稿本文\n\n#ハッシュタグ" }
```

**Bタイプ（紹介）の例:**
```json
{ "id": "B-11", "type": "B", "text": "投稿本文", "url": "https://give-kappa-ten.vercel.app/", "tags": "#Give #LINE相談" }
```

3. GitHubにpushすると、次回の自動投稿から新しい投稿が対象に含まれる

## 状態管理

- **ファイル**: `state/post-state.json`
- GitHub Actionsが投稿ごとに自動更新・コミットする
- 手動で編集する必要はない

### 状態をリセットしたい場合

`state/post-state.json` を以下の内容に書き換えてpush：
```json
{
  "usedA": [],
  "usedB": [],
  "rotationCount": 0
}
```

## スケジュール

| 時刻 (JST) | cron (UTC) | 備考 |
|------------|------------|------|
| 8:00 | 0 23 * * * (前日) | 朝の投稿 |
| 12:00 | 0 3 * * * | 昼の投稿 |
| 19:00 | 0 10 * * * | 夜の投稿 |

※ GitHub Actionsの無料枠では数分〜十数分のズレが発生することがあります。

## 通知

投稿が一巡（Aタイプ全20本、またはBタイプ全10本を使い切った）すると、Gmailにメール通知が届きます。

## 手動実行

1. https://github.com/anmituTK/GIVE/actions にアクセス
2. 「Auto Post to X」を選択
3. 「Run workflow」→ Branch: main → 「Run workflow」

## コスト

- **GitHub Actions**: 無料枠内（月2,000分）
- **X API**: 従量課金（1投稿あたり約$0.003、月90投稿で約$0.3）

## 自動投稿を停止したい場合

1. https://github.com/anmituTK/GIVE/actions にアクセス
2. 「Auto Post to X」を選択
3. 右上の「...」→ 「Disable workflow」

再開する場合は同じ場所から「Enable workflow」。

## GitHub Secrets（設定済み）

| Secret名 | 用途 |
|----------|------|
| X_API_KEY | X APIキー |
| X_API_SECRET | X APIシークレット |
| X_ACCESS_TOKEN | Xアクセストークン |
| X_ACCESS_SECRET | Xアクセストークンシークレット |
| GMAIL_USER | Gmail アドレス |
| GMAIL_APP_PASSWORD | Gmail アプリパスワード |

設定場所: https://github.com/anmituTK/GIVE/settings/secrets/actions

## トラブルシューティング

### 投稿が失敗した場合
- GitHub Actions のログを確認（Actions → 該当のrunをクリック）
- エラー時はstateが更新されないため、次回実行時に再試行される

### CreditsDepleted エラー
- X Developer Console でクレジット残高を確認
- https://console.x.com/ → クレジット → クレジットを購入する

### APIキーを再生成した場合
- GitHub Secrets の該当する値を更新する
- アクセストークンは権限変更後に再生成が必要
