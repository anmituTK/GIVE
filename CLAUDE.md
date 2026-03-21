# Give - サービス概要

## サービス内容
Giveは、LINEを使った無料の個人運営相談サービス。
「誰かに話したいと思った時のための場所」として、LINE公式アカウントを通じて相談を受け付ける。

## コアメッセージ
- 「相談できなかった」ではなく「相談という概念自体がなかった」
- 自分にはなかった選択肢を、今苦しんでいる人に届けたい
- タグライン: 「ひとりで抱えなくていい。」

## ブランディング
- 表記: 「Give」（大文字GIVEではなく柔らかい印象）
- シンボル: あじさい（雨の中でも鮮やかに咲く＝つらくても強く美しく生きられる）
- カラー: ブルー系（#6B8EB5）
- フォント: M PLUS Rounded 1c
- トーン: 柔らかく、押しつけがましくない表現

## URL
- 公開サイト: https://give-kappa-ten.vercel.app/
- GitHub: https://github.com/anmituTK/GIVE
- LINE友だち追加: https://lin.ee/9dvkBY3
- note記事: https://note.com/mild_dahlia3952/n/nb688ca5b7268

## ホスティング
Vercel（GitHub連携、mainブランチへのpushで自動デプロイ）

## プロジェクト構成
```
GIVE/
├── CLAUDE.md            ← このファイル（サービス概要・方針）
├── style.css            ← 共通CSS（フォント、カラー、レイアウト基盤）
├── index.html           ← ランディングページ
├── privacy.html         ← プライバシーポリシー
├── posts.html           ← 投稿管理ページ（運営用、data/posts.jsonを読み込み）
├── hydrangea.jpg        ← ヒーロー背景画像
├── ogp.png              ← OGP画像（1200x630）
├── package.json         ← npm依存管理（twitter-api-v2）
├── data/
│   └── posts.json       ← 投稿データ（唯一の管理元、posts.htmlとスクリプト両方が参照）
├── state/
│   └── post-state.json  ← 投稿済み状態（GitHub Actionsが自動更新）
├── scripts/
│   └── post-to-x.mjs   ← X自動投稿スクリプト
├── .github/workflows/
│   └── auto-post.yml    ← GitHub Actionsワークフロー（1日3回自動投稿）
└── docs/                ← 作業用ファイル（直接公開しない想定）
    ├── note.txt              ← note記事の下書き
    ├── あいさつメッセージ.txt  ← LINE友だち追加時の自動メッセージ
    ├── 応答メッセージ.txt      ← LINEリッチメニューの応答メッセージ
    ├── 投稿内容.txt            ← SNS投稿一覧（テキスト版、旧データ）
    ├── icon.html              ← LINEアイコン生成用
    ├── richmenu.html          ← リッチメニュー画像生成用
    └── twitter-card.html      ← Twitterカード生成用
```

## ランディングページ構成（表示順）
1. Hero（ロゴ・タグライン・雨アニメーション）
2. Hydrangea Message（導入メッセージ）
3. Features（特徴: 完全無料・LINEで相談・登録不要）
4. Steps（利用の流れ: 3ステップ）
5. Mid CTA（中盤のLINEボタン）
6. Story（Giveが生まれた理由）
7. For You（こんな気持ちの方へ）
8. FAQ（よくある質問: 4問、アコーディオン形式）
9. CTA（LINEで話してみる）
10. Footer（免責事項・プライバシーポリシーリンク）

## SNS投稿（X自動投稿）
- データ管理: data/posts.json（投稿の追加・編集はここで行う）
- A（寄り添い系）: 20本 — 共感を生む投稿
- B（紹介系）: 10本 — Giveの紹介とURL付き
- 配分: A:B = 2:1（A → A → B のローテーション）
- 選択: ランダム（重複なし、一巡したらリセット＋メール通知）
- スケジュール: 毎日 8:00 / 12:00 / 19:00 JST（GitHub Actions）
- 状態管理: state/post-state.json（Actionsが自動コミット）

## 注意事項
- Giveは医療機関・カウンセリング機関ではない
- 文章表現は柔らかさとニュアンスに注意する（重すぎない、押しつけない）
- コードを修正する際は共通CSS（style.css）を確認し、重複を避ける
