# 教室引っ越しセール サイト

封緘入札方式のオークションサイトです。GitHub Pages でホスティングし、Google フォームで入札を受け付けます。

---

## セットアップ手順

### STEP 1: Google フォームを作成する

1. [Google フォーム](https://forms.google.com) を開いて新規作成
2. 以下のフィールドを追加:

| フィールド名 | 種類 | 備考 |
|---|---|---|
| お名前 | 短文回答 | 必須 |
| 連絡先（メール or LINE ID） | 短文回答 | 必須 |
| 商品名 | プルダウン or 短文回答 | 必須 |
| 入札金額（円） | 短文回答（数字のみ） | 必須 |
| メッセージ | 段落 | 任意 |

3. フォームを公開（「送信」→リンクコピー）

### STEP 2: フォームの「エントリID」を調べる（商品名を自動入力するため）

1. 公開したフォームを Chrome で開く
2. 右クリック → 「検証」（DevTools を開く）
3. 「Elements」タブで、商品名の入力欄を選択
4. `name="entry.XXXXXXXXX"` という属性を確認・コピー

### STEP 3: index.html を編集する

`index.html` を開き、**STEP 1/2** セクションを探して編集:

```javascript
const CONFIG = {
  deadline: new Date("2026-06-14T23:59:59"),  // 締め切り日時
  googleFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSxxxx/viewform",  // ← ここ
  googleFormItemField: "entry.123456789",  // ← ここ
};
```

### STEP 4: 商品を追加する

```javascript
const ITEMS = [
  {
    id: 1,                          // 一意のID（連番でOK）
    name: "MacBook Air 2020",       // 商品名
    description: "2020年購入。バッテリー良好。傷なし。", // 説明
    minPrice: 50000,                // 最低入札額（円）
    image: "images/macbook.jpg",    // 写真ファイルのパス
    productUrl: "https://...",      // 参考URL（なければ null）
    condition: "美品",              // 状態（美品/良品/普通/訳あり）
  },
  // ... 続けて追加
];
```

### STEP 5: 写真を追加する

`images/` フォルダに写真を入れてください。

- ファイル名は半角英数字推奨（例: `item1.jpg`, `macbook.jpg`）
- 推奨サイズ: 横 1200px 以内、JPG/PNG/WebP
- 写真がなければ 📷 プレースホルダーが表示されます

---

## GitHub Pages でデプロイ

```bash
# 1. このフォルダを GitHub リポジトリとして初期化
git init
git add .
git commit -m "Initial commit"

# 2. GitHub に新しいリポジトリを作って push
git remote add origin https://github.com/YOUR_USER/moving-sale.git
git push -u origin main

# 3. GitHub のリポジトリ設定 → Pages → Source: main branch
```

デプロイ後 URL: `https://YOUR_USER.github.io/moving-sale/`

---

## ファイル構成

```
moving-sale/
├── index.html        ← サイト本体（商品情報・設定はここに書く）
├── images/           ← 商品写真を入れるフォルダ
│   ├── item1.jpg
│   └── ...
└── README.md         ← この説明書
```

---

## 入札の流れ（運営側）

1. Google フォームの回答をスプレッドシートで自動集計
2. 6/14 締め切り後にスプレッドシートを確認
3. 商品ごとに最高入札者にメール/LINE で連絡
4. 支払い・引き渡し日程を調整

---

## カスタマイズ

- **締め切り変更**: `CONFIG.deadline` を編集
- **ルール文変更**: HTML の「入札ルール」セクションを直接編集
- **デザイン変更**: `<style>` 内の `:root` のカラー変数を変更
