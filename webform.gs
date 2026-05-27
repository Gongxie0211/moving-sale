/**
 * 引っ越しセール 入札フォーム Web App
 *
 * 手順:
 *   1. script.google.com で「新しいプロジェクト」を作成
 *   2. このコードを全部貼り付けて上書き
 *   3. 関数「setup」を実行（スプレッドシートを自動作成）
 *   4. デプロイ → 新しいデプロイ → 種類:「ウェブアプリ」
 *      - 次のユーザーとして実行: 自分
 *      - アクセスできるユーザー: 全員
 *   5. デプロイURLをコピー（ https://script.google.com/macros/s/.../exec ）
 *   6. index.html の CONFIG を更新:
 *        googleFormUrl: "コピーしたURL",
 *        googleFormItemField: "item",
 */

// ===== 一度だけ実行 =====
function setup() {
  const ss = SpreadsheetApp.create('引っ越しセール 入札回答');
  const sheet = ss.getActiveSheet();
  sheet.setName('回答');
  sheet.appendRow(['タイムスタンプ', 'お名前', '連絡先（メール/Viber）', '商品番号・商品名', '入札金額（Ks）']);
  sheet.setFrozenRows(1);

  PropertiesService.getScriptProperties().setProperty('SS_ID', ss.getId());

  console.log('========================================');
  console.log('✅ セットアップ完了！');
  console.log('スプレッドシートURL: ' + ss.getUrl());
  console.log('========================================');
  console.log('次: デプロイ → 新しいデプロイ → ウェブアプリ');
}

// ===== Web App エントリーポイント =====
function doGet(e) {
  const itemName = (e.parameter && e.parameter.item) ? e.parameter.item : '';
  return HtmlService.createHtmlOutput(buildHtml(itemName))
    .setTitle('入札フォーム / တင်ဒါဖောင်')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
}

// ===== 入札データ保存（クライアントから呼ばれる） =====
function saveBid(data) {
  try {
    const ssId = PropertiesService.getScriptProperties().getProperty('SS_ID');
    if (!ssId) throw new Error('setup() を先に実行してください');
    const sheet = SpreadsheetApp.openById(ssId).getActiveSheet();
    sheet.appendRow([new Date(), data.name, data.contact, data.item, data.price]);
    return { ok: true };
  } catch (err) {
    return { ok: false, msg: err.message };
  }
}

// ===== HTML生成 =====
function buildHtml(itemName) {
  const safe = itemName
    .replace(/&/g, '&amp;').replace(/"/g, '&quot;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>入札フォーム / တင်ဒါဖောင်</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&family=Noto+Sans+Myanmar:wght@400;700&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Noto Sans Myanmar','Noto Sans JP',sans-serif;background:#f7f5f2;min-height:100vh;padding:24px 16px;display:flex;justify-content:center;align-items:flex-start}
.card{background:#fff;border-radius:16px;padding:32px 24px;width:100%;max-width:520px;box-shadow:0 2px 16px rgba(0,0,0,.08)}
h1{font-size:1.15rem;color:#2d6a4f;margin-bottom:6px}
.sub{font-size:.82rem;color:#666;margin-bottom:28px;line-height:1.75}
.field{margin-bottom:20px}
label{display:block;font-size:.85rem;font-weight:700;color:#333;margin-bottom:6px}
.req{color:#e76f51}
input{width:100%;border:1.5px solid #ddd;border-radius:8px;padding:10px 12px;font-size:.95rem;font-family:inherit;transition:border-color .2s}
input:focus{outline:none;border-color:#2d6a4f}
.hint{font-size:.78rem;color:#888;margin-top:5px}
.btn{width:100%;background:#2d6a4f;color:#fff;border:none;border-radius:10px;padding:14px;font-size:1rem;font-family:inherit;font-weight:700;cursor:pointer;margin-top:4px;transition:background .2s}
.btn:hover{background:#1b4332}
.btn:disabled{background:#aaa;cursor:default}
.success{display:none;text-align:center;padding:20px 0}
.success .emo{font-size:3rem;margin-bottom:12px}
.success h2{color:#2d6a4f;font-size:1.1rem;margin-bottom:10px;line-height:1.6}
.success p{color:#555;font-size:.88rem;line-height:1.75}
</style>
</head>
<body>
<div class="card">
  <h1>【引っ越しセール】入札フォーム / တင်ဒါဖောင်</h1>
  <p class="sub">締め切り：2026年6月14日（日）23:59<br>封緘入札方式（他の方の入札額は非公開）<br>နောက်ဆုံးရက်: ၂၀၂၆ ဇွန်လ ၁၄ ရက် ၂၃:၅၉</p>

  <form id="form">
    <div class="field">
      <label>お名前 / အမည် <span class="req">*</span></label>
      <input id="name" required placeholder="山田 太郎 / ဦးအောင်">
    </div>
    <div class="field">
      <label>連絡先（メール or Viber Phone No.）/ ဆက်သွယ်ရာ <span class="req">*</span></label>
      <input id="contact" required placeholder="email@example.com または 09xxxxxxxx">
    </div>
    <div class="field">
      <label>商品番号・商品名 / ပစ္စည်းနံပါတ်・ပစ္စည်းအမည် <span class="req">*</span></label>
      <input id="item" required value="${safe}">
      <p class="hint">自動入力済み・変更不要 / အလိုအလျောက် ဖြည့်သွင်းထားသည်</p>
    </div>
    <div class="field">
      <label>入札金額（Ks）/ တင်ဒါပမာဏ（Ks） <span class="req">*</span></label>
      <input id="price" required type="number" min="1" placeholder="例：50000">
    </div>
    <button class="btn" id="btn" type="submit">🖊 入札する / တင်ဒါဆွဲမည်</button>
  </form>

  <div class="success" id="success">
    <div class="emo">✅</div>
    <h2>入札を受け付けました！<br>တင်ဒါကို လက်ခံပြီးပါပြီ</h2>
    <p>締め切り後、最高入札者の方にのみご連絡します。<br>ကျေးဇူးတင်ပါသည်！</p>
  </div>
</div>
<script>
document.getElementById('form').addEventListener('submit', function(ev) {
  ev.preventDefault();
  var btn = document.getElementById('btn');
  btn.disabled = true;
  btn.textContent = '送信中... / ပို့နေသည်...';
  var data = {
    name:    document.getElementById('name').value,
    contact: document.getElementById('contact').value,
    item:    document.getElementById('item').value,
    price:   document.getElementById('price').value
  };
  google.script.run
    .withSuccessHandler(function(res) {
      if (res.ok) {
        document.getElementById('form').style.display = 'none';
        document.getElementById('success').style.display = 'block';
      } else {
        alert('エラー: ' + res.msg);
        btn.disabled = false;
        btn.textContent = '🖊 入札する / တင်ဒါဆွဲမည်';
      }
    })
    .withFailureHandler(function(err) {
      alert('送信エラー: ' + err.message);
      btn.disabled = false;
      btn.textContent = '🖊 入札する / တင်ဒါဆွဲမည်';
    })
    .saveBid(data);
});
</script>
</body>
</html>`;
}
