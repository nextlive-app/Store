var SPREADSHEET_ID = "1uky3Ztp4KETZmG7jCDJjxyz3AB_co2oPof01dTjkliA"; 
var DRIVE_FOLDER_ID = "1xKE4KD8D8kld4jUxyQMBPmMIahM23GPG"; 

var SHEET_SETTINGS = "Settings";
var SHEET_PRODUCTS = "ProductList"; 
var SHEET_OPTIONS = "OptionsList";
var SHEET_USERS = "Users";
var SHEET_ORDERS = "Orders";
var SHEET_TRANSACTIONS = "Transactions"; 
var SHEET_OTP = "OTP";
var SHEET_BOOKING = "Booking"; 
var SHEET_AFFILIATE = "Affiliate";
var SHEET_NETWORK = "Network";

function doGet(e) {
  if (e.parameter.page === 'admin') {
    return HtmlService.createHtmlOutputFromFile('Admin')
        .setTitle('Admin Dashboard | Next Live')
        .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
  }
  if (e.parameter.page === 'affiliate') {
    return HtmlService.createHtmlOutputFromFile('Affiliate')
        .setTitle('ระบบแนะนำเพื่อน | Next Live')
        .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
  }
  if (e.parameter.page === 'livechat') {
    return HtmlService.createHtmlOutputFromFile('LiveChat')
        .setTitle('Live Chat AI | Next Live')
        .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
  }
  return HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('Next Live Shop')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
}

function formatThaiDateTime(dateObj) {
  if (!(dateObj instanceof Date)) {
    var parsed = new Date(dateObj);
    if(isNaN(parsed)) return String(dateObj);
    dateObj = parsed;
  }
  var y = dateObj.getFullYear();
  if(y < 2500) y += 543;
  var m = ("0" + (dateObj.getMonth() + 1)).slice(-2);
  var d = ("0" + dateObj.getDate()).slice(-2);
  var h = ("0" + dateObj.getHours()).slice(-2);
  var min = ("0" + dateObj.getMinutes()).slice(-2);
  return d + "-" + m + "-" + y + " | " + h + ":" + min + " น.";
}

function setupDatabase() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  var settingsSheet = ss.getSheetByName(SHEET_SETTINGS);
  if (!settingsSheet) {
    settingsSheet = ss.insertSheet(SHEET_SETTINGS);
    settingsSheet.appendRow(["หัวข้อการตั้งค่า", "ค่าที่ตั้ง (Value)", "คำอธิบาย"]);
    settingsSheet.getRange("A1:C1").setFontWeight("bold").setBackground("#2c3e50").setFontColor("white");
    
    var initialSettings = [
      ["SiteName", "ร้านออนไลน์", "1 ชื่อเว็บไซต์"],
      ["AdminEmail", "nextlive.ct@gmail.com", "2 อีเมล (แอดมิน)"],
      ["LineLink", "https://line.me/ti/p/~@jpo3470r", "3 ลิงก์ไลน์"],
      ["FacebookLink", "https://facebook.com/ไอดีเฟส", "4 ลิงก์เฟสบุ๊ค"],
      ["SlipOkBranchId", "90OF6QG", "API SlipOK (Branch ID)"],
      ["SlipOkApiKey", "SLIPOK90OF6QG", "API SlipOK (API Key)"],
      ["AdminName", "NARINPAT MEECHAI", "5 ชื่อ นามสกุล แอดมิน"],
      ["BankAccount", "'140000621803299", "6 เลขที่บัญชีพร้อมเพย์ (ใส่ ' นำหน้าป้องกัน 0 หาย)"],
      ["AdminPhone", "'081-160-6998", "7 หมายเลขโทรศัพท์ (ใส่ ' นำหน้าป้องกัน 0 หาย)"],
      ["Code1", "NEXTNEW50", "8 รหัสโค้ดที่ 1"],
      ["Discount1", "50", "9 ส่วนลดรหัสที่ 1 (บาท)"],
      ["Code2", "NEXTLIVE100", "รหัสโค้ดที่ 2"],
      ["Discount2", "100", "ส่วนลดรหัสที่ 2 (บาท)"],
      ["Code3", "NEXTLIVE-PRO300", "รหัสโค้ดที่ 3"],
      ["Discount3", "300", "ส่วนลดรหัสที่ 3 (บาท)"],
      ["SiteActive", "TRUE", "10 เปิด/ปิดเว็บไซต์ (TRUE=เปิด, FALSE=ปิดปรับปรุง)"]
    ];
    settingsSheet.getRange(2, 1, initialSettings.length, 3).setValues(initialSettings);
    settingsSheet.autoResizeColumns(1, 3);
  }

  var productSheet = ss.getSheetByName(SHEET_PRODUCTS);
  if (!productSheet) {
    productSheet = ss.insertSheet(SHEET_PRODUCTS);
    productSheet.appendRow(["รหัสสินค้า", "หมวดหมู่", "ชื่อสินค้า", "รายละเอียด", "ราคา (บาท)", "ลิงก์รูปภาพ", "ลิงก์ดาวน์โหลดสินค้า", "ลิงก์คู่มือการใช้งาน", "สต๊อก"]);
    productSheet.getRange("A1:I1").setFontWeight("bold").setBackground("#e43a3d").setFontColor("white");
    productSheet.getRange("A:A").setNumberFormat("@"); 
  }

  var optionSheet = ss.getSheetByName(SHEET_OPTIONS);
  if (!optionSheet) {
    optionSheet = ss.insertSheet(SHEET_OPTIONS);
    optionSheet.appendRow(["รหัสสินค้า", "ชื่อตัวเลือก", "ราคา (+บาท)", "ไฟล์ดาวน์โหลด", "ไฟล์คู่มือ"]);
    optionSheet.getRange("A1:E1").setFontWeight("bold").setBackground("#e43a3d").setFontColor("white");
    optionSheet.getRange("A:A").setNumberFormat("@");
  } else {
    var optHeaders = optionSheet.getRange("A1:E1").getValues()[0];
    if(optHeaders[0] !== "รหัสสินค้า" || optHeaders[3] !== "ไฟล์ดาวน์โหลด") {
       optionSheet.getRange("A1:E1").setValues([["รหัสสินค้า", "ชื่อตัวเลือก", "ราคา (+บาท)", "ไฟล์ดาวน์โหลด", "ไฟล์คู่มือ"]]);
    }
  }
  
  var userSheet = ss.getSheetByName(SHEET_USERS);
  if (!userSheet) {
    ss.insertSheet(SHEET_USERS).appendRow(["วันที่", "เวลา", "ID User", "ชื่อ", "นามสกุล", "อีเมล์", "เบอร์โทรศัพท์", "รหัสผ่าน", "ธนาคาร", "เลขที่บัญชี", "จำนวนเงิน"]);
  } 

  if (!ss.getSheetByName(SHEET_ORDERS)) ss.insertSheet(SHEET_ORDERS).appendRow(["วันที่", "Ref", "ชื่อ", "เบอร์", "รายการ", "ส่วนลด", "VAT", "ยอดสุทธิ", "สลิป", "สถานะ", "ช่องทางชำระ"]);
  if (!ss.getSheetByName(SHEET_TRANSACTIONS)) ss.insertSheet(SHEET_TRANSACTIONS).appendRow(["วันที่", "ID User", "ชื่อ-นามสกุล", "อีเมล", "เบอร์โทร", "ประเภท", "จำนวนเงิน", "สถานะ", "สลิป/หมายเหตุ"]);
  if (!ss.getSheetByName(SHEET_OTP)) ss.insertSheet(SHEET_OTP).appendRow(["วันที่/เวลา", "อีเมล", "OTP", "สถานะ", "Timestamp (ms)"]);
  
  if (!ss.getSheetByName(SHEET_BOOKING)) {
    var bSheet = ss.insertSheet(SHEET_BOOKING);
    bSheet.appendRow(["วันที่ทำรายการ", "เวลาทำรายการ", "ID User", "ชื่อ", "นามสกุล", "อีเมล์", "เบอร์โทรศัพท์", "หัวข้อการจอง", "รายละเอียด", "วันที่จอง", "เวลาจอง", "เลขที่คิว", "ลำดับคิว", "จำนวนคิวรอ", "สถานะ", "หมายเหตุ"]);
    bSheet.getRange("A1:P1").setFontWeight("bold").setBackground("#34495e").setFontColor("white");
  }

  if (!ss.getSheetByName(SHEET_AFFILIATE)) {
    var affSheet = ss.insertSheet(SHEET_AFFILIATE);
    affSheet.appendRow(["วันที่/เวลา", "UID ผู้แนะนำ", "อีเมล/เบอร์ ผู้ถูกแนะนำ", "ประเภทค่าคอม", "ยอดธุรกรรม (บาท)", "คอมมิชชั่นที่ได้ (บาท)", "สถานะการเบิก"]);
    affSheet.getRange("A1:G1").setFontWeight("bold").setBackground("#665DFF").setFontColor("white");
  }
  if (!ss.getSheetByName(SHEET_NETWORK)) {
    var netSheet = ss.insertSheet(SHEET_NETWORK);
    netSheet.appendRow(["อีเมลผู้ถูกแนะนำ", "เบอร์ผู้ถูกแนะนำ", "UID ผู้แนะนำ"]);
    netSheet.getRange("A1:C1").setFontWeight("bold").setBackground("#A3A0FF").setFontColor("white");
  }
}

function notifyAdmin(config, subject, detailsHtml, alertType = "info") {
  var headerColor = "#333333";
  var iconStr = "ℹ️";
  if(alertType === "success") { headerColor = "#28a745"; iconStr = "✅"; }
  else if(alertType === "error") { headerColor = "#dc3545"; iconStr = "❌"; }
  else if(alertType === "warning") { headerColor = "#ffc107"; iconStr = "⚠️"; }

  var htmlBody = `
    <div style="font-family: 'Tahoma', sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
      <div style="background-color: ${headerColor}; color: white; padding: 15px 20px; font-size: 18px; font-weight: bold;">
        ${iconStr} [Admin Alert] ${subject}
      </div>
      <div style="padding: 20px; background: #fafafa;">
        <div style="background: #ffffff; padding: 15px; border-radius: 5px; border: 1px solid #eee;">
          ${detailsHtml}
        </div>
      </div>
      <div style="background-color: #f1f1f1; color: #888; padding: 10px 20px; font-size: 12px; text-align: center; border-top: 1px solid #ddd;">
        ระบบแจ้งเตือนอัตโนมัติจาก ${config.SiteName}
      </div>
    </div>
  `;
  try { MailApp.sendEmail({ to: config.AdminEmail, subject: "[Admin] " + subject, htmlBody: htmlBody }); } catch(e) {}
}

