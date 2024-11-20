import CryptoJS from 'crypto-js';

export const encryptMessage = (message, secretKey) => {
  try {
    const encrypted = CryptoJS.AES.encrypt(message, secretKey).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw error;
  }
};

export const decryptMessage = (encryptedMessage, secretKey) => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedMessage, secretKey);
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    throw error;
  }
};

export const generateChatKey = () => {
  return CryptoJS.lib.WordArray.random(256/8).toString();
};