/**
 * 引っ越しセール GAS Web App
 *
 * 関数一覧:
 *   setup()          — 初回のみ: 入札回答スプレッドシートを作成
 *   setupItemSheet() — 初回のみ: 商品リストシートを作成・初期データ投入
 *   doGet(e)         — Web App エントリ（入札保存 & 商品JSON取得）
 *   doPost(e)        — doGet に委譲
 *
 * デプロイ手順:
 *   デプロイ → デプロイを管理 → 編集 → 新しいバージョン → デプロイ
 */

// =====================================================
// 初回セットアップ（一度だけ実行）
// =====================================================
function setup() {
  const ss = SpreadsheetApp.create('引っ越しセール 入札回答');
  const sheet = ss.getActiveSheet();
  sheet.setName('回答');
  sheet.appendRow(['タイムスタンプ', 'お名前', '連絡先（メール/Viber）', '商品番号・商品名', '入札金額（Ks）']);
  sheet.setFrozenRows(1);
  PropertiesService.getScriptProperties().setProperty('SS_ID', ss.getId());
  console.log('✅ スプレッドシートURL: ' + ss.getUrl());
  console.log('次: setupItemSheet() を実行してください');
}

// =====================================================
// 商品リストシート作成（一度だけ実行）
// =====================================================
function setupItemSheet() {
  const ssId = PropertiesService.getScriptProperties().getProperty('SS_ID');
  const ss = SpreadsheetApp.openById(ssId);

  // 既存シートを削除して再作成
  let sheet = ss.getSheetByName('商品リスト');
  if (sheet) ss.deleteSheet(sheet);
  sheet = ss.insertSheet('商品リスト');

  // ヘッダー
  const headers = ['id', 'name', 'name_my', 'description', 'minPrice', 'images', 'productUrl', 'condition'];
  sheet.getRange(1, 1, 1, headers.length)
    .setValues([headers])
    .setFontWeight('bold')
    .setBackground('#2d6a4f')
    .setFontColor('#ffffff');
  sheet.setFrozenRows(1);

  // condition列（H列）にドロップダウン
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['新品同様', '美品', '訳あり'], true)
    .setAllowInvalid(true)
    .build();
  sheet.getRange('H2:H100').setDataValidation(rule);

  // 列幅
  sheet.setColumnWidths(1, 1, 40);
  sheet.setColumnWidths(2, 1, 320);
  sheet.setColumnWidths(3, 1, 200);
  sheet.setColumnWidths(4, 1, 220);
  sheet.setColumnWidths(5, 1, 100);
  sheet.setColumnWidths(6, 1, 260);
  sheet.setColumnWidths(7, 1, 220);
  sheet.setColumnWidths(8, 1, 100);

  // 現在の32商品データ
  const data = [
    [1,  'Inverter: True Power 2000VA/24V + Amazon 150Ah + Livfast 150Ah', '', '2023年購入', 2000000, 'images/img_14.jpg', '', '訳あり'],
    [2,  'Inverter: Altima 1200VA/12V + A1 Green Tubular 250Ah', '', '2023年購入', 2000000, 'images/img_28.jpg,images/img_30.jpg', '', '美品'],
    [3,  'Generator TAR600 12000', '', '2022年購入', '', '', '', ''],
    [4,  'Money Counter GFC-170', '', '', 400000, 'images/img_17.jpg,images/img_35.jpg', 'https://share.google/19SaYzAywjOeVDVq5', '美品'],
    [5,  'Amp (Zulex BN-308C) + Speaker (Onkyo D-V77)', '', 'Speaker OK / Amp 片Ch音出ず', 300000, 'images/img_33.jpg,images/img_34.jpg', '', '訳あり'],
    [6,  'Step-down Transformer 220V→100V 1000W', '', '', 300000, 'images/img_09.jpg', '', ''],
    [7,  'Step-down Transformer 220V→100V 300W', '', '', 300000, 'images/img_10.jpg', '', ''],
    [8,  'Panasonic Microwave', '', '2017年頃購入', 250000, '', '', ''],
    [9,  'Xiaomi 50inch TV + Stand', '', '2019年頃購入。機能は問題なし。周囲が赤く磁性あり', 1300000, 'images/img_36.jpg,images/img_37.jpg', '', '訳あり'],
    [10, 'Drawer 5step Blue', '', '2016年頃購入 / W33×L43×H109 / 5 Big Drawers', 80000, 'images/img_07.jpg,images/img_08.jpg', '', ''],
    [11, 'Drawer 5step Green', '', '2016年頃購入 / W33×L43×H109 / 5 Big Drawers', 80000, 'images/img_07.jpg,images/img_08.jpg', '', ''],
    [12, 'Mixer + Wired Mic ×2 + Wireless Mic ×2', '', '', '', 'images/img_22.jpg', '', ''],
    [13, 'Zhiyun Smooth 4 Gimbal Stabilizer (Smartphone)', '', '', 200000, 'images/img_32.jpg', 'https://www.amazon.com/Smooth-Handheld-Stabilizer-Smartphone-Black/dp/B07BHCC3BV?th=1', '美品'],
    [14, 'Electric Guitar Set: Ibanez (Copy) + Yamaha (Modify) + Amp Yamaha AR-1500 + Multi Effector MG-300', '', '', 2000000, 'images/img_01.jpg,images/img_02.jpg,images/img_03.jpg', '', '美品'],
    [15, '生徒用イス', '', '', 3000, 'images/img_05.jpg', '', ''],
    [16, 'プラスチック棚', '', 'W33×L43×H109 / 5 Big Drawers', 80000, 'images/img_07.jpg,images/img_08.jpg', '', ''],
    [17, 'Printer #1 Canon G1010', '', '', '', 'images/img_16.jpg', '', ''],
    [18, 'Printer #2 Canon G1010', '', '', '', 'images/img_16.jpg', '', ''],
    [19, 'Printer #3 Epson L4260', '', 'Jam Error', '', '', '', '訳あり'],
    [20, 'Xiaomi Wifi Router + Battery', '', '', 30000, 'images/img_18.jpg,images/img_19.jpg', '', ''],
    [21, 'Wifi Router TP-LINK', '', '', 20000, 'images/img_20.jpg', '', ''],
    [22, 'PC #1 Dell Inspiron 14 3000', '', '8G RAM / 500GB SSD', 700000, 'images/img_21.jpg,images/img_26.jpg', '', '美品'],
    [23, 'PC #2 Dell Inspiron 14 3000', '', '16G RAM / 1TB HDD', 600000, 'images/img_26.jpg,images/img_31.jpg', '', ''],
    [24, 'PC #3', '', '', '', '', '', ''],
    [25, '壁掛け扇風機 ×3', '', '1台は首が回らない。他2台は良好', 300000, 'images/img_42.jpg', '', '訳あり'],
    [26, 'Xiaomi 55inch TV + Stand', '', '修理すれば治ると思うが不明', 400000, 'images/img_46.jpg,images/img_45.jpg', '', '訳あり'],
    [27, 'Circle Light with Remote', '', '', 100000, 'images/img_47.jpg', '', ''],
    [28, 'Tripod Big', '', '', 100000, 'images/img_48.jpg', '', ''],
    [29, 'Tripod Small', '', '', 30000, 'images/img_50.jpg,images/img_51.jpg,images/img_49.jpg', '', ''],
    [30, 'イス', '', '', 300000, 'images/img_52.jpg', '', ''],
    [31, '照明 Set（Lighting + Tripod ×3）', '', '', 300000, 'images/img_54.jpg', '', '新品同様'],
    [32, '譜面台＋三脚', '', '', 300000, 'images/img_55.jpg', '', ''],
  ];
  sheet.getRange(2, 1, data.length, headers.length).setValues(data);

  console.log('✅ 商品リストシート作成完了: ' + ss.getUrl());
  console.log('次: デプロイ → デプロイを管理 → 編集 → 新しいバージョン → デプロイ');
}