function getSettings() {
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_SETTINGS);
  var data = sheet.getDataRange().getValues();
  var config = {};
  for (var i = 1; i < data.length; i++) {
    config[data[i][0]] = data[i][1];
  }
  return config;
}

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var action = payload.action;
    var config = getSettings(); 

    if (action === "init") return handleInit(config);
    else if (action === "getUserData") return handleGetUserData(payload);
    else if (action === "register") return handleRegister(payload, config);
    else if (action === "login") return handleLogin(payload, config);
    else if (action === "logout") return handleLogout(payload, config);
    else if (action === "sendOtp") return handleSendOtp(payload, config); 
    else if (action === "resetPassword") return handleResetPassword(payload, config); 
    else if (action === "changePassword") return handleChangePassword(payload, config); 
    else if (action === "checkDiscountCode") return handleCheckDiscountCode(payload); 
    else if (action === "submitOrder") return handleSubmitOrder(payload, config);
    else if (action === "deposit") return handleDeposit(payload, config);
    else if (action === "addBankAccount") return handleAddBankAccount(payload, config);
    else if (action === "withdraw") return handleWithdraw(payload, config);
    else if (action === "getHistory") return handleGetHistory(payload);
    else if (action === "emailStatement") return handleEmailStatement(payload, config);
    else if (action === "depositTimeout") return handleDepositTimeout(payload, config);
    else if (action === "orderTimeout") return handleOrderTimeout(payload, config);
    else if (action === "getBookingList") return handleGetBookingList(payload);
    else if (action === "getBookedSlots") return handleGetBookedSlots(payload);
    else if (action === "submitBooking") return handleSubmitBooking(payload, config);
    else if (action === "cancelBooking") return handleCancelBooking(payload, config);
    
    // --- Affiliate Actions ---
    else if (action === "getAffiliateData") return handleGetAffiliateData(payload);
    else if (action === "transferAffiliateCredit") return handleTransferAffiliateCredit(payload, config);
    
    // --- ADMIN API ACTIONS ---
    else if (action === "adminLogin") return handleAdminLogin(payload, config);
    else if (action === "adminGetData") return handleAdminGetData(payload);
    else if (action === "adminUpdateRow") return handleAdminUpdateRow(payload);
    else if (action === "adminDeleteRow") return handleAdminDeleteRow(payload);
    else if (action === "adminAddRow") return handleAdminAddRow(payload);
    else if (action === "adminCallQueue") return handleAdminCallQueue(payload, config);
    else if (action === "adminBroadcast") return handleAdminBroadcast(payload, config);
    
    else return jsonResponse({ status: "error", message: "Invalid action" });
  } catch (error) {
    return jsonResponse({ status: "error", message: error.toString() });
  }
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

// =============================================================
//                    AFFILIATE SYSTEM LOGIC
// =============================================================

function processAffiliateCommission(buyerEmail, buyerPhone, transactionAmount, isGuest, inviterFromGuestPayload) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var netSheet = ss.getSheetByName(SHEET_NETWORK);
  var netData = netSheet.getDataRange().getValues();
  var uSheet = ss.getSheetByName(SHEET_USERS);
  var uData = uSheet.getDataRange().getValues();
  var affSheet = ss.getSheetByName(SHEET_AFFILIATE);
  
  var currentInviterUID = inviterFromGuestPayload || "";
  
  if (!currentInviterUID) {
    for (var i = 1; i < netData.length; i++) {
      if (netData[i][0] === buyerEmail || netData[i][1] === buyerPhone || netData[i][1] === "'" + buyerPhone) {
        currentInviterUID = netData[i][2];
        break;
      }
    }
  }
  
  if (!currentInviterUID) return; 

  var isNewUser = false;
  if (!isGuest) {
    var ordSheet = ss.getSheetByName(SHEET_ORDERS).getDataRange().getValues();
    var txSheet = ss.getSheetByName(SHEET_TRANSACTIONS).getDataRange().getValues();
    var count = 0;
    for(var o=1; o<ordSheet.length; o++) { if(ordSheet[o][2] === buyerEmail || ordSheet[o][3] === buyerPhone || ordSheet[o][3] === "'"+buyerPhone) count++; }
    for(var t=1; t<txSheet.length; t++) { if((txSheet[t][3] === buyerEmail || txSheet[t][4] === buyerPhone || txSheet[t][4] === "'"+buyerPhone) && txSheet[t][5] === "ฝากเงิน") count++; }
    if (count <= 1) isNewUser = true; 
  }

  var timestamp = Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy | HH:mm:ss");
  var level = 1;
  var maxDepth = 100; 

  while (currentInviterUID && level <= maxDepth) {
    var rate = 0;
    var typeText = "";

    if (level === 1) {
      rate = isGuest ? 0.01 : 0.05; 
      typeText = isGuest ? "ไม่มีบัญชี (1%)" : (isNewUser ? "เพื่อนใหม่ (5%)" : "เพื่อนเก่า (5%)");
    } else if (level === 2) {
      rate = 0.01;
      typeText = "ชั้นที่ 2 แนะนำต่อ (1%)";
    } else if (level === 3) {
      rate = 0.005;
      typeText = "ชั้นที่ 3 แนะนำต่อ (0.5%)";
    } else {
      rate = 0.001;
      typeText = "ชั้นที่ " + level + " แนะนำต่อ (0.1%)";
    }

    var amount = Number((transactionAmount * rate).toFixed(2));

    if (amount > 0) {
      affSheet.appendRow([timestamp, currentInviterUID, buyerEmail || buyerPhone, typeText, transactionAmount, amount, "ได้รับแล้ว"]);
    }

    var nextInviterUID = "";
    var currentInviterEmail = "";
    var currentInviterPhone = "";

    for(var u=1; u<uData.length; u++) {
      if(uData[u][2] === currentInviterUID) {
        currentInviterEmail = uData[u][5];
        currentInviterPhone = String(uData[u][6]).replace(/'/g, "");
        break;
      }
    }

    if (currentInviterEmail || currentInviterPhone) {
      for (var n = 1; n < netData.length; n++) {
        if (netData[n][0] === currentInviterEmail || netData[n][1] === currentInviterPhone || netData[n][1] === "'" + currentInviterPhone) {
          nextInviterUID = netData[n][2];
          break;
        }
      }
    }

    currentInviterUID = nextInviterUID;
    level++;
  }
}

function handleGetAffiliateData(payload) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var affSheet = ss.getSheetByName(SHEET_AFFILIATE);
  var data = affSheet.getDataRange().getValues();
  
  var uid = payload.uid;
  var availableEarnings = 0; 
  var todayTotalSales = 0;   
  var todayTotalComm = 0;    
  
  var allTimeUsersSet = new Set();
  var todayNewUsersSet = new Set();
  var todayOldUsersSet = new Set();
  var todayTier2UsersSet = new Set();
  var todayTier3UsersSet = new Set();
  var todayTier4PlusUsersSet = new Set();
  var todayGuestUsersSet = new Set();
  
  var statsData = {
    t1NewSales: 0, t1OldSales: 0, t2Sales: 0, t3Sales: 0, t4PlusSales: 0, guestSales: 0,
    t1NewComm: 0, t1OldComm: 0, t2Comm: 0, t3Comm: 0, t4PlusComm: 0, guestComm: 0
  };
  
  var history = [];
  var todayStr = Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy");
  var yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  var yestStr = Utilities.formatDate(yesterdayDate, "GMT+7", "dd/MM/yyyy");
  
  var yesterdayTotalComm = 0;

  for (var i = data.length - 1; i >= 1; i--) {
    if (data[i][1] === uid) {
      var dateStr = String(data[i][0]).split(' |')[0].trim();
      var type = String(data[i][3]);
      var buyerIdentifier = String(data[i][2]).trim();
      
      var amt = parseFloat(String(data[i][5]).replace(/,/g, '')) || 0; 
      var salesAmt = parseFloat(String(data[i][4]).replace(/,/g, '')) || 0; 
      
      if (type === "ถอนรายได้") {
         availableEarnings += amt; 
      } else if (String(data[i][6]) === "ได้รับแล้ว" || String(data[i][6]) === "รอย้ายเข้าเป๋า") {
         availableEarnings += amt;
      }
      
      if (type !== "ถอนรายได้") {
          allTimeUsersSet.add(buyerIdentifier);
          
          if (dateStr === yestStr) {
              yesterdayTotalComm += amt;
          }

          if (dateStr === todayStr) {
              todayTotalSales += salesAmt;
              todayTotalComm += amt;
              
              if (type.includes("เพื่อนใหม่") || type.includes("สมัครบัญชี") || type.includes("สมัครสมาชิก")) {
                  todayNewUsersSet.add(buyerIdentifier);
                  statsData.t1NewSales += salesAmt;
                  statsData.t1NewComm += amt;
              } else if (type.includes("เพื่อนเก่า")) {
                  todayOldUsersSet.add(buyerIdentifier);
                  statsData.t1OldSales += salesAmt;
                  statsData.t1OldComm += amt;
              } else if (type.includes("ชั้นที่ 2")) {
                  todayTier2UsersSet.add(buyerIdentifier);
                  statsData.t2Sales += salesAmt;
                  statsData.t2Comm += amt;
              } else if (type.includes("ชั้นที่ 3")) {
                  todayTier3UsersSet.add(buyerIdentifier);
                  statsData.t3Sales += salesAmt;
                  statsData.t3Comm += amt;
              } else if (type.includes("ไม่มีบัญชี")) {
                  todayGuestUsersSet.add(buyerIdentifier);
                  statsData.guestSales += salesAmt;
                  statsData.guestComm += amt;
              } else if (type.includes("ชั้นที่")) { 
                  todayTier4PlusUsersSet.add(buyerIdentifier);
                  statsData.t4PlusSales += salesAmt;
                  statsData.t4PlusComm += amt;
              }
          }
      }

      history.push({
        date: data[i][0],
        buyer: type === "ถอนรายได้" ? "-" : buyerIdentifier.substring(0, 4) + "***", 
        type: type,
        amount: amt
      });
    }
  }
  
  return jsonResponse({
    status: "success",
    stats: {
      available: Number(availableEarnings.toFixed(2)),
      todaySales: Number(todayTotalSales.toFixed(2)),
      todayComm: Number(todayTotalComm.toFixed(2)),
      yestComm: Number(yesterdayTotalComm.toFixed(2)),
      totalMembers: allTimeUsersSet.size,
      
      uniqueNew: todayNewUsersSet.size,
      uniqueOld: todayOldUsersSet.size,
      uniqueTier2: todayTier2UsersSet.size,
      uniqueTier3: todayTier3UsersSet.size,
      uniqueTier4Plus: todayTier4PlusUsersSet.size,
      uniqueGuest: todayGuestUsersSet.size,
      uniqueDownline: (todayTier2UsersSet.size + todayTier3UsersSet.size + todayTier4PlusUsersSet.size),
      
      tables: statsData
    },
    history: history
  });
}

function handleTransferAffiliateCredit(payload, config) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var affSheet = ss.getSheetByName(SHEET_AFFILIATE);
  var affData = affSheet.getDataRange().getValues();
  var uSheet = ss.getSheetByName(SHEET_USERS);
  var uData = uSheet.getDataRange().getValues();
  
  var uid = payload.uid;
  var withdrawAmount = parseFloat(payload.amount);
  
  if(isNaN(withdrawAmount) || withdrawAmount < 100) {
      return jsonResponse({ status: "error", message: "ขั้นต่ำในการทำรายการคือ 100 บาท" });
  }
  
  var availableBalance = 0;
  for (var i = 1; i < affData.length; i++) {
    if (affData[i][1] === uid) {
      var type = String(affData[i][3]);
      var amt = parseFloat(String(affData[i][5]).replace(/,/g, '')) || 0;
      if (type === "ถอนรายได้" || String(affData[i][6]) === "ได้รับแล้ว" || String(affData[i][6]) === "รอย้ายเข้าเป๋า") {
         availableBalance += amt;
      }
    }
  }
  
  availableBalance = Number(availableBalance.toFixed(2));
  
  if (withdrawAmount > availableBalance) {
      return jsonResponse({ status: "error", message: "ยอดเงินไม่เพียงพอ (ยอดที่ถอนได้: " + availableBalance.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ")" });
  }
  
  var rowIndex = -1;
  var currentBalance = 0;
  for (var u = 1; u < uData.length; u++) {
    if (uData[u][2] === uid) {
      rowIndex = u + 1;
      currentBalance = parseFloat(uData[u][10]) || 0;
      break;
    }
  }
  
  if (rowIndex > -1) {
    var newBalance = currentBalance + withdrawAmount;
    uSheet.getRange(rowIndex, 11).setValue(newBalance);
    
    var timestamp = Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy | HH:mm:ss");
    affSheet.appendRow([timestamp, uid, "-", "ถอนรายได้", 0, -withdrawAmount, "สำเร็จ"]);
    
    var txSheet = ss.getSheetByName(SHEET_TRANSACTIONS);
    var txTimestamp = Utilities.formatDate(new Date(), "GMT+7", "dd-MM-yyyy | HH:mm น.");
    txSheet.appendRow([txTimestamp, uid, payload.fname, payload.email, "'" + payload.phone, "ปรับเครดิต (รับคอมมิชชั่น Aff)", withdrawAmount, "สำเร็จ", "ระบบ Affiliate"]);
    
    var formattedAmount = Number(withdrawAmount).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    return jsonResponse({ status: "success", message: "ถอนรายได้ " + formattedAmount + " บาท เข้ากระเป๋าหลักเรียบร้อยแล้ว", newBalance: newBalance });
  } else {
    return jsonResponse({ status: "error", message: "ไม่พบผู้ใช้งาน" });
  }
}

// -------------------------------------------------------------
//                    ADMIN BACKEND LOGIC
// -------------------------------------------------------------

function handleAdminLogin(payload, config) {
  var adminEmail = String(config.AdminEmail).trim();
  var adminPhone = String(config.AdminPhone).replace(/'/g, "").replace(/-/g, "").trim();
  var inputEmail = String(payload.email).trim();
  var inputPhone = String(payload.phone).replace(/'/g, "").replace(/-/g, "").trim();

  if (inputEmail === adminEmail && inputPhone === adminPhone) {
    return jsonResponse({ status: "success", message: "เข้าสู่ระบบสำเร็จ" });
  } else {
    return jsonResponse({ status: "error", message: "อีเมลหรือเบอร์โทรศัพท์ไม่ถูกต้อง" });
  }
}

function getSheetNameByKey(key) {
    if(key === 'users') return SHEET_USERS;
    if(key === 'orders') return SHEET_ORDERS;
    if(key === 'booking') return SHEET_BOOKING;
    if(key === 'products') return SHEET_PRODUCTS;
    if(key === 'settings') return SHEET_SETTINGS;
    if(key === 'deposits') return SHEET_TRANSACTIONS;
    if(key === 'withdraws') return SHEET_TRANSACTIONS;
    if(key === 'options') return SHEET_OPTIONS;
    if(key === 'affiliate') return SHEET_AFFILIATE;
    return null;
}

function handleAdminGetData(payload) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var data = {};
  var sheets = [
    { key: 'users', name: SHEET_USERS },
    { key: 'orders', name: SHEET_ORDERS },
    { key: 'booking', name: SHEET_BOOKING },
    { key: 'products', name: SHEET_PRODUCTS },
    { key: 'settings', name: SHEET_SETTINGS },
    { key: 'options', name: SHEET_OPTIONS },
    { key: 'affiliate', name: SHEET_AFFILIATE }
  ];
  
  sheets.forEach(function(sConfig) {
    var sheet = ss.getSheetByName(sConfig.name);
    if(sheet) {
        var values = sheet.getDataRange().getValues();
        var arr = [];
        for(var i=1; i<values.length; i++) {
            var rowData = values[i];
            if (sConfig.key === 'booking' || sConfig.key === 'orders') {
                rowData[0] = formatThaiDateTime(rowData[0]);
            } else if (sConfig.key === 'affiliate') {
                while(rowData.length < 7) rowData.push("");
            }
            arr.push({ row: i+1, cols: rowData });
        }
        data[sConfig.key] = arr;
    } else {
        data[sConfig.key] = [];
    }
  });

  var txSheet = ss.getSheetByName(SHEET_TRANSACTIONS);
  var deposits = [];
  var withdraws = [];
  if(txSheet) {
      var txVals = txSheet.getDataRange().getValues();
      for(var j=1; j<txVals.length; j++) {
          var type = String(txVals[j][5]);
          var rowData = txVals[j];
          rowData[0] = formatThaiDateTime(rowData[0]);
          
          if(type.indexOf("ฝากเงิน") > -1) {
              deposits.push({ row: j+1, cols: rowData });
          } else if(type.indexOf("ถอนเงิน") > -1) {
              withdraws.push({ row: j+1, cols: rowData });
          }
      }
  }
  data['deposits'] = deposits;
  data['withdraws'] = withdraws;
  
  return jsonResponse({status: "success", data: data});
}

function handleAdminUpdateRow(payload) {
  var sheetName = getSheetNameByKey(payload.sheet);
  if(!sheetName) return jsonResponse({status: "error", message: "Invalid sheet"});
  
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(sheetName);
  var updates = payload.data; 
  
  for (var col in updates) {
      if (updates.hasOwnProperty(col)) {
          var colIndex = parseInt(col) + 1; 
          var val = updates[col];
          
          if (typeof val === 'string' && val.startsWith('0') && !isNaN(val.replace(/-/g, '')) && val.length >= 9) {
              val = "'" + val;
          } else if (payload.sheet === 'users' && colIndex === 10) { 
              val = "'" + val;
          } else if (payload.sheet === 'settings' && (colIndex === 2) && typeof val === 'string' && val.startsWith('0') && !isNaN(val.replace(/-/g, ''))) {
              val = "'" + val;
          }

          if (payload.sheet === 'deposits' && colIndex === 8 && val === 'สำเร็จ') {
             var currentStatus = sheet.getRange(payload.row, colIndex).getValue();
             if (currentStatus !== 'สำเร็จ') {
                 var email = sheet.getRange(payload.row, 4).getValue(); 
                 var amount = parseFloat(sheet.getRange(payload.row, 7).getValue()); 
                 
                 var uSheet = ss.getSheetByName(SHEET_USERS);
                 var uData = uSheet.getDataRange().getValues();
                 for(var u=1; u<uData.length; u++) {
                     if(uData[u][5] === email) {
                         var curBal = parseFloat(uData[u][10]) || 0;
                         uSheet.getRange(u+1, 11).setValue(curBal + amount);
                         break;
                     }
                 }
             }
          }
          
          if (payload.sheet === 'withdraws' && colIndex === 8 && String(val) === 'ยกเลิก') {
             var currentStatusWd = String(sheet.getRange(payload.row, colIndex).getValue());
             if (currentStatusWd !== 'ยกเลิก') { 
                 var emailWd = sheet.getRange(payload.row, 4).getValue(); 
                 var amountWd = parseFloat(sheet.getRange(payload.row, 7).getValue()); 
                 
                 var uSheetWd = ss.getSheetByName(SHEET_USERS);
                 var uDataWd = uSheetWd.getDataRange().getValues();
                 for(var uw=1; uw<uDataWd.length; uw++) {
                     if(uDataWd[uw][5] === emailWd) {
                         var curBalWd = parseFloat(uDataWd[uw][10]) || 0;
                         uSheetWd.getRange(uw+1, 11).setValue(curBalWd + amountWd);
                         break;
                     }
                 }
             }
          }
          
          sheet.getRange(payload.row, colIndex).setValue(val);
      }
  }
  return jsonResponse({status: "success"});
}

function handleAdminDeleteRow(payload) {
  var sheetName = getSheetNameByKey(payload.sheet);
  if(!sheetName) return jsonResponse({status: "error", message: "Invalid sheet"});
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(sheetName);
  sheet.deleteRow(payload.row);
  return jsonResponse({status: "success"});
}

function handleAdminAddRow(payload) {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var data = payload.data;
    
    if (payload.sheet === 'products') {
        var sheet = ss.getSheetByName(SHEET_PRODUCTS);
        sheet.appendRow([data[0], data[1], data[2], data[3], parseFloat(data[4]) || 0, data[5]||"", data[6]||"", data[7]||"", parseInt(data[8]) || 0]);
        return jsonResponse({status: "success"});
    } else if (payload.sheet === 'options') {
        var sheet = ss.getSheetByName(SHEET_OPTIONS);
        // รหัสสินค้า, ชื่อตัวเลือก, ราคา, ลิงก์ไฟล์, ลิงก์คู่มือ
        sheet.appendRow([data[0], data[1], parseFloat(data[2]) || 0, data[3]||"", data[4]||""]);
        return jsonResponse({status: "success"});
    } else if (payload.sheet === 'users') {
        var sheet = ss.getSheetByName(SHEET_USERS);
        var d = new Date();
        var dateStr = Utilities.formatDate(d, "GMT+7", "dd-MM-yyyy");
        var timeStr = Utilities.formatDate(d, "GMT+7", "HH:mm");
        var newUid = "U" + Math.floor(Date.now() / 1000);
        var phone = data[3] ? "'" + data[3].trim() : "''";
        sheet.appendRow([dateStr, timeStr, newUid, data[0], data[1], data[2], phone, data[4], "", "", 0]);
        return jsonResponse({status: "success"});
    }
    return jsonResponse({status: "error", message: "Unsupported sheet for add"});
}

function handleAdminCallQueue(payload, config) {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var bSheet = ss.getSheetByName(SHEET_BOOKING);
    bSheet.getRange(payload.row, 15).setValue("เข้ารับบริการแล้ว");
    
    var queueNo = bSheet.getRange(payload.row, 12).getValue();
    var topic = bSheet.getRange(payload.row, 8).getValue();
    
    var htmlBody = `
    <div style="font-family: 'Tahoma', sans-serif; color: #333; line-height: 1.6;">
      <h2 style="color: #665DFF;">ถึงเวลาเข้ารับบริการแล้ว</h2>
      <p>เรียน ผู้ใช้บริการ</p>
      <p>คิวหมายเลข <b>${queueNo}</b> (หัวข้อ: ${topic}) ของคุณ ถึงคิวเข้ารับบริการแล้ว</p>
      <p>กรุณาเตรียมตัวและแจ้งพนักงานค่ะ</p>
      <p>ขอแสดงความนับถือ<br>${config.SiteName}</p>
    </div>
    `;
    try { MailApp.sendEmail({to: payload.email, subject: "แจ้งเตือนเรียกคิว - " + config.SiteName, htmlBody: htmlBody}); } catch(e){}
    return jsonResponse({status: "success"});
}

function handleAdminBroadcast(payload, config) {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var uSheet = ss.getSheetByName(SHEET_USERS);
    var uData = uSheet.getDataRange().getValues();
    
    var emails = [];
    for(var i=1; i<uData.length; i++) {
        var email = String(uData[i][5]).trim();
        if(email && email.indexOf('@') > -1) { emails.push(email); }
    }
    
    if(emails.length === 0) return jsonResponse({status: "error", message: "ไม่พบอีเมลผู้ใช้ในระบบ"});
    
    var imgTag = payload.imgUrl ? `<div style="text-align:center; margin-bottom: 20px;"><img src="${payload.imgUrl}" style="max-width:100%; border-radius: 8px;"></div>` : "";
    var msgHtml = payload.message.replace(/\n/g, '<br>');
    
    var htmlBody = `
    <div style="font-family: 'Tahoma', sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      ${imgTag}
      <div style="font-size: 16px; color: #444;">${msgHtml}</div>
      <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 12px; color: #888; text-align: center;">
        อีเมลฉบับนี้ส่งจากระบบอัตโนมัติของ ${config.SiteName}
      </div>
    </div>
    `;
    
    var chunkSize = 50; 
    for(var j=0; j<emails.length; j+=chunkSize) {
        var chunk = emails.slice(j, j+chunkSize);
        try {
            MailApp.sendEmail({
                to: config.AdminEmail, bcc: chunk.join(','), subject: payload.subject, htmlBody: htmlBody
            });
        } catch(e) { console.error("Broadcast Error:", e); }
    }
    return jsonResponse({status: "success"});
}

// -------------------------------------------------------------
//                    USER FRONTEND LOGIC
// -------------------------------------------------------------

function handleInit(config) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var pData = ss.getSheetByName(SHEET_PRODUCTS).getDataRange().getValues();
  var products = [];
  var categoriesSet = new Set();
  for (var i = 1; i < pData.length; i++) {
    if(pData[i][1]) categoriesSet.add(pData[i][1]); 
    products.push({ id: String(pData[i][0]), category: pData[i][1], name: pData[i][2], desc: pData[i][3], price: pData[i][4], image: pData[i][5], stock: parseInt(pData[i][8]) || 0 });
  }
  var oData = ss.getSheetByName(SHEET_OPTIONS).getDataRange().getValues();
  var options = [];
  for (var j = 1; j < oData.length; j++) {
    // ส่ง productId กลับไปให้หน้าเว็บเพื่อใช้กรองตัวเลือก
    options.push({ productId: String(oData[j][0]), id: String(oData[j][0])+"-"+String(oData[j][1]), name: oData[j][1], price: parseFloat(oData[j][2]) || 0 });
  }
  return jsonResponse({ status: "success", settings: config, categories: Array.from(categoriesSet), products: products, options: options });
}

function handleGetUserData(data) {
  var uSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_USERS);
  var uData = uSheet.getDataRange().getValues();
  for (var i = 1; i < uData.length; i++) {
    if (uData[i][5] === data.email || uData[i][6] === data.phone) {
      var currentBalance = parseFloat(uData[i][10]) || 0; 
      var bankName = uData[i][8] ? String(uData[i][8]) : ""; 
      var bankAcc = uData[i][9] ? String(uData[i][9]) : ""; 

      var userObj = { 
        regDate: uData[i][0] + " / " + uData[i][1], 
        uid: uData[i][2],
        fname: uData[i][3], 
        lname: uData[i][4], 
        email: uData[i][5], 
        phone: uData[i][6], 
        balance: currentBalance,
        bankName: bankName, 
        bankAcc: bankAcc
      };
      return jsonResponse({ status: "success", user: userObj });
    }
  }
  return jsonResponse({ status: "error", message: "ไม่พบข้อมูลผู้ใช้" });
}

function handleRegister(data, config) {
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_USERS);
  var records = sheet.getDataRange().getValues();
  for (var i = 1; i < records.length; i++) {
    if (records[i][5] === data.email || records[i][6] === data.phone) {
      notifyAdmin(config, "การสมัครสมาชิก ไม่สำเร็จ (ข้อมูลซ้ำ)", `<p><b>ความพยายามสมัครด้วย:</b></p><p>ชื่อ: ${data.fname} ${data.lname}</p><p>อีเมล: ${data.email}</p><p>เบอร์โทร: ${data.phone}</p>`, "error");
      return jsonResponse({ status: "error", message: "อีเมล์หรือเบอร์โทรศัพท์นี้ถูกใช้งานแล้ว" });
    }
  }

  var d = new Date();
  var dateStr = Utilities.formatDate(d, "GMT+7", "dd-MM-yyyy");
  var timeStr = Utilities.formatDate(d, "GMT+7", "HH:mm");
  var fullTimestamp = dateStr + " / " + timeStr;
  var newUid = "U" + Math.floor(Date.now() / 1000);
  
  sheet.appendRow([dateStr, timeStr, newUid, data.fname, data.lname, data.email, "'" + data.phone, data.password, "", "", 0]);
  
  if (data.inviterUID) {
    var netSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NETWORK);
    if(netSheet) netSheet.appendRow([data.email, "'" + data.phone, data.inviterUID]);
    
    var affSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_AFFILIATE);
    if(affSheet) {
        var affTimestamp = Utilities.formatDate(d, "GMT+7", "dd/MM/yyyy | HH:mm:ss");
        affSheet.appendRow([affTimestamp, data.inviterUID, data.email || data.phone, "เพื่อนใหม่ (สมัครบัญชี)", 0, 0, "เข้าสู่ระบบแล้ว"]);
    }
  }
  
  var userObj = { uid: newUid, fname: data.fname, lname: data.lname, email: data.email, phone: data.phone, balance: 0, bankName: "", bankAcc: "", regDate: fullTimestamp };
  sendSystemEmail(data.email, "แจ้งผลการทำรายการ", userObj, config, fullTimestamp, "-", "สมัครสมาชิก สำเร็จ");
  notifyAdmin(config, "รายการสมัครสมาชิก สำเร็จ", `<p><b>ID User:</b> ${newUid}</p><p><b>ชื่อ:</b> ${data.fname} ${data.lname}</p><p><b>อีเมล์:</b> ${data.email}</p><p><b>เบอร์:</b> ${data.phone}</p><p><b>เวลา:</b> ${fullTimestamp}</p>`, "success");

  return jsonResponse({ status: "success", message: "สมัครสมาชิกสำเร็จ", user: userObj });
}

function handleLogin(data, config) {
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_USERS);
  var records = sheet.getDataRange().getValues();

  for (var i = 1; i < records.length; i++) {
    if ((records[i][5] === data.username || records[i][6] === data.username) && (records[i][7] === data.password || records[i][7] === Number(data.password))) {
      var currentBalance = parseFloat(records[i][10]) || 0;
      var bankName = records[i][8] ? String(records[i][8]) : "";
      var bankAcc = records[i][9] ? String(records[i][9]) : "";

      var userObj = { regDate: records[i][0] + " / " + records[i][1], uid: records[i][2], fname: records[i][3], lname: records[i][4], email: records[i][5], phone: records[i][6], balance: currentBalance, bankName: bankName, bankAcc: bankAcc };
      var timestamp = Utilities.formatDate(new Date(), "GMT+7", "dd-MM-yyyy | HH:mm น."); 
      
      sendSystemEmail(userObj.email, "แจ้งผลการทำรายการ", userObj, config, timestamp, "-", "เข้าสู่ระบบ สำเร็จ");
      notifyAdmin(config, "รายการเข้าสู่ระบบ สำเร็จ", `<p><b>ผู้ใช้:</b> ${userObj.fname} ${userObj.lname} (${userObj.phone})</p><p><b>เวลา:</b> ${timestamp}</p>`, "info");
      
      return jsonResponse({ status: "success", user: userObj });
    }
  }
  
  var ts = Utilities.formatDate(new Date(), "GMT+7", "dd-MM-yyyy | HH:mm น.");
  notifyAdmin(config, "รายการเข้าสู่ระบบ ไม่สำเร็จ", `<p>มีความพยายามเข้าสู่ระบบด้วยชื่อผู้ใช้: <b>${data.username}</b></p><p>เวลา: ${ts}</p>`, "error");
  return jsonResponse({ status: "error", message: "อีเมล์/เบอร์โทรศัพท์ หรือรหัสผ่านไม่ถูกต้อง" });
}

function handleLogout(data, config) {
  var timestamp = Utilities.formatDate(new Date(), "GMT+7", "dd-MM-yyyy | HH:mm น.");
  var userObj = { uid: "-", fname: "ผู้ใช้งาน", lname: "", email: data.email, phone: data.phone };
  sendSystemEmail(data.email, "แจ้งผลการทำรายการ", userObj, config, timestamp, "-", "ออกจากระบบ สำเร็จ");
  notifyAdmin(config, "รายการออกจากระบบ สำเร็จ", `<p><b>ผู้ใช้:</b> ${data.phone} (${data.email})</p><p><b>เวลา:</b> ${timestamp}</p>`, "info");
  return jsonResponse({ status: "success" });
}

function handleSendOtp(data, config) {
  var email = data.email.trim();
  var userSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_USERS);
  var otpSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_OTP);
  
  var records = userSheet.getDataRange().getValues();
  var found = false; var userFname = "";
  
  for(var i=1; i<records.length; i++) {
    if(records[i][5] === email) { found = true; userFname = records[i][3]; break; }
  }
  if(!found) return jsonResponse({status: "error", message: "ไม่พบอีเมล์นี้ในระบบ"});

  var otp = Math.floor(100000 + Math.random() * 900000).toString();
  var timestamp = Utilities.formatDate(new Date(), "GMT+7", "dd-MM-yyyy | HH:mm:ss น.");
  var timeMs = new Date().getTime(); 
  
  otpSheet.appendRow([timestamp, email, otp, "รอใช้งาน", timeMs]);

  var htmlBody = `
    <div style="font-family: 'Tahoma', sans-serif; color: #333; line-height: 1.6;">
      <h2 style="color: #e43a3d;">รหัส OTP สำหรับรีเซ็ตรหัสผ่าน</h2>
      <p>เรียน คุณ ${userFname}</p>
      <p>รหัส OTP ของคุณคือ: <b style="font-size:24px; color:#e43a3d; letter-spacing: 2px;">${otp}</b></p>
      <p style="color:red; font-size:12px;">* รหัสนี้มีอายุการใช้งาน 5 นาที โปรดใช้รหัสล่าสุดที่ได้รับ</p>
      <p>ขอแสดงความนับถือ<br>${config.SiteName}</p>
    </div>
  `;
  try { MailApp.sendEmail({to: email, subject: "รหัส OTP สำหรับรีเซ็ตรหัสผ่าน", htmlBody: htmlBody}); } catch(e){}
  return jsonResponse({status: "success", message: "ระบบได้ส่งรหัส OTP ไปที่อีเมล์ของคุณแล้ว (รหัสมีอายุ 5 นาที)"});
}

function handleResetPassword(data, config) {
  var email = data.email.trim();
  var otp = data.otp.trim();
  var newPass = data.newPass.trim();

  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var otpSheet = ss.getSheetByName(SHEET_OTP);
  var otpData = otpSheet.getDataRange().getValues();
  
  var isValid = false;
  var otpRowIndex = -1;
  
  for(var j = otpData.length - 1; j >= 1; j--) {
      if(otpData[j][1] === email && otpData[j][2].toString() === otp && otpData[j][3] === "รอใช้งาน") {
          var createdTimeMs = parseFloat(otpData[j][4]);
          if(!isNaN(createdTimeMs)) {
              var now = new Date().getTime();
              if (now - createdTimeMs > 5 * 60 * 1000) {
                  otpSheet.getRange(j + 1, 4).setValue("หมดเวลา");
                  return jsonResponse({status: "error", message: "รหัส OTP หมดอายุ กรุณาส่งรหัสยืนยันอีกครั้ง"});
              }
          }
          isValid = true;
          otpRowIndex = j + 1;
          break;
      }
  }

  if(!isValid) return jsonResponse({status: "error", message: "รหัส OTP ไม่ถูกต้อง หรือหมดอายุ/ถูกใช้งานไปแล้ว"});

  otpSheet.getRange(otpRowIndex, 4).setValue("ใช้งานแล้ว");

  var sheet = ss.getSheetByName(SHEET_USERS);
  var records = sheet.getDataRange().getValues();
  for(var i=1; i<records.length; i++) {
    if(records[i][5] === email) {
      sheet.getRange(i+1, 8).setValue(newPass); 
      var timestamp = Utilities.formatDate(new Date(), "GMT+7", "dd-MM-yyyy | HH:mm น.");
      var userObj = { uid: records[i][2], fname: records[i][3], lname: records[i][4], email: email, phone: records[i][6] };
      sendSystemEmail(email, "แจ้งผลการทำรายการ", userObj, config, timestamp, "-", "เปลี่ยนรหัสผ่าน สำเร็จ");
      return jsonResponse({status: "success", message: "เปลี่ยนรหัสผ่านใหม่เรียบร้อยแล้ว กรุณาลงชื่อเข้าใช้"});
    }
  }
  return jsonResponse({status: "error", message: "เกิดข้อผิดพลาด ไม่พบข้อมูลบัญชี"});
}

function handleChangePassword(data, config) {
  var email = data.email.trim();
  var oldPass = data.oldPass.trim();
  var newPass = data.newPass.trim();
  
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_USERS);
  var records = sheet.getDataRange().getValues();
  
  for(var i=1; i<records.length; i++) {
    if(records[i][5] === email) {
      if(String(records[i][7]) === oldPass) {
        sheet.getRange(i+1, 8).setValue(newPass);
        var timestamp = Utilities.formatDate(new Date(), "GMT+7", "dd-MM-yyyy | HH:mm น.");
        var userObj = { uid: records[i][2], fname: records[i][3], lname: records[i][4], email: email, phone: records[i][6] };
        sendSystemEmail(email, "แจ้งผลการทำรายการ", userObj, config, timestamp, "-", "แก้ไขรหัสผ่าน สำเร็จ");
        return jsonResponse({status: "success", message: "เปลี่ยนรหัสผ่านสำเร็จ"});
      } else {
        return jsonResponse({status: "error", message: "รหัสผ่านปัจจุบันไม่ถูกต้อง"});
      }
    }
  }
  return jsonResponse({status: "error", message: "ไม่พบข้อมูลบัญชี"});
}

function handleCheckDiscountCode(data) {
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_ORDERS);
  var oData = sheet.getDataRange().getValues();
  var appliedCode = data.code.trim().toUpperCase();
  var bName = data.name.trim();
  var bPhone = data.phone.trim();

  for (var k = 1; k < oData.length; k++) {
    var rowStr = String(oData[k][4] || ""); 
    if (rowStr.indexOf("[Code: " + appliedCode + "]") > -1) {
      var orderName = String(oData[k][2] || "").trim();
      var orderPhone = String(oData[k][3] || "").replace(/'/g, "").trim();
      if (orderName === bName || orderPhone === bPhone) {
        var rawDate = oData[k][0];
        var uDateStr = formatThaiDateTime(rawDate); 
        var usedRef = String(oData[k][1] || "").replace(/'/g, "");
        return jsonResponse({ status: "error", message: `โค้ดนี้ถูกใช้แล้ว\nเมื่อวันที่ ${uDateStr}\nคำสั่งซื้อเลขที่ ${usedRef}` });
      }
    }
  }
  return jsonResponse({status: "success"});
}

function handleAddBankAccount(data, config) {
  var uSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_USERS);
  var uData = uSheet.getDataRange().getValues();
  var rowIndex = -1;
  var cleanInputBankAcc = data.bankAcc.replace(/[\s-]/g, '');

  for (var j = 1; j < uData.length; j++) {
      if (uData[j][5] !== data.email && uData[j][6] !== data.phone) { 
          var existingAcc = String(uData[j][9] || "").replace(/['\s-]/g, '');
          if (existingAcc !== "" && existingAcc === cleanInputBankAcc) {
              return jsonResponse({ status: "error", message: "เลขที่บัญชีนี้ถูกใช้งานโดยผู้ใช้อื่นในระบบแล้ว ไม่สามารถใช้ซ้ำได้" });
          }
      }
  }

  for (var i = 1; i < uData.length; i++) {
    if (uData[i][5] === data.email || uData[i][6] === data.phone) { rowIndex = i + 1; break; }
  }

  if (rowIndex > -1) {
    uSheet.getRange(rowIndex, 9).setValue(data.bankName);
    uSheet.getRange(rowIndex, 10).setValue("'" + data.bankAcc); 
    return jsonResponse({ status: "success", message: "บันทึกบัญชีสำเร็จ", bankName: data.bankName, bankAcc: data.bankAcc });
  } else {
    return jsonResponse({ status: "error", message: "ไม่พบข้อมูลผู้ใช้ในระบบ" });
  }
}

function handleWithdraw(data, config) {
  var phone = data.phone; var email = data.email; var fullname = data.fullname;
  var amount = parseFloat(data.amount);
  var timestamp = Utilities.formatDate(new Date(), "GMT+7", "dd-MM-yyyy | HH:mm น.");

  var txSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_TRANSACTIONS);
  var uSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_USERS);
  var uData = uSheet.getDataRange().getValues();
  var userId = "GUEST"; var rowIndex = -1; var currentBalance = 0; var bankName = ""; var bankAcc = "";

  for (var i = 1; i < uData.length; i++) {
    if (uData[i][5] === email || uData[i][6] === phone) {
      userId = uData[i][2]; rowIndex = i + 1; currentBalance = parseFloat(uData[i][10]) || 0;
      bankName = uData[i][8]; bankAcc = uData[i][9]; break;
    }
  }
  var userObj = { uid: userId, fname: fullname, lname: '', email: email, phone: phone };

  if (rowIndex === -1) return jsonResponse({ status: "error", message: "ไม่พบผู้ใช้งาน" });
  if (amount < 100) {
    txSheet.appendRow([timestamp, userId, fullname, email, "'" + phone, "ถอนเงิน", amount, "ไม่สำเร็จ", "ยอดถอนต่ำกว่ากำหนด"]);
    sendSystemEmail(email, "แจ้งผลการทำรายการ", userObj, config, timestamp, "WD-FAIL", `ถอนเงิน ไม่สำเร็จ (ยอดขั้นต่ำ 100 บาท)`);
    return jsonResponse({ status: "error", message: "ขั้นต่ำในการถอน 100 บาท" });
  }
  if (currentBalance < amount) {
    txSheet.appendRow([timestamp, userId, fullname, email, "'" + phone, "ถอนเงิน", amount, "ไม่สำเร็จ", "ยอดเงินคงเหลือ กับจำนวนถอน ไม่สอดคล้องกัน"]);
    sendSystemEmail(email, "แจ้งผลการทำรายการ", userObj, config, timestamp, "WD-FAIL", `ถอนเงิน ไม่สำเร็จ (ยอดเงินในระบบไม่เพียงพอ)`);
    return jsonResponse({ status: "error", message: "ยอดเงินคงเหลือ กับจำนวนถอน ไม่สอดคล้องกัน" });
  }

  var newBalance = currentBalance - amount;
  uSheet.getRange(rowIndex, 11).setValue(newBalance);
  txSheet.appendRow([timestamp, userId, fullname, email, "'" + phone, "ถอนเงิน", amount, "รอดำเนินการ", `ไปยัง: ${bankName} (${bankAcc})`]);

  var msgUser = `ถอนเงิน สำเร็จ (รอดำเนินการ)<br>บัญชีปลายทาง: ${bankName} เลขที่ ${bankAcc}<br>จำนวนเงิน ฿${amount.toFixed(2)}<br>ระบบจะทำรายการไปยังบัญชีที่แจ้งเข้ามาภายใน 24 ชั่วโมง`;
  sendSystemEmail(email, "แจ้งผลการทำรายการ", userObj, config, timestamp, "TX-WD", msgUser);
  notifyAdmin(config, "รายการแจ้งถอนเครดิต สำเร็จ (รอดำเนินการ)", `<p><b>ผู้ใช้:</b> ${fullname} (${phone})</p><p><b>ยอดขอถอน:</b> <span style="color:red;font-size:18px;font-weight:bold;">฿${amount.toFixed(2)}</span></p><p><b>ธนาคาร:</b> ${bankName}</p><p><b>เลขบัญชี:</b> ${bankAcc}</p><p><b>เครดิตคงเหลือ:</b> ฿${newBalance.toFixed(2)}</p><p><i>กรุณาโอนเงินและอัปเดตสถานะในชีต Transactions</i></p>`, "warning");

  return jsonResponse({ status: "success", message: "ระบบจะทำรายการไปยังบัญชีที่แจ้งเข้ามาภายใน 24 ชั่วโมง", newBalance: newBalance });
}

function verifySlipWithSlipOK(blob, expectedPrice, branchId, apiKey) {
  var url = 'https://api.slipok.com/api/line/apikey/' + branchId;
  var formData = { 'files': blob, 'log': 'true' };
  var options = { 'method': 'post', 'headers': { 'x-authorization': apiKey }, 'payload': formData, 'muteHttpExceptions': true };
  
  try {
    var response = UrlFetchApp.fetch(url, options);
    var jsonResponse = JSON.parse(response.getContentText());
    
    if (response.getResponseCode() === 200 && jsonResponse.success === true) {
      var actual = parseFloat(jsonResponse.data.amount);
      if (actual >= expectedPrice - 0.01) { return { isValid: true, actualAmount: actual }; } 
      else { return { isValid: false, isAmountMismatch: true, actualAmount: actual }; }
    } else {
      var msg = jsonResponse.message || ""; var code = jsonResponse.code || 0;
      if (code === 1009 || msg.toLowerCase().indexOf("duplicate") > -1 || msg.indexOf("ซ้ำ") > -1) { return { isValid: false, isDuplicate: true }; }
      if (code === 1004 || code === 1005 || msg.indexOf("QR") > -1 || msg.indexOf("ไม่พบ") > -1 || msg.indexOf("format") > -1) { return { isValid: false, isNoQR: true }; }
      return { isValid: false, isFake: true, message: msg }; 
    }
  } catch (e) { return { isValid: false, isFake: true, message: 'ข้อผิดพลาด API' }; }
}

function handleSubmitOrder(data, config) {
  var buyname = data.buyname; var buyemail = data.buyemail; var phone = data.phone;
  var cart = data.cart; var discount = parseFloat(data.discount) || 0; var vat = parseFloat(data.vat) || 0;
  var expectedPrice = parseFloat(data.expectedPrice); 
  var creditUsed = parseFloat(data.creditUsed) || 0; 
  var paymentMethod = data.paymentMethod || 'qr'; 
  var base64 = data.base64; var type = data.type; var name = data.name; 
  var appliedCode = data.discountCode || "";

  var pSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_PRODUCTS);
  var pData = pSheet.getDataRange().getValues();

  // 1. ตรวจสอบสต๊อกสินค้าก่อน (Pre-Check)
  for (var c = 0; c < cart.length; c++) {
    for (var p = 1; p < pData.length; p++) {
      if (pData[p][2] === cart[c].product.name) {
        var currentStock = parseInt(pData[p][8]);
        if(isNaN(currentStock)) currentStock = 0;
        
        if (currentStock < cart[c].qty) {
           return jsonResponse({ status: "error", message: "ขออภัย สินค้า '" + cart[c].product.name + "' มีสต๊อกไม่เพียงพอ (เหลือ " + currentStock + " ชิ้น)" });
        }
        break;
      }
    }
  }

  // 2. ฟังก์ชันช่วยสำหรับการหักสต๊อกเมื่อจ่ายเงินสำเร็จ
  function deductStock() {
    for (var c = 0; c < cart.length; c++) {
      for (var p = 1; p < pData.length; p++) {
        if (pData[p][2] === cart[c].product.name) {
          var currentStock = parseInt(pData[p][8]);
          if (isNaN(currentStock)) currentStock = 0;
          var newStock = currentStock - cart[c].qty;
          if (newStock < 0) newStock = 0;
          pSheet.getRange(p + 1, 9).setValue(newStock); // อัปเดตสต๊อกลงคอลัมน์ที่ 9
          break;
        }
      }
    }
  }

  var cartSummary = cart.map(function(item) {
    var optText = item.options.length > 0 ? " [" + item.options.map(function(o){return o.name}).join(",") + "]" : "";
    return item.qty + "x " + item.product.name + optText;
  }).join("\n");
  if(appliedCode) cartSummary += `\n[Code: ${appliedCode}]`; 
  if(creditUsed > 0) cartSummary += `\n[ใช้เครดิต: ฿${creditUsed}]`;

  var timestamp = Utilities.formatDate(new Date(), "GMT+7", "dd-MM-yyyy | HH:mm น.");
  var orderRef = "NX" + Utilities.formatDate(new Date(), "GMT+7", "yyMMdd") + Math.floor(Math.random() * 10000);
  
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_ORDERS);
  var uSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_USERS);
  var uData = uSheet.getDataRange().getValues();
  
  var userId = "GUEST"; var rowIndex = -1; var currentBalance = 0;
  for (var i = 1; i < uData.length; i++) {
    if (uData[i][5] === buyemail || uData[i][6] === phone) { userId = uData[i][2]; rowIndex = i + 1; currentBalance = parseFloat(uData[i][10]) || 0; break; }
  }

  var userObj = { uid: userId, fname: buyname.split(' ')[0], lname: buyname.split(' ')[1] || '', email: buyemail, phone: phone };

  if (appliedCode) {
    var oData = sheet.getDataRange().getValues();
    for (var k = 1; k < oData.length; k++) {
      var rowStr = String(oData[k][4] || ""); 
      if (rowStr.indexOf("[Code: " + appliedCode + "]") > -1) {
        var orderName = String(oData[k][2] || "").trim();
        var orderPhone = String(oData[k][3] || "").replace(/'/g, "").trim();
        if (orderName === buyname || orderPhone === phone) {
          var usedDateStr = formatThaiDateTime(oData[k][0]);
          var usedRef = String(oData[k][1] || "").replace(/'/g, "");
          return jsonResponse({ status: "error", message: `โค้ดนี้ถูกใช้แล้ว\nเมื่อวันที่ ${usedDateStr}\nคำสั่งซื้อเลขที่ ${usedRef}` });
        }
      }
    }
  }

  if (creditUsed > 0 || paymentMethod === 'credit') {
    if (rowIndex === -1) return jsonResponse({ status: "error", message: "กรุณาเข้าสู่ระบบก่อนใช้เครดิต" });
    if (currentBalance < creditUsed && paymentMethod === 'qr') return jsonResponse({ status: "error", message: "เครดิตคงเหลือไม่พอสำหรับการชำระแบบผสม" });
    if (paymentMethod === 'credit' && currentBalance < expectedPrice) return jsonResponse({ status: "error", message: "เครดิตไม่เพียงพอ" });
  }

  // --- Process Free Order ---
  if (paymentMethod === 'free' || (expectedPrice === 0 && creditUsed === 0)) {
    deductStock(); // ตัดสต๊อก
    sheet.appendRow([timestamp, "'" + orderRef, buyname, "'" + phone, cartSummary, discount, vat, 0, "-", "สำเร็จ (ฟรี)", "Free"]);
    sendSuccessOrder(cartSummary, 0, vat, discount, cart, userObj, config, timestamp, orderRef);
    notifyAdmin(config, "รายการสั่งซื้อ สำเร็จ (สินค้าฟรี)", `<p><b>ผู้ใช้:</b> ${buyname} (${phone})</p><p><b>ออเดอร์:</b> ${orderRef}</p><p><b>รายการ:</b><br>${cartSummary.replace(/\n/g, '<br>')}</p>`, "success");
    return jsonResponse({ status: "success", message: "ชำระเงินสำเร็จ ยอดชำระ 0 บาท ระบบจัดส่งสินค้าไปที่ " + buyemail, orderRef: orderRef });
  }

  // --- Process Credit Order ---
  if (paymentMethod === 'credit') {
    deductStock(); // ตัดสต๊อก
    var newBalance = currentBalance - expectedPrice;
    uSheet.getRange(rowIndex, 11).setValue(newBalance);
    
    var txSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_TRANSACTIONS);
    txSheet.appendRow([timestamp, userId, buyname, buyemail, "'" + phone, "สั่งซื้อสินค้า", expectedPrice, `สำเร็จ (Ref: ${orderRef})`, "-"]);
    sheet.appendRow([timestamp, "'" + orderRef, buyname, "'" + phone, cartSummary, discount, vat, expectedPrice, "-", "การชำระเงินถูกต้อง", "Credit"]);
    
    processAffiliateCommission(buyemail, phone, expectedPrice, false, null);

    sendSuccessOrder(cartSummary, expectedPrice, vat, discount, cart, userObj, config, timestamp, orderRef);
    notifyAdmin(config, "รายการสั่งซื้อ สำเร็จ (หักเครดิต)", `<p><b>ผู้ใช้:</b> ${buyname} (${phone})</p><p><b>ออเดอร์:</b> ${orderRef}</p><p><b>ยอดที่หัก:</b> ฿${expectedPrice}</p><p><b>เครดิตคงเหลือ:</b> ฿${newBalance.toFixed(2)}</p>`, "success");
    return jsonResponse({ status: "success", message: "ชำระเงินสำเร็จ ยอดชำระ " + expectedPrice + " บาท ระบบจัดส่งสินค้าไปที่ " + buyemail, orderRef: orderRef, newBalance: newBalance });
  }

  // --- Process QR Order ---
  if (paymentMethod === 'qr') {
    var decodedData = Utilities.base64Decode(base64);
    var blob = Utilities.newBlob(decodedData, type, name);
    var folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    var newFile = folder.createFile(blob);
    newFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    var fileLink = newFile.getUrl(); 

    var verificationResult = verifySlipWithSlipOK(blob, expectedPrice, config.SlipOkBranchId, config.SlipOkApiKey);
    
    if (verificationResult.isValid) {
      deductStock(); // ตัดสต๊อก
      
      var finalNewBalance = currentBalance;
      if (creditUsed > 0) {
        finalNewBalance = currentBalance - creditUsed;
        uSheet.getRange(rowIndex, 11).setValue(finalNewBalance);
        var txSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_TRANSACTIONS);
        txSheet.appendRow([timestamp, userId, buyname, buyemail, "'" + phone, "สั่งซื้อสินค้า (ร่วมกับ QR)", creditUsed, `สำเร็จ (Ref: ${orderRef})`, "-"]);
      }

      var totalValueRecorded = expectedPrice + creditUsed;
      sheet.appendRow([timestamp, "'" + orderRef, buyname, "'" + phone, cartSummary, discount, vat, totalValueRecorded, fileLink, "การชำระเงินถูกต้อง", "QR Code" + (creditUsed > 0 ? " + Credit" : "")]);
      
      processAffiliateCommission(buyemail, phone, totalValueRecorded, (userId === "GUEST"), data.guestInviterUID);

      sendSuccessOrder(cartSummary, totalValueRecorded, vat, discount, cart, userObj, config, timestamp, orderRef);
      notifyAdmin(config, "รายการสั่งซื้อ สำเร็จ (QR Code)", `<p><b>ผู้ใช้:</b> ${buyname} (${phone})</p><p><b>ออเดอร์:</b> ${orderRef}</p><p><b>ยอดเงิน:</b> ฿${expectedPrice}</p><p><b>ใช้เครดิตเพิ่ม:</b> ฿${creditUsed}</p><p><b>สลิป:</b> <a href="${fileLink}">ดูสลิป</a></p>`, "success");
      
      return jsonResponse({ status: "success", message: "ชำระเงินสำเร็จ ยอดสแกน " + expectedPrice + " บาท ระบบจัดส่งสินค้าไปที่ " + buyemail, orderRef: orderRef, newBalance: finalNewBalance });
    } else {
        var errorMsg = "";
        if (verificationResult.isDuplicate) errorMsg = "ชำระเงินไม่สำเร็จ รหัสชำระซ้ำกับในระบบ";
        else if (verificationResult.isNoQR) errorMsg = "ชำระเงินไม่สำเร็จ ไม่พบรหัสชำระเงินในระบบ";
        else if (verificationResult.isFake) errorMsg = "ชำระเงินไม่สำเร็จ เนื่องจากเป็นสลิปปลอม กรุณาแนบสลิปจริงจาก ธนาคารเท่านั้น";
        else if (verificationResult.isAmountMismatch) {
            var actual = verificationResult.actualAmount;
            var diff = Math.abs(expectedPrice - actual).toFixed(2);
            if (actual > expectedPrice) errorMsg = "ชำระเงินไม่สำเร็จ ยอดชำระเกิน " + diff + " บาท กรุณาติดต่อแอดมิน";
            else errorMsg = "ชำระเงินไม่สำเร็จ ยอดชำระขาดอีก " + diff + " บาท กรุณาติดต่อแอดมิน";
        } else {
            errorMsg = "ชำระเงินไม่สำเร็จ ไม่สามารถตรวจสอบสลิปได้"; 
        }
        
        var totalValueRecorded = expectedPrice + creditUsed;
        sheet.appendRow([timestamp, "'" + orderRef, buyname, "'" + phone, cartSummary, discount, vat, totalValueRecorded, fileLink, "ยกเลิก: " + errorMsg, "QR Code"]);
        sendSystemEmail(buyemail, "แจ้งผลการทำรายการ", userObj, config, timestamp, orderRef, `สั่งซื้อสินค้า ไม่สำเร็จ<br><span style="color:red;">${errorMsg}</span>`);
        notifyAdmin(config, "รายการสั่งซื้อ ไม่สำเร็จ", `<p><b>ผู้ใช้:</b> ${buyname} (${phone})</p><p><b>ออเดอร์:</b> ${orderRef}</p><p><b>สาเหตุ:</b> ${errorMsg}</p><p><b>สลิป:</b> <a href="${fileLink}">ดูสลิป</a></p>`, "error");
        
        return jsonResponse({ status: "error", message: errorMsg, orderRef: orderRef, newBalance: currentBalance });
    }
  }
}

function handleDeposit(data, config) {
  var phone = data.phone; var email = data.email; var fullname = data.fullname;
  var expectedPrice = parseFloat(data.expectedPrice);
  var base64 = data.base64; var type = data.type; var name = data.name; 

  var decodedData = Utilities.base64Decode(base64);
  var blob = Utilities.newBlob(decodedData, type, name);
  var folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
  var newFile = folder.createFile(blob);
  newFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  var fileLink = newFile.getUrl(); 

  var verificationResult = verifySlipWithSlipOK(blob, expectedPrice, config.SlipOkBranchId, config.SlipOkApiKey);
  var timestamp = Utilities.formatDate(new Date(), "GMT+7", "dd-MM-yyyy | HH:mm น.");

  var txSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_TRANSACTIONS);
  var uSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_USERS);
  var uData = uSheet.getDataRange().getValues();
  var userId = "GUEST"; var rowIndex = -1; var currentBalance = 0;

  for (var i = 1; i < uData.length; i++) {
    if (uData[i][5] === email || uData[i][6] === phone) { userId = uData[i][2]; rowIndex = i + 1; currentBalance = parseFloat(uData[i][10]) || 0; break; }
  }
  var userObj = { uid: userId, fname: fullname, lname: '', email: email, phone: phone };

  if (verificationResult.isValid) {
    var depositAmount = verificationResult.actualAmount; 
    var bonusOnly = depositAmount * 0.005; // 0.5%
    var totalCreditAdded = depositAmount + bonusOnly;
    var newBalance = currentBalance + totalCreditAdded;

    if(rowIndex > -1) { uSheet.getRange(rowIndex, 11).setValue(newBalance); } 
    txSheet.appendRow([timestamp, userId, fullname, email, "'" + phone, "ฝากเงิน", totalCreditAdded, "สำเร็จ", fileLink]);
    
    var isGuest = (userId === "GUEST");
    processAffiliateCommission(email, phone, depositAmount, isGuest, data.guestInviterUID);

    var successMsg = "เติมเงินสำเร็จ ยอดชำระ " + depositAmount + " บาท การเติมเครดิตสำเร็จ";
    sendSystemEmail(email, "แจ้งผลการทำรายการ", userObj, config, timestamp, "TX-DEP", `ฝากเงิน สำเร็จ<br>ยอดโอน: ฿${depositAmount.toFixed(2)}<br>โบนัส 0.5%: ฿${bonusOnly.toFixed(2)}<br>รวมได้รับเครดิต: <b>฿${totalCreditAdded.toFixed(2)}</b>`);
    notifyAdmin(config, "รายการเติมเครดิต สำเร็จ", `<p><b>ผู้ใช้:</b> ${fullname} (${phone})</p><p><b>ยอดโอนจริง:</b> ฿${depositAmount}</p><p><b>ยอดที่เพิ่มเข้าเครดิต:</b> ฿${totalCreditAdded.toFixed(2)}</p><p><b>สลิป:</b> <a href="${fileLink}">ดูสลิป</a></p>`, "success");
    
    return jsonResponse({ status: "success", message: successMsg, newBalance: newBalance });
  } else {
    var errorStr = "";
    if (verificationResult.isDuplicate) errorStr = "เติมเงินไม่สำเร็จ รหัสฝากเงิน ซ้ำกับในระบบ";
    else if (verificationResult.isNoQR) errorStr = "เติมเงินไม่สำเร็จ ไม่พบรหัสชำระเงินในระบบ";
    else if (verificationResult.isFake) errorStr = "เติมเงินไม่สำเร็จ เนื่องจากเป็นสลิปปลอม กรุณาแนบสลิปจริงจาก ธนาคารเท่านั้น";
    else if (verificationResult.isAmountMismatch) {
        var actual = verificationResult.actualAmount;
        var diff = Math.abs(expectedPrice - actual).toFixed(2);
        if (actual > expectedPrice) errorStr = "เติมเงินไม่สำเร็จ ยอดชำระเกิน " + diff + " บาท กรุณาติดต่อแอดมิน";
        else errorStr = "เติมเงินไม่สำเร็จ ยอดชำระขาดอีก " + diff + " บาท กรุณาติดต่อแอดมิน";
    } else { errorStr = "เติมเงินไม่สำเร็จ ไม่สามารถตรวจสอบสลิปได้"; }

    txSheet.appendRow([timestamp, userId, fullname, email, "'" + phone, "ฝากเงิน", expectedPrice, "ไม่สำเร็จ: " + errorStr, fileLink]);
    sendSystemEmail(email, "แจ้งผลการทำรายการ", userObj, config, timestamp, "TX-DEP", `ฝากเงิน ไม่สำเร็จ<br>สาเหตุ: ${errorStr}`);
    notifyAdmin(config, "รายการเติมเครดิต มีปัญหา", `<p><b>ผู้ใช้:</b> ${fullname} (${phone})</p><p><b>สาเหตุ:</b> ${errorStr}</p><p><b>ยอดที่พยายามเติม:</b> ฿${expectedPrice}</p><p><b>สลิป:</b> <a href="${fileLink}">ดูสลิป</a></p>`, "error");

    return jsonResponse({ status: "error", message: errorStr, newBalance: currentBalance });
  }
}

function handleDepositTimeout(data, config) {
    var phone = data.phone; var email = data.email; var fullname = data.fullname;
    var expectedPrice = parseFloat(data.expectedPrice);
    var timestamp = Utilities.formatDate(new Date(), "GMT+7", "dd-MM-yyyy | HH:mm น.");
    var txSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_TRANSACTIONS);
    
    var uSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_USERS);
    var uData = uSheet.getDataRange().getValues();
    var userId = "GUEST"; 
    for (var i = 1; i < uData.length; i++) {
        if (uData[i][5] === email || uData[i][6] === phone) { userId = uData[i][2]; break; }
    }
    txSheet.appendRow([timestamp, userId, fullname, email, "'" + phone, "ฝากเงิน", expectedPrice, "ยกเลิก: หมดเวลาชำระเงิน", "-"]);
    return jsonResponse({ status: "success" });
}

function handleOrderTimeout(data, config) {
    var buyname = data.buyname; var buyemail = data.buyemail; var phone = data.phone;
    var cart = data.cart; var discount = parseFloat(data.discount) || 0; var vat = parseFloat(data.vat) || 0;
    var expectedPrice = parseFloat(data.expectedPrice);
    var appliedCode = data.discountCode || "";

    var cartSummary = cart.map(function(item) {
        var optText = item.options.length > 0 ? " [" + item.options.map(function(o){return o.name}).join(",") + "]" : "";
        return item.qty + "x " + item.product.name + optText;
    }).join("\n");
    if(appliedCode) cartSummary += `\n[Code: ${appliedCode}]`; 

    var timestamp = Utilities.formatDate(new Date(), "GMT+7", "dd-MM-yyyy | HH:mm น.");
    var orderRef = "NX" + Utilities.formatDate(new Date(), "GMT+7", "yyMMdd") + Math.floor(Math.random() * 10000);
    
    var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_ORDERS);
    sheet.appendRow([timestamp, "'" + orderRef, buyname, "'" + phone, cartSummary, discount, vat, expectedPrice, "-", "ยกเลิก: หมดเวลาชำระเงิน", "QR Code"]);
    return jsonResponse({ status: "success" });
}

// -------------------------------------------------------------
//  อัปเดตระบบส่งสินค้า: แยกส่งไฟล์สินค้าหลัก และไฟล์จากตัวเลือกเสริม
// -------------------------------------------------------------
function sendSuccessOrder(cartSummary, expectedPrice, vat, discount, cart, userObj, config, timestamp, orderRef) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var pData = ss.getSheetByName(SHEET_PRODUCTS).getDataRange().getValues();
  var oData = ss.getSheetByName(SHEET_OPTIONS).getDataRange().getValues();
  
  var purchasedDetails = [];
  
  for (var i = 0; i < cart.length; i++) {
    for(var j = 1; j < pData.length; j++) {
      if(pData[j][2] === cart[i].product.name) {
        var mainPrice = parseFloat(pData[j][4]) || 0;
        var prodId = String(pData[j][0]);
        
        // 1. เพิ่มสินค้าหลักลงในอาร์เรย์ (เพื่อใช้แสดงในตารางใบเสร็จ/ดาวน์โหลด)
        purchasedDetails.push({ 
          name: pData[j][2], 
          qty: cart[i].qty, 
          productLink: pData[j][6], 
          manualLink: pData[j][7], 
          price: mainPrice,
          isOption: false
        });
        
        // 2. ค้นหา Options เสริมที่ผู้ใช้เลือก (ตรวจสอบกับชีต OptionsList เพื่อดึงลิงก์)
        if(cart[i].options && cart[i].options.length > 0) {
           cart[i].options.forEach(function(cartOpt) {
              for(var k = 1; k < oData.length; k++) {
                 // จับคู่ "รหัสสินค้า" (0) และ "ชื่อตัวเลือก" (1)
                 if(String(oData[k][0]) === prodId && String(oData[k][1]) === cartOpt.name) {
                    purchasedDetails.push({
                       name: " ↳ " + cartOpt.name, // สัญลักษณ์ลูกศรเพื่อบอกว่าเป็นตัวเลือกเสริม
                       qty: cart[i].qty,
                       productLink: oData[k][3] || "", // ไฟล์ดาวน์โหลด
                       manualLink: oData[k][4] || "",  // ไฟล์คู่มือ
                       price: parseFloat(oData[k][2]) || 0,
                       isOption: true
                    });
                    break;
                 }
              }
           });
        }
        break; // พบสินค้าแล้ว ข้ามไปชิ้นถัดไปในตะกร้า
      }
    }
  }
  
  sendOrderEmail(userObj.email, "แจ้งผลการทำรายการ (สั่งซื้อสินค้า สำเร็จ)", userObj, config, timestamp, orderRef, cartSummary, expectedPrice, vat, discount, purchasedDetails);
}

function sendOrderEmail(toEmail, subjectTitle, user, config, timestamp, orderRef, items, netTotal, vat, discount, purchasedDetails) {
  var itemsHtml = '';
  for(var i=0; i<purchasedDetails.length; i++) {
      var itemPrice = purchasedDetails[i].price || 0;
      var qtyText = purchasedDetails[i].isOption ? "" : `x ${purchasedDetails[i].qty}`;
      var textColor = purchasedDetails[i].isOption ? "#555" : "#000";
      
      itemsHtml += `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; color: ${textColor};">${purchasedDetails[i].name}</td>
            <td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd; color: ${textColor};">${itemPrice.toFixed(2)}</td>
            <td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd; color: ${textColor};">${qtyText}</td>
        </tr>
      `;
  }

  var htmlBody = `
    <div style="font-family: 'Tahoma', sans-serif; color: #333; line-height: 1.6;">
      <p>เรียน ผู้ใช้โทรศัพท์มือถือหมายเลข ${user.phone}</p>
      <p>เรื่อง แจ้งผลการทำรายการ</p>
      <p>ตามที่คุณได้ทำรายการสั่งซื้อผ่านเว็บ ${config.SiteName} โดยมีรายละเอียด ดังนี้</p>
      <ul style="list-style: none; padding-left: 20px;">
        <li><b>วันที่ทำรายการ:</b> ${timestamp}</li>
        <li><b>รหัสอ้างอิง:</b> ${orderRef}</li>
        <li><b>รหัสสมาชิก (User ID):</b> ${user.uid || '-'}</li>
        <li><b>ชื่อ-นามสกุล:</b> ${user.fname} ${user.lname}</li>
        <li><b>อีเมล:</b> ${user.email}</li>
        <li><b>หมายเลขโทรศัพท์:</b> ${user.phone}</li>
      </ul>
      <p>ระบบขอเรียนให้ทราบว่า ได้ดำเนินการสั่งซื้อสินค้าตามที่คุณได้ทำรายการไว้เรียบร้อยแล้ว ทั้งนี้ คุณสามารถตรวจสอบผลข้อมูลโปรไฟล์ได้ที่เมนู "ประวัติ" เพื่อดูรายละเอียด</p>
      
      <p><b>ลิงก์ดาวน์โหลดสินค้าของคุณ:</b></p>
      <table style='width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 20px;'>
        <tr style='background-color: #f5f5f5;'>
            <th style='padding: 10px; border: 1px solid #ddd;'>สินค้า / ไอเทมเสริม</th>
            <th style='padding: 10px; border: 1px solid #ddd;'>ไฟล์</th>
            <th style='padding: 10px; border: 1px solid #ddd;'>คู่มือ</th>
        </tr>
  `;

  for (var i = 0; i < purchasedDetails.length; i++) {
    var dlBtn = (purchasedDetails[i].productLink && purchasedDetails[i].productLink !== '-')
        ? `<a href='${purchasedDetails[i].productLink}' style='color: #fff; background-color: #e43a3d; padding: 5px 10px; text-decoration: none; border-radius: 3px; font-size: 13px;'>ดาวน์โหลด</a>`
        : `<span style='color: #999; font-size: 13px;'>ไม่มีไฟล์</span>`;
        
    var manBtn = (purchasedDetails[i].manualLink && purchasedDetails[i].manualLink !== '-')
        ? `<a href='${purchasedDetails[i].manualLink}' style='color: #000; background-color: #eee; padding: 5px 10px; text-decoration: none; border-radius: 3px; font-size: 13px;'>อ่านคู่มือ</a>`
        : `<span style='color: #999; font-size: 13px;'>ไม่มีคู่มือ</span>`;

    htmlBody += `<tr>
      <td style='padding: 10px; border: 1px solid #ddd; ${purchasedDetails[i].isOption ? "color: #555;" : "font-weight: bold;"}'>${purchasedDetails[i].name}</td>
      <td style='padding: 10px; border: 1px solid #ddd; text-align: center;'>${dlBtn}</td>
      <td style='padding: 10px; border: 1px solid #ddd; text-align: center;'>${manBtn}</td>
    </tr>`;
  }
  htmlBody += `</table>`;

  htmlBody += `
      <div style="background-color: #ffffff; padding: 15px; border: 1px solid #ccc; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3 style="color: #e43a3d; border-bottom: 2px solid #333; padding-bottom: 5px; margin-bottom: 15px;">ใบเสร็จรับเงิน (E-Receipt)</h3>
          <p style="font-size: 13px;">เลขที่ ${orderRef}</p>
          <p style="font-size: 13px; margin-bottom: 15px;">วันที่ ${timestamp}</p>
          
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <thead>
                  <tr style="border-bottom: 2px solid #333;">
                      <th style="text-align: left; padding-bottom: 5px; color: #e43a3d;">รายการ/Description</th>
                      <th style="text-align: center; padding-bottom: 5px; color: #e43a3d;">ราคาสินค้า</th>
                      <th style="text-align: center; padding-bottom: 5px; color: #e43a3d;">จำนวน</th>
                  </tr>
              </thead>
              <tbody>
                  ${itemsHtml}
              </tbody>
          </table>
          <div style="margin-top: 15px; border-top: 1px solid #333; padding-top: 10px; text-align: right; font-size: 13px;">
              <p style="margin: 2px 0;">ส่วนลด: ${discount.toFixed(2)}</p>
              <p style="margin: 2px 0;">ภาษีมูลค่าเพิ่ม (VAT 7%): ${vat.toFixed(2)}</p>
              <p style="margin: 2px 0; font-weight: bold;">ยอดชำระสุทธิ (Pay): ${netTotal.toFixed(2)}</p>
          </div>
      </div>
  `;

  htmlBody += `
      <p style="margin-top: 20px;">ติดต่อแจ้งข้อมูลเพิ่มเติมได้ที่:</p>
      <ul style="list-style: none; padding-left: 20px;">
        <li>- ${config.SiteName} Center (24 ชั่วโมง) โทร. ${config.AdminPhone}</li>
        <li>- อีเมล: ${config.AdminEmail}</li>
        ${config.LineLink ? `<li>- LINE Official Account: <a href="${config.LineLink}">คลิกที่นี่เพื่อแอด LINE</a></li>` : ''}
      </ul>
      <p>ขอแสดงความนับถือ<br>${config.SiteName} และ ${config.AdminName}</p>
    </div>
  `;
  try { MailApp.sendEmail({ to: toEmail, subject: subjectTitle, htmlBody: htmlBody }); } catch(e) {}
}

function handleGetHistory(data) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  var orderRecords = ss.getSheetByName(SHEET_ORDERS).getDataRange().getValues();
  var orderHistory = [];
  for (var i = 1; i < orderRecords.length; i++) {
    if (orderRecords[i][3] === data.phone || orderRecords[i][3] === "'" + data.phone) { 
      var d = formatThaiDateTime(orderRecords[i][0]);
      orderHistory.push({ 
        date: d, 
        ref: orderRecords[i][1], 
        items: orderRecords[i][4], 
        discount: orderRecords[i][5], 
        vat: orderRecords[i][6],       
        amount: orderRecords[i][7], 
        status: orderRecords[i][9], 
        type: 'order' 
      }); 
    }
  }
  
  var txRecords = ss.getSheetByName(SHEET_TRANSACTIONS).getDataRange().getValues();
  var txHistory = []; var wdHistory = [];
  for (var j = 1; j < txRecords.length; j++) {
    if (txRecords[j][4] === data.phone || txRecords[j][4] === "'" + data.phone) {
      var dt = formatThaiDateTime(txRecords[j][0]);
      if (txRecords[j][5] === "ฝากเงิน") { txHistory.push({ date: dt, ref: "DEP", items: txRecords[j][5], amount: txRecords[j][6], status: txRecords[j][7], type: 'deposit' }); } 
      else if (txRecords[j][5] === "ถอนเงิน") { wdHistory.push({ date: dt, ref: "WD", items: txRecords[j][8], amount: txRecords[j][6], status: txRecords[j][7], type: 'withdraw' }); }
      else if (txRecords[j][5].indexOf("ปรับเครดิต") > -1 || txRecords[j][5].indexOf("ใช้เครดิต") > -1) { txHistory.push({ date: dt, ref: "TX", items: txRecords[j][5], amount: txRecords[j][6], status: txRecords[j][7], type: 'deposit' }); }
    }
  }
  
  orderHistory.reverse(); txHistory.reverse(); wdHistory.reverse();
  
  var uData = ss.getSheetByName(SHEET_USERS).getDataRange().getValues();
  var currentBalance = 0;
  for (var k = 1; k < uData.length; k++) {
    if (uData[k][5] === data.email || uData[k][6] === data.phone || uData[k][6] === "'" + data.phone) { currentBalance = parseFloat(uData[k][10]) || 0; break; }
  }

  return jsonResponse({ status: "success", orders: orderHistory, deposits: txHistory, withdraws: wdHistory, balance: currentBalance });
}

function handleEmailStatement(data, config) {
    try {
        var base64Img = data.base64;
        var blob = Utilities.newBlob(Utilities.base64Decode(base64Img), 'image/png', `Statement_${data.phone}_${new Date().getTime()}.png`);
        
        var htmlBody = `
            <div style="font-family: 'Tahoma', sans-serif; color: #333;">
                <p>เรียน คุณ ${data.name}</p>
                <p>ระบบได้แนบไฟล์ใบเสร็จรับเงิน/Statement ของคุณเรียบร้อยแล้ว (ตรวจสอบได้ที่ไฟล์แนบ)</p>
                <p>ขอแสดงความนับถือ<br>${config.SiteName}</p>
            </div>
        `;
        MailApp.sendEmail({
            to: data.email,
            subject: "ไฟล์ใบเสร็จรับเงิน (Statement) - " + config.SiteName,
            htmlBody: htmlBody,
            attachments: [blob]
        });
        return jsonResponse({ status: "success", message: "ส่งอีเมลสำเร็จ" });
    } catch(e) {
        return jsonResponse({ status: "error", message: e.toString() });
    }
}

function handleGetBookingList(data) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var bSheet = ss.getSheetByName(SHEET_BOOKING);
  var bData = bSheet.getDataRange().getValues();
  var bookings = [];
  
  for (var i = 1; i < bData.length; i++) {
    if (bData[i][6] === data.phone || bData[i][6] === "'" + data.phone) {
      bookings.push({
        createDate: formatThaiDateTime(bData[i][0]),
        topic: bData[i][7],
        detail: bData[i][8],
        bookDate: bData[i][9],
        bookTime: bData[i][10],
        queueNo: bData[i][11],
        sequence: bData[i][12],
        waitCount: bData[i][13],
        status: bData[i][14],
        note: bData[i][15],
        rowId: i + 1 
      });
    }
  }
  bookings.reverse(); 
  return jsonResponse({ status: "success", bookings: bookings });
}

function handleGetBookedSlots(data) {
    var bSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_BOOKING);
    var bData = bSheet.getDataRange().getValues();
    var bookedTimes = [];
    var hasUserBookedToday = false;
    
    for (var i = 1; i < bData.length; i++) {
        if (bData[i][14] === "รอเรียกคิว") {
            if (bData[i][9] === data.date) {
                bookedTimes.push(bData[i][10]);
                if (bData[i][6] === data.phone || bData[i][6] === "'" + data.phone) {
                    hasUserBookedToday = true;
                }
            }
        }
    }
    return jsonResponse({ status: "success", bookedTimes: bookedTimes, hasUserBookedToday: hasUserBookedToday });
}

function handleSubmitBooking(data, config) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var bSheet = ss.getSheetByName(SHEET_BOOKING);
  var bData = bSheet.getDataRange().getValues();
  
  var d = new Date();
  var dateStr = Utilities.formatDate(d, "GMT+7", "dd-MM-yyyy");
  var timeStr = Utilities.formatDate(d, "GMT+7", "HH:mm:ss");
  
  var bookDate = data.bookDate;
  var bookTime = data.bookTime;
  
  var countToday = 0;
  var waitCount = 0; 
  var isSlotTaken = false;
  var hasUserBookedToday = false;
  
  for(var i=1; i<bData.length; i++){
    if(bData[i][14] === "รอเรียกคิว" && bData[i][9] === bookDate) {
        countToday++;
        waitCount++;
        if (bData[i][10] === bookTime) {
            isSlotTaken = true;
        }
        if (bData[i][6] === data.phone || bData[i][6] === "'" + data.phone) {
            hasUserBookedToday = true;
        }
    } else if (bData[i][9] === bookDate) {
        countToday++;
    }
  }

  if (isSlotTaken) return jsonResponse({ status: "error", message: "เวลานี้มีผู้จองแล้ว กรุณาเลือกเวลาอื่น" });
  if (hasUserBookedToday) return jsonResponse({ status: "error", message: "คุณมีคิวที่กำลังรอรับบริการในวันนี้แล้ว ไม่สามารถจองซ้ำได้" });
  
  var sequence = countToday + 1;
  var queueNo = "Q" + Utilities.formatDate(new Date(bookDate.split('-').reverse().join('-')), "GMT+7", "yyMMdd") + ("00" + sequence).slice(-3);
  
  bSheet.appendRow([
    dateStr, timeStr, data.uid, data.fname, data.lname, data.email, "'" + data.phone, 
    data.topic, data.detail, bookDate, bookTime, "'" + queueNo, sequence, waitCount, "รอเรียกคิว", "-"
  ]);
  
  var htmlBody = `
    <div style="font-family: 'Tahoma', sans-serif; color: #333; line-height: 1.6;">
      <h2 style="color: #e43a3d;">การจองคิวสำเร็จ</h2>
      <p>เรียน คุณ ${data.fname} ${data.lname}</p>
      <p>ระบบได้รับการจองคิวของคุณเรียบร้อยแล้ว โดยมีรายละเอียดดังนี้:</p>
      <ul style="list-style: none; padding-left: 20px; background: #f9f9f9; padding: 15px; border-radius: 5px;">
        <li><b>เลขที่คิว:</b> ${queueNo}</li>
        <li><b>ลำดับคิว:</b> ${sequence}</li>
        <li><b>จำนวนคิวรอก่อนหน้า:</b> ${waitCount}</li>
        <li><b>วันที่นัดหมาย:</b> ${bookDate}</li>
        <li><b>เวลา:</b> ${bookTime} น.</li>
        <li><b>หัวข้อ:</b> ${data.topic}</li>
      </ul>
      <p style="color:red; font-size:12px;">* กรุณามาเข้ารับบริการภายในวันที่ ${bookDate} เวลา ${bookTime} น.</p>
      <p>หากต้องการยกเลิก กรุณายกเลิกล่วงหน้าอย่างน้อย 3 ชั่วโมง</p>
      <p>ขอแสดงความนับถือ<br>${config.SiteName}</p>
    </div>
  `;
  try { MailApp.sendEmail({to: data.email, subject: "ยืนยันการจองคิว - " + config.SiteName, htmlBody: htmlBody}); } catch(e){}
  
  notifyAdmin(config, "มีการจองคิวใหม่", `<p><b>ผู้ใช้:</b> ${data.fname} ${data.lname} (${data.phone})</p><p><b>หัวข้อ:</b> ${data.topic}</p><p><b>นัดวันที่:</b> ${bookDate} | ${bookTime} น.</p><p><b>เลขคิว:</b> ${queueNo}</p>`, "info");

  return jsonResponse({ status: "success", message: "จองคิวสำเร็จ", queueNo: queueNo, sequence: sequence, waitCount: waitCount });
}

function handleCancelBooking(data, config) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var bSheet = ss.getSheetByName(SHEET_BOOKING);
  
  var rowId = parseInt(data.rowId);
  var bookDateStr = bSheet.getRange(rowId, 10).getValue(); 
  var bookTimeStr = bSheet.getRange(rowId, 11).getValue(); 
  
  var parts = String(bookDateStr).split('-');
  if(parts.length === 3) {
    var bDate = new Date(parts[2] + "-" + parts[1] + "-" + parts[0] + "T" + bookTimeStr + ":00+07:00");
    var now = new Date();
    var diffMs = bDate - now;
    var diffHours = diffMs / (1000 * 60 * 60);
    if(diffHours < 3) {
      return jsonResponse({ status: "error", message: "ไม่สามารถยกเลิกคิวได้ ต้องยกเลิกล่วงหน้าอย่างน้อย 3 ชั่วโมง" });
    }
  }

  bSheet.getRange(rowId, 15).setValue("ยกเลิกแล้ว");
  bSheet.getRange(rowId, 16).setValue("ผู้ใช้ยกเลิกการเข้ารับบริการในวันเวลาที่กำหนด");

  var topic = bSheet.getRange(rowId, 8).getValue();
  var qNo = bSheet.getRange(rowId, 12).getValue();

  var htmlBody = `
    <div style="font-family: 'Tahoma', sans-serif; color: #333; line-height: 1.6;">
      <h2 style="color: #e43a3d;">ยกเลิกคิวสำเร็จ</h2>
      <p>เรียน คุณ ${data.fname}</p>
      <p>คิวหมายเลข <b>${qNo}</b> (หัวข้อ: ${topic}) ของคุณได้ถูกยกเลิกเรียบร้อยแล้ว</p>
      <p>ขอแสดงความนับถือ<br>${config.SiteName}</p>
    </div>
  `;
  try { MailApp.sendEmail({to: data.email, subject: "ยกเลิกคิวสำเร็จ - " + config.SiteName, htmlBody: htmlBody}); } catch(e){}
  notifyAdmin(config, "ลูกค้าทำการยกเลิกคิว", `<p><b>ผู้ใช้:</b> ${data.fname} (${data.phone})</p><p><b>หัวข้อ:</b> ${topic}</p><p><b>เลขคิว:</b> ${qNo}</p>`, "warning");

  return jsonResponse({ status: "success", message: "ยกเลิกคิวสำเร็จ" });
}
