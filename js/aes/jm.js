let jmKey = 'fgq1234567898888';
let jmIv = '1234567898888fgq';


function geJmKey() {
    return CryptoJS.enc.Utf8.parse(jmKey);
}
function getJmIv() {
    return CryptoJS.enc.Utf8.parse(jmIv);
}

/**
 * @return {string}
 */
function Encrypt(word) {
    let res = "";
    if (word) {
        let srcs = CryptoJS.enc.Utf8.parse(word);
        let encrypted = CryptoJS.AES.encrypt(srcs, geJmKey(), {iv: getJmIv(), mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7});
        res = encrypted.ciphertext.toString().toUpperCase();
    }
    return res;
}

/**
 * @return {string}
 */
function Decrypt(word) {
    let res = "";
    if (word) {
        let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
        let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
        let decrypt = CryptoJS.AES.decrypt(srcs, geJmKey(), {iv: getJmIv(), mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7});
        let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
        res = decryptedStr.toString();
    }
    return res;
}


