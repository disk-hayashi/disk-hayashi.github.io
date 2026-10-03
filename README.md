# 林 大介 プロフィールサイト

英語・日本語のプロフィールサイトを、Node.js 製の静的サイトジェネレーターで構築するリポジトリです。公開用 HTML はソースデータとテンプレート部品から生成し、GitHub Pages へデプロイします。

## 前提環境

- Node.js 22（GitHub Actions と同じメジャーバージョンを推奨）
- npm

初回のみ依存関係をインストールします。

```bash
npm install
```

## 編集するファイル

プロフィールの内容は用途ごとに分かれています。

| ファイル | 内容 |
| --- | --- |
| `data/publications.data.js` | 論文・国際会議・国内会議 |
| `data/patents.data.js` | 特許 |
| `data/products.data.js` | 製品化・社会実装プロジェクト |
| `data/research-projects.data.js` | 研究プロジェクト |
| `data/awards.data.js` | 受賞歴 |
| `data/certifications.data.js` | 資格・認定 |
| `data/societies.data.js` | 所属学会 |
| `site.config.js` | サイトの基準 URL |
| `partials/body.shell.html` | ページ共通の本文構造と固定文言 |
| `assets/css/site.css` | 表示スタイル |
| `assets/js/site.js` | 特許ページの絞り込み動作 |

トップページの研究発表数、査読論文数、特許数などは `data/` の内容からビルド時に自動集計されます。集計値を生成済み HTML に直接書き込んで管理しないでください。

### 日常的な更新の早見表

- 論文・学会発表を追加する → `data/publications.data.js`
- 特許を追加・更新する → `data/patents.data.js`
- 社会実装プロジェクトを追加する → `data/products.data.js`
- 研究プロジェクトを追加する → `data/research-projects.data.js`
- 受賞を追加する → `data/awards.data.js`
- 資格・所属学会を更新する → 対応する `data/*.data.js`
- Hero、ナビゲーションなど固定表示を変更する → `partials/body.shell.html`
- 見た目を変更する → `assets/css/site.css`

通常のコンテンツ更新では、`lib/` や生成済み `index.html` を直接編集する必要はありません。更新後は `npm test` を実行してください。`npm test` はビルドも含むため、テストが成功すれば生成ファイルも最新化されます。

## 開発コマンド

```bash
# テストを実行
npm test

# 公開用ファイルを生成
npm run build

# ビルド後にローカルサーバーを起動
npm run dev

# SNS共有用のOGP画像を再生成
npm run og:image
```

`npm run dev` が表示する URL をブラウザーで開いて確認します。変更を公開する前に、少なくとも `npm test && npm run build` が成功することを確認してください。

## 生成ファイルのルール

次のファイルは `npm run build` が生成・更新する公開成果物です。

- `index.html` と `ja/index.html`
- `projects/`、`publications/`、`patents/`、`career/` および `ja/` 以下の各 `index.html`
- `sitemap.xml`
- `robots.txt`

生成ファイルを直接編集しても、次回のビルドで上書きされます。内容の変更は `data/`、`partials/`、`assets/`、`site.config.js` などのソース側へ行い、ビルドで反映してください。生成済みファイルは GitHub Pages がそのまま配信するため、ソース変更と一緒にコミットします。

## GitHub Pages へのデプロイ

`main` ブランチへの push、または GitHub Actions の手動実行で `.github/workflows/pages.yml` が動作します。ワークフローは Node.js 22 をセットアップし、サイトをビルドして、リポジトリ全体を GitHub Pages 用アーティファクトとしてアップロード・公開します。

通常の更新手順は次のとおりです。

1. ソースを編集する。
2. `npm test && npm run build` を実行する。
3. ソースと生成ファイルをコミットする。
4. `main` ブランチへ push する。
5. GitHub Actions の `Deploy GitHub Pages` が成功したことを確認する。

## ディレクトリ構成

```text
.
├── .github/workflows/pages.yml  # GitHub Pages デプロイ
├── assets/                      # CSS、ブラウザー用 JS、画像
├── data/                        # コンテンツの正本
├── lib/
│   ├── render.js                # HTML レンダリング
│   └── site-model.js            # データ検証と集計
├── partials/                    # 共通 HTML 部品
├── tests/                       # node:test のテスト
├── build.js                     # 静的サイトのビルド入口
├── site.config.js               # サイト設定
└── package.json                 # npm コマンド
```

公開ルートは `/`、`/projects/`、`/publications/`、`/patents/`、`/career/` と、それぞれに対応する `/ja/` 以下の日本語ページです。
