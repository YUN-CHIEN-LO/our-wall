// 服務器端密碼解密工具

/**
 * 解密客戶端加密的密碼
 * @param encryptedPassword 加密的密碼
 * @param salt 鹽值
 * @returns 解密後的原始密碼
 */
export function decryptPassword(encryptedPassword: string, salt: string): string {
  try {
    // Base64 解碼
    const decoded = atob(encryptedPassword);

    // XOR 解密
    let decrypted = '';
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i) ^ salt.charCodeAt(i % salt.length);
      decrypted += String.fromCharCode(charCode);
    }

    return decrypted;
  } catch (error) {
    throw new Error("密碼解密失敗");
  }
}

/**
 * 驗證加密密碼格式
 * @param encryptedPassword 加密的密碼
 * @param salt 鹽值
 * @returns 是否為有效格式
 */
export function validateEncryptedPassword(encryptedPassword: string, salt: string): boolean {
  try {
    // 檢查是否為有效的 Base64 格式
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(encryptedPassword)) {
      return false;
    }

    // 嘗試解密
    decryptPassword(encryptedPassword, salt);
    return true;
  } catch {
    return false;
  }
} 