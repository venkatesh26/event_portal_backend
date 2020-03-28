const config = require('./config/config');
const aes256 = require('aes256');
const base64 = require('base-64');
const utf8 = require('utf8');
const path = require('path');
const fs = require('fs')
const encrypt = function (plaintext) {  
  if (config.is_encryption == true) {
    try {
      plaintext = JSON.stringify(plaintext);
      encrypted = aes256.encrypt(config.Aes_key, plaintext);
    } catch(error){
      console.log(error)
      encrypted = 'error occured. please send the object data';
    }
    return { data: encrypted }
  }
  return plaintext
}
const decrypt = function (plaintext) {
  if (config.is_encryption == true) {
    try {
      var decrypted_data = aes256.decrypt(config.Aes_key, plaintext);
      try{
        decrypted = JSON.parse(decrypted_data);
      }
      catch {
        decrypted = JSON.parse(JSON.stringify(decrypted_data));
      }
    }catch(error){
      decrypted = "error occured. please send the encrypted data"
    }
    return decrypted
  }
  return plaintext
}
const decode_id = function(encoded){
  if (config.is_encryption == true) {
    var bytes = base64.decode(encoded);
    var text = utf8.decode(bytes);
    return text
  }else{
    return encoded
  }
}
function paramsToObject(entries) {
  let result = {}
  for(let entry of entries) { // each 'entry' is a [key, value] tupple
    const [key, value] = entry;
    result[key] = value;
  }
  return result;
}
const decode_query_string = function(encoded){
  if (config.is_encryption == true) {
    var bytes = base64.decode(encoded.q);
    var text = utf8.decode(bytes);
    var plain_text = aes256.decrypt(config.Aes_key, text)
    const urlParams = new URLSearchParams(plain_text);
    const entries = urlParams.entries(); //returns an iterator of decoded [key,value] tuples
    const params = paramsToObject(entries);
    return params
  }else{
    return encoded
  }
}
function getMatchQueryString(queryString, search_field) {
  var query_field_array = []
  for (var key in search_field) {
      if (queryString[key]) { 
        var field=search_field[key]
        var query_field = { "match_phrase_prefix": { [field]: queryString[key] } }
        query_field_array.push(query_field)
    }
  }
  return query_field_array
}
function getMatchString(queryString, search_field) {
  var query_field_array = []
  for (var key in search_field) {
      if (queryString[key]) { 
        var field=search_field[key]
        var query_field = { "match": { [field]: queryString[key] } }
        query_field_array.push(query_field)
    }
  }
  return query_field_array
}


async function get_date(){

    function checkZero(data){
      if(data.length == 1){
        data = "0" + data;
      }
      return data;
    }
    var today = new Date();
    today.setMinutes( today.getMinutes() + 330);
    var day = today.getDate() + "";
    var month = (today.getMonth() + 1) + "";
    var year = today.getFullYear() + "";
    var hour = today.getHours() + "";
    var minutes = today.getMinutes() + "";
    var seconds = today.getSeconds() + "";

    day = checkZero(day);
    month = checkZero(month);
    year = checkZero(year);
    hour = checkZero(hour);
    minutes = checkZero(minutes);
    seconds = checkZero(seconds);

    date = year+ "-" + month + "-" + day  + " " + hour + ":" + minutes + ":" + seconds

    console.log(year+ "-" + month + "-" + day  + " " + hour + ":" + minutes + ":" + seconds);

    return date
}

async function FileToBase64Conversion(file_dir,filename){
      var base64_data='';
      var fs = require('fs');
      var bitmap = fs.readFileSync(file_dir+filename);
      base64_data = new Buffer.from(bitmap).toString('base64');
      return base64_data;
}

module.exports = { encrypt, decrypt, decode_id, decode_query_string, getMatchQueryString, get_date, getMatchString, FileToBase64Conversion};
