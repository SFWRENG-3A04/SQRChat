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
  console.log("encrypted message", encrypted)
  return encrypted.toString();
};

const decryptMessage = (encryptedMessage, secretKey) => {
  console.log("decrypt message", encryptedMessage, secretKey)
  const decrypted = decrypt(encryptedMessage, secretKey);
  console.log("decrypted message", encrypted)
  return decrypted.toString(Utf8);
};

export { encryptMessage, decryptMessage }