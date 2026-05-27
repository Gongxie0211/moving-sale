/**
 * 既存フォームのフィールドを更新するスクリプト
 *
 * 使い方:
 *   1. https://script.google.com で前回のプロジェクトを開く（または新規作成）
 *   2. このコードを貼り付けて実行（関数: updateFormFields）
 */
function updateFormFields() {
  // 既存フォームのID（編集URLの /d/ と /edit の間の部分）
  const FORM_ID = "1IrcuMEsztgQZLYaVmPOG8T4EcKxcQg0hlMkJDmAZ-Mg";

  const form = FormApp.openById(FORM_ID);
  const items = form.getItems();

  items.forEach(function(item) {
    const title = item.getTitle();

    // 連絡先フィールドを更新
    if (title.indexOf("LINE ID") !== -1) {
      item.asTextItem()
        .setTitle("連絡先（メール or Viber Phone No.） / ဆက်သွယ်ရာ (Email or Viber Phone No.)");
      console.log("✅ 連絡先フィールド更新完了");
    }

    // 商品名フィールドを更新
    if (title.indexOf("商品名") !== -1 || title.indexOf("ပစ္စည်းအမည်") !== -1) {
      item.asTextItem()
        .setTitle("商品番号・商品名 / ပစ္စည်းနံပါတ်・ပစ္စည်းအမည်")
        .setHelpText("入札したい商品番号・商品名 / တင်ဒါဆွဲလိုသောပစ္စည်းနံပါတ်・ပစ္စည်းအမည်");
      console.log("✅ 商品名フィールド更新完了");
    }
  });

  console.log("========================================");
  console.log("フォーム更新完了！");
  console.log("フォームURL: " + form.getPublishedUrl());
  console.log("========================================");
}