// =====================================================
// Web App エントリポイント
// =====================================================
function doGet(e) {
  // 商品リストJSON取得
  if (e.parameter.action === 'items') {
    return getItemsJson();
  }

  // 入札保存
  if (e.parameter.name) {
    return saveBid(e);
  }

  return ContentService.createTextOutput('ready');
}

function doPost(e) { return doGet(e); }

// =====================================================
// 入札保存
// =====================================================
function saveBid(e) {
  try {
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

// =====================================================
// 商品リストをJSONで返す（Claudeが Update 時に使用）
// =====================================================
function getItemsJson() {
  try {
    const ssId = PropertiesService.getScriptProperties().getProperty('SS_ID');
    const ss = SpreadsheetApp.openById(ssId);
    const sheet = ss.getSheetByName('商品リスト');
    if (!sheet) throw new Error('商品リストシートが見つかりません');

    const rows = sheet.getDataRange().getValues();
    const headers = rows[0];
    const items = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row[0]) continue; // id が空の行はスキップ

      const obj = {};
      headers.forEach((h, j) => { obj[h] = row[j]; });

      items.push({
        id:         Number(obj.id),
        name:       String(obj.name || ''),
        name_my:    obj.name_my   ? String(obj.name_my)   : null,
        description: String(obj.description || ''),
        minPrice:   obj.minPrice  ? Number(obj.minPrice)  : null,
        images:     obj.images    ? String(obj.images).split(',').map(s => s.trim()).filter(Boolean) : [],
        productUrl: obj.productUrl ? String(obj.productUrl) : null,
        condition:  String(obj.condition || ''),
      });
    }

    return ContentService
      .createTextOutput(JSON.stringify(items))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// =====================================================
// テスト用
// =====================================================
function testSaveBid() {
  const result = doGet({
    parameter: { name: 'テスト', contact: '09123', item: 'No.1 テスト', price: '100000' }
  });
  console.log(result.getContent());
}
