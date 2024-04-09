// import AES from 'crypto-js/aes';
// import Utf8 from 'crypto-js/enc-utf8';

const encrypt = (message, secretKey) => {
  return secretKey + message
}

const decrypt = (encryptedMessage, secretKey) => {
  return encryptedMessage.replace(secretKey, "")
}

const encryptMessage = (message, secretKey) => {
  const encrypted = encrypt(message, secretKey);
  console.log("encrypted message", encrypted)
  return encrypted//.toString();
};

const decryptMessage = (encryptedMessage, secretKey) => {
  const decrypted = decrypt(encryptedMessage, secretKey);
  console.log("decrypted message", decrypted)
  return decrypted//.toString(Utf8);
};

export { encryptMessage, decryptMessage }