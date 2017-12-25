$(function() {
  var $btn = $("#btn");
  $btn.on("click", function() {
    var $gdrive_id   = $("input[name='gdrive_id']");
    var $sheet_id    = $("input[name='sheet_id']");
    var $gdrive_name = $("input[name='gdrive_name']");
    var $slack_room   = $("input[name='slack_room']");
    var $slack_url   = $("input[name='slack_url']");
    var $slack_bot   = $("input[name='slack_bot']");
    var $slack_icon  = $("input[name='slack_icon']");

    var TARGET_FOLDER_ID = $gdrive_id;
    var UPDATE_SHEET_ID = $sheet_id;
    var UPDATE_SHEET_NAME = $gdrive_name;
    var SLACK_HOOK_TOKEN = $slack_room;
    var SLACK_ROOM = $slack_room;
    var SLACK_BOT = $slack_bot;
    var SLACK_ICON = $slack_icon;
    function updateCheck(){var targetFolder=DriveApp.getFolderById(TARGET_FOLDER_ID);var folders=targetFolder.getFolders();var files=targetFolder.getFiles();function getAllFilesId(targetFolder){var filesIdList=[];var files=targetFolder.getFiles();while(files.hasNext()){filesIdList.push(files.next().getId());} var child_folders=targetFolder.getFolders();while(child_folders.hasNext()){var child_folder=child_folders.next();filesIdList=filesIdList.concat(getAllFilesId(child_folder));} return var TARGET_FOLDER_ID = "1R-hyaxGkSoTj05Jhg457T65QhmnJrFce";
    var UPDATE_SHEET_ID = "1iS4uAl-VQq2m6y_WbY7loWgIGZdJFToUZDQVx7QTHoo";
    var UPDATE_SHEET_NAME = "シート1";
    var SLACK_HOOK_TOKEN = "aaaaaa"
    var SLACK_ROOM = "#notify-room"
    var SLACK_BOT = "#notify-room"
    var SLACK_ICON = "#notify-room"

    function updateCheck() {
      var targetFolder = DriveApp.getFolderById(TARGET_FOLDER_ID);
      var folders = targetFolder.getFolders();
      var files = targetFolder.getFiles();
      function getAllFilesId(targetFolder){
        var filesIdList = [];
            var files = targetFolder.getFiles();
        while(files.hasNext()){
          filesIdList.push(files.next().getId());
        }
        var child_folders = targetFolder.getFolders();
        while(child_folders.hasNext()){
          var child_folder = child_folders.next();
          filesIdList = filesIdList.concat( getAllFilesId(child_folder) );
        }
        return filesIdList;
      }
      var allFilesId = getAllFilesId(targetFolder);
      var lastUpdateMap = {};
      allFilesId.forEach(
        function( value, i ){
          var file =DriveApp.getFileById( value );
          lastUpdateMap[file.getName()] = {lastUpdate : file.getLastUpdated(), fileId: file.getId()};
        }
      );
       var spreadsheet = SpreadsheetApp.openById(UPDATE_SHEET_ID);
      var sheet = spreadsheet.getSheetByName(UPDATE_SHEET_NAME);
      var data = sheet.getDataRange().getValues();
      var sheetData = {};
      for (var i = 0; i < data.length; i++) {
        sheetData[data[i][0]] = {name : data[i][0], lastUpdate : data[i][1], rowNo : i + 1};
      }
      var updateFolderMap = [];
      for (key in lastUpdateMap) {
        if( UPDATE_SHEET_ID == lastUpdateMap[key].fileId ){
          continue;
        }
        if(key in sheetData) {
          if(lastUpdateMap[key].lastUpdate > sheetData[key].lastUpdate) {
            sheet.getRange(sheetData[key].rowNo, 2).setValue(lastUpdateMap[key].lastUpdate);
            sheet.getRange(sheetData[key].rowNo, 3).setValue(lastUpdateMap[key].fileId);
            updateFolderMap.push({filename:key, lastUpdate:lastUpdateMap[key].lastUpdate, fileId:lastUpdateMap[key].fileId});
          }
        } else {
          var newRow = sheet.getLastRow() + 1;
          sheet.getRange(newRow, 1).setValue(key);
          sheet.getRange(newRow, 2).setValue(lastUpdateMap[key].lastUpdate);
          sheet.getRange(newRow, 3).setValue(lastUpdateMap[key].fileId);
          updateFolderMap.push({filename:key, lastUpdate:lastUpdateMap[key].lastUpdate, fileId:lastUpdateMap[key].fileId});
        }
      }
      var updateText = "";
      for( key in updateFolderMap ){
        item = updateFolderMap[key];
        updateText +=
         item.filename + "　更新日時：" + Utilities.formatDate(item.lastUpdate, "JST", "yyyy-MM-dd HH:mm:ss") + "\n"
        + DriveApp.getFileById(item.fileId).getUrl() + "\n\n"
      }
      if (updateFolderMap.length != 0) {
        sendToSlack("【" + targetFolder.getName() + "】が更新されました。\n\n"+ updateText ,SLACK_ROOM);
      }
    }
    function sendToSlack(body, channel) {
      var url = "https://hooks.slack.com/services/" + SLACK_HOOK_TOKEN;
      var data = { "channel" : channel, "username" : SLACK_BOT, "text" : body, "icon_emoji" : SLACK_ICON };
      var payload = JSON.stringify(data);
      var options = {
        "method" : "POST",
        "contentType" : "application/json",
        "payload" : payload
      };
      var response = UrlFetchApp.fetch(url, options);
    }
  });
});
