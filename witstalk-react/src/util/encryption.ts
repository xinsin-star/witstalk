// src/utils/encryption.ts
import CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt';

// AES加密配置
const AES_CONFIG = {
    KEY_SIZE: 32 as const, // 256位密钥
    IV_SIZE: 16 as const,  // IV固定16字节
    MODE: CryptoJS.mode.CBC,
    PADDING: CryptoJS.pad.Pkcs7
};

// 生成的AES密钥和IV类型
export type AesKeyIv = {
    key: string;        // Base64编码的密钥
    iv: string;         // Base64编码的IV
    keyHex: string;     // 十六进制编码的密钥
    ivHex: string;      // 十六进制编码的IV
};

/**
 * 生成随机的AES密钥和IV
 */
export const generateAesKeyAndIv = (): AesKeyIv => {
    // 生成随机密钥（32字节）
    const key = CryptoJS.lib.WordArray.random(AES_CONFIG.KEY_SIZE);
    // 生成随机IV（16字节）
    const iv = CryptoJS.lib.WordArray.random(AES_CONFIG.IV_SIZE);

    return {
        key: CryptoJS.enc.Base64.stringify(key),
        iv: CryptoJS.enc.Base64.stringify(iv),
        keyHex: key.toString(CryptoJS.enc.Hex),
        ivHex: iv.toString(CryptoJS.enc.Hex)
    };
};

/**
 * AES加密
 * @param plainText 明文
 * @param keyBase64 Base64编码的AES密钥
 * @param ivBase64 Base64编码的IV
 */
export const aesEncrypt = (
    plainText: string,
    keyBase64: string,
    ivBase64: string
): string => {
    try {
        const key = CryptoJS.enc.Base64.parse(keyBase64);
        const iv = CryptoJS.enc.Base64.parse(ivBase64);

        const ciphertext = CryptoJS.AES.encrypt(plainText, key, {
            iv: iv,
            mode: AES_CONFIG.MODE,
            padding: AES_CONFIG.PADDING
        });

        return ciphertext.toString();
    } catch (error) {
        console.error('AES加密失败:', error);
        throw new Error('AES加密失败');
    }
};

/**
 * AES解密
 * @param cipherText 密文
 * @param keyBase64 Base64编码的AES密钥
 * @param ivBase64 Base64编码的IV
 */
export const aesDecrypt = (
    cipherText: string,
    keyBase64: string,
    ivBase64: string
): string => {
    try {
        const key = CryptoJS.enc.Base64.parse(keyBase64);
        const iv = CryptoJS.enc.Base64.parse(ivBase64);

        const bytes = CryptoJS.AES.decrypt(cipherText, key, {
            iv: iv,
            mode: AES_CONFIG.MODE,
            padding: AES_CONFIG.PADDING
        });

        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error('AES解密失败:', error);
        throw new Error('AES解密失败');
    }
};

/**
 * RSA加密（使用公钥加密AES密钥）
 * @param plainText 明文
 * @param publicKey RSA公钥
 */
export const rsaEncrypt = (plainText: string, publicKey: string): string => {
    try {
        const encryptor = new JSEncrypt();
        encryptor.setPublicKey(publicKey);
        const encrypted = encryptor.encrypt(plainText);

        if (!encrypted) {
            throw new Error('RSA加密失败，可能是密钥格式错误或明文过长');
        }

        return encrypted;
    } catch (error) {
        console.error('RSA加密失败:', error);
        throw new Error('RSA加密失败');
    }
};

/**
 * RSA解密（仅前端测试用，实际私钥应保存在后端）
 * @param cipherText 密文
 * @param privateKey RSA私钥
 */
export const rsaDecrypt = (cipherText: string, privateKey: string): string => {
    try {
        const decryptor = new JSEncrypt();
        decryptor.setPrivateKey(privateKey);
        const decrypted = decryptor.decrypt(cipherText);

        if (!decrypted) {
            throw new Error('RSA解密失败，可能是密钥不匹配或密文错误');
        }

        return decrypted;
    } catch (error) {
        console.error('RSA解密失败:', error);
        throw new Error('RSA解密失败');
    }
};
