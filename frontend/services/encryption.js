// import AES from 'crypto-js/aes';
// import Utf8 from 'crypto-js/enc-utf8';

const keyToShift = (keyString) => {
  return keyString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 26;
};

const caesarCipher = (text, keyString, encrypting = true) => {
  let shift = keyToShift(keyString);
  if (!encrypting) {
    shift = 26 - shift; // Invert shift for decryption
  }
  return text
    .split('')
    .map(char => {
      if (char.match(/[a-z]/i)) { // Check if character is an alphabet
        let isUpperCase = char === char.toUpperCase();
        let baseCode = isUpperCase ? 'A'.charCodeAt(0) : 'a'.charCodeAt(0);
        let shiftedCharCode = ((char.charCodeAt(0) - baseCode + shift) % 26) + baseCode;
        return String.fromCharCode(shiftedCharCode);
      }
      return char; // Return non-alphabet characters as is
    })
    .join('');
};

const encrypt = (message, secretKey) => {
  return caesarCipher(message, secretKey, true);
};

const decrypt = (message, secretKey) => {
  return caesarCipher(message, secretKey, false);
};

const encryptMessage = (message, secretKey) => {
  const encrypted = encrypt(message, secretKey);
  console.log("encrypted message", encrypted, secretKey)
  return encrypted//.toString();
};

const decryptMessage = (encryptedMessage, secretKey) => {
  const decrypted = decrypt(encryptedMessage, secretKey);
  console.log("decrypted message", decrypted, secretKey)
  return decrypted//.toString(Utf8);
};

export { encryptMessage, decryptMessage }