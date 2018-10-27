export function decryptData(cipherText) {
    var key = this.generateKey();
    var four = "9a2b73d130c8796309b776eeb09834b0";

    var cipherParams = CryptoJS.lib.CipherParams.create({
                                                ciphertext: CryptoJS.enc.Base64.parse(cipherText)});
    var decrypted = CryptoJS.AES.decrypt(cipherParams,
                                                    key,
                                                        { iv: CryptoJS.enc.Hex.parse(four) });
    var responseString = decrypted.toString(CryptoJS.enc.Utf8);
    return JSON.parse(responseString);
}

export function encryptData(plainText) {
    var key = this.generateKey();
    var four = "9a2b73d130c8796309b776eeb09834b0";
    var encrypted = CryptoJS.AES.encrypt(plainText,
                                                key,
                                                    { iv: CryptoJS.enc.Hex.parse(four) });
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
}

export function generateKey() {
    var iterationCount = 1000;
    var keySize = 128;
    var passPhrase = 'nihongo@%H%^%FSDF2SVC25B6CVCB*(--2bb2fg91';

    var salt = "577bd45a17977269694908d80905c32a";

    var key = CryptoJS.PBKDF2( passPhrase, 
                                CryptoJS.enc.Hex.parse(salt),
                                    { keySize: keySize/32, iterations: iterationCount });
    return key;                              
}

