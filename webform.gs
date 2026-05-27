/**
 * 引っ越しセール 入札受付 GAS Web App
 *
 * 手順:
 *   1. script.google.com で「新しいプロジェクト」を作成
 *   2. このコードを全部貼り付けて上書き
 *   3. 関数「setup」を実行（スプレッドシートを自動作成）
 *   4. デプロイ → 新しいデプロイ → 種類:「ウェブアプリ」
 *      - 次のユーザーとして実行: 自分
 *      - アクセスできるユーザー: 全員
 *   5. デプロイURLをコピー（ https://script.google.com/macros/s/.../exec ）
 *   6. index.html の CONFIG.gasEndpoint に貼り付け
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

// ===== GET受信・スプレッドシートに保存 =====
// GASのリダイレクト(302)でPOSTがGETに変換されるため doGet で受信する
function doGet(e) {
  try {
    if (!e.parameter.name) {
      return ContentService.createTextOutput('ready');
    }
    const ssId = PropertiesService.getScriptProperties().getProperty('SS_ID');
    if (!ssId) throw new Error('setup() を先に実行してください');
    const sheet = SpreadsheetApp.openById(ssId).getActiveSheet();
    sheet.appendRow([
      new Date(),
      e.parameter.name,
      e.parameter.contact,
      e.parameter.item,
      e.parameter.price,
    ]);
    return ContentService.createTextOutput('ok');
  } catch (err) {
    return ContentService.createTextOutput('error: ' + err.message);
  }
}

function doPost(e) { return doGet(e); }
