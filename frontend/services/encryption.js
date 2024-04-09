import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';

const encrypt = (message, secretKey) => {
  return secretKey + message
}

const decrypt = (encryptedMessage, secretKey) => {
  return encryptedMessage.slice(secretKey.length);
}

const encryptMessage = (message, secretKey) => {
  console.log("encrypt message", message, secretKey)
  const encrypted = encrypt(message, secretKey);
  console.log("testing 1")
  const test = encrypted.toString();
  console.log("testing 2")
  return test
};

const decryptMessage = (encryptedMessage, secretKey) => {
  console.log("decrypt message", message, secretKey)
  const decrypted = decrypt(encryptedMessage, secretKey);
  return decrypted.toString(Utf8);
};

export { encryptMessage, decryptMessage }