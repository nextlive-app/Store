// --- ส่วนกำหนดค่าตัวแปรเริ่มต้น (Configuration) ---
var SPREADSHEET_ID = "XXXXXXXXXXXXX"; // ไอดีของ Google Sheet
var ORDERS_SHEET_NAME = "Orders"; // ชื่อชีตสำหรับเก็บประวัติการสั่งซื้อ
var PRODUCT_LIST_SHEET_NAME = "ProductList"; // ชื่อชีตสำหรับดึงข้อมูลสินค้า
var DRIVE_FOLDER_ID = 'XXXXXXXXXXXX'; // ไอดีโฟลเดอร์ใน Google Drive ที่ใช้เก็บรูปสลิป

var BRANCH_ID = 'XXXXXXXXXXXX'; // รหัสสาขาของ SlipOK
var API_KEY = 'XXXXXXXXXXXX'; // คีย์เชื่อมต่อ SlipOK API

/**
 * ฟังก์ชันหลักที่รับข้อมูลจาก Webhook (POST Request)
 */
function doPost(e) {
  try {
    // 1. รับและแปลงข้อมูล JSON ที่ส่งมาจาก Client
    var data = JSON.parse(e.postData.contents);
    var productsname = data.productsname; // ชื่อสินค้า
    var enteredPrice = parseFloat(data.price); // ราคาที่ลูกค้ากรอกมา
    var buyname = data.buyname; // ชื่อผู้ซื้อ
    var buyemail = data.buyemail; // อีเมลผู้ซื้อ
    var base64 = data.base64; // ข้อมูลรูปภาพสลิปแบบ Base64
    var type = data.type; // ประเภทไฟล์ (เช่น image/jpeg)
    var name = data.name; // ชื่อไฟล์รูปภาพ

    // 2. แปลงข้อมูล Base64 และสร้างเป็นไฟล์รูปภาพ (Blob)
    var decodedData = Utilities.base64Decode(base64);
    var blob = Utilities.newBlob(decodedData, type, name);

    // 3. บันทึกรูปภาพสลิปลงใน Google Drive ตามโฟลเดอร์ที่ระบุ
    var folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    var newFile = folder.createFile(blob);
    var fileLink = newFile.getUrl(); // เก็บลิงก์ของไฟล์ที่สร้างเสร็จแล้ว

    // 4. ส่งรูปสลิปไปตรวจสอบความถูกต้องกับ SlipOK API
    var verificationResult = verifySlipWithSlipOK(blob, enteredPrice);

    // 5. บันทึกผลการตรวจสอบและข้อมูลการซื้อลงใน Google Sheet (Orders)
    logResultToSheet(productsname, enteredPrice, buyname, buyemail, fileLink, verificationResult);

    // 6. เงื่อนไข: ถ้าการชำระเงินถูกต้อง
    if (verificationResult === "การชำระเงินถูกต้อง") {
      var productDetails = getProductDetails(productsname); // ดึงข้อมูลรายละเอียดสินค้า
      
      // ตรวจสอบว่ามีสินค้านี้จริง และราคาในระบบตรงกับที่ลูกค้าจ่ายมาหรือไม่
      if (productDetails && productDetails.price === enteredPrice) {
        sendEmailWithProductDetails(buyemail, productDetails); // ส่งเมลหาลูกค้า
        return ContentService.createTextOutput("การชำระเงินถูกต้องและข้อมูลผลิตภัณฑ์ถูกส่งไปยังอีเมล: " + buyemail);
      } else {
        return ContentService.createTextOutput("การชำระเงินถูกต้องแต่ราคาที่กรอกไม่ตรงกับราคาที่บันทึกใน ProductList");
      }
    }

    // ส่งผลลัพธ์กลับในกรณีอื่นๆ (เช่น สลิปปลอม หรือจ่ายไม่ครบ)
    return ContentService.createTextOutput("ผลการตรวจสอบ: " + verificationResult);
  } catch (error) {
    // กรณีเกิดข้อผิดพลาดในระบบ
    return ContentService.createTextOutput("ข้อผิดพลาด: " + error.toString());
  }
}

/**
 * ฟังก์ชันตรวจสอบสลิปผ่าน SlipOK API
 */
function verifySlipWithSlipOK(blob, expectedPrice) {
  var url = 'https://api.slipok.com/api/line/apikey/' + BRANCH_ID;
  var formData = {
    'files': blob,
    'log': 'true'
  };
  var options = {
    'method': 'post',
    'headers': {
      'x-authorization': API_KEY
    },
    'payload': formData,
    'muteHttpExceptions': true
  };

  try {
    var response = UrlFetchApp.fetch(url, options);
    var jsonResponse = JSON.parse(response.getContentText());

    // ตรวจสอบว่า HTTP Status คือ 200 และ API ตอบกลับว่าสำเร็จ
    if (response.getResponseCode() === 200 && jsonResponse.success === true) {
      var actualPrice = parseFloat(jsonResponse.data.amount); // ยอดเงินโอนจริงจากสลิป
      if (actualPrice === expectedPrice) {
        return "การชำระเงินถูกต้อง";
      } else {
        return "ราคาที่ตรวจสอบได้ (" + actualPrice + ") ไม่ตรงกับราคาที่กรอก (" + expectedPrice + ")";
      }
    } else if (jsonResponse.code === 1014) {
      return "บัญชีผู้รับไม่ตรงกับบัญชีหลักของร้าน";
    } else {
      return "ข้อผิดพลาด: " + (jsonResponse.message || 'ข้อผิดพลาดที่ไม่ทราบสาเหตุ');
    }
  } catch (e) {
    return 'ข้อผิดพลาดในการเชื่อมต่อ API: ' + e.message;
  }
}

/**
 * ฟังก์ชันบันทึกข้อมูลลงในหน้า Google Sheet
 */
function logResultToSheet(productsname, price, buyname, buyemail, fileLink, verificationResult) {
  var sheet = getSheetById(SPREADSHEET_ID, ORDERS_SHEET_NAME);
  var timestamp = new Date(); // วันเวลาปัจจุบัน
  // เพิ่มแถวข้อมูลใหม่ลงในชีต
  sheet.appendRow([productsname, price, buyname, buyemail, fileLink, verificationResult, timestamp]);
}

/**
 * ฟังก์ชันดึงรายละเอียดสินค้าจากชีต ProductList
 */
function getProductDetails(productsname) {
  var sheet = getSheetById(SPREADSHEET_ID, PRODUCT_LIST_SHEET_NAME);
  var data = sheet.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) { // เริ่มวนลูปบรรทัดที่ 2 (ข้ามหัวตาราง)
    if (data[i][0] === productsname) { // ถ้าชื่อสินค้าตรงกัน
      return {
        name: data[i][0],
        description: data[i][1],
        price: parseFloat(data[i][2]),
        file1: data[i][3],
        file2: data[i][4],
      };
    }
  }
  return null; // ถ้าไม่พบสินค้า
}

/**
 * ฟังก์ชันส่งอีเมลรายละเอียดสินค้าให้ลูกค้า
 */
function sendEmailWithProductDetails(email, productDetails) {
  var subject = "รายละเอียดผลิตภัณฑ์ของคุณ";
  var message = "เรียนลูกค้า,\n\n" +
    "ขอขอบคุณที่ซื้อผลิตภัณฑ์จากเรา นี่คือรายละเอียดผลิตภัณฑ์ของคุณ:\n\n" +
    "ชื่อผลิตภัณฑ์: " + productDetails.name + "\n" +
    "รายละเอียด: " + productDetails.description + "\n" +
    "ไฟล์ที่ 1: " + productDetails.file1 + "\n" +
    "ไฟล์ที่ 2: " + productDetails.file2 + "\n" +
    "ราคา: " + productDetails.price + " บาท\n\n" +
    "ขอบคุณที่ไว้วางใจเรา\n";
  MailApp.sendEmail(email, subject, message);
}

/**
 * ฟังก์ชันเรียกใช้หน้าชีต (ถ้าไม่มีชื่อชีตนั้น ให้สร้างขึ้นมาใหม่)
 */
function getSheetById(spreadsheetId, sheetName) {
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  var sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    return spreadsheet.insertSheet(sheetName);
  }

  return sheet;
}