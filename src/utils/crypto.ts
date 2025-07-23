// 密碼加密工具
// 注意：這只是客戶端的基本加密，實際生產環境應該使用更安全的方案

/**
 * 生成隨機鹽值
 * @param length 鹽值長度
 * @returns 隨機鹽值字符串
 */
export function generateSalt(length: number = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 簡單的密碼加密（僅用於客戶端傳輸）
 * 這不是真正的加密，只是為了防止明文傳輸
 * @param password 原始密碼
 * @param salt 鹽值
 * @returns 加密後的密碼
 */
export function encryptPassword(password: string, salt: string): string {
  // 使用簡單的 XOR 加密（僅用於演示）
  let encrypted = '';
  for (let i = 0; i < password.length; i++) {
    const charCode = password.charCodeAt(i) ^ salt.charCodeAt(i % salt.length);
    encrypted += String.fromCharCode(charCode);
  }
  return btoa(encrypted); // Base64 編碼
}

/**
 * 加密密碼並返回加密數據
 * @param password 原始密碼
 * @returns 包含加密密碼和鹽值的對象
 */
export function encryptPasswordForAPI(password: string): {
  encryptedPassword: string;
  salt: string;
} {
  const salt = generateSalt();
  const encryptedPassword = encryptPassword(password, salt);

  return {
    encryptedPassword,
    salt
  };
}

/**
 * 驗證密碼強度
 * @param password 密碼
 * @returns 驗證結果
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 6) {
    errors.push("密碼至少需要 6 個字符");
  }

  if (password.length > 128) {
    errors.push("密碼不能超過 128 個字符");
  }

  // 檢查是否包含數字
  if (!/\d/.test(password)) {
    errors.push("密碼需要包含至少一個數字");
  }

  // 檢查是否包含字母
  if (!/[a-zA-Z]/.test(password)) {
    errors.push("密碼需要包含至少一個字母");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * 生成安全的隨機密碼
 * @param length 密碼長度
 * @returns 隨機密碼
 */
export function generateSecurePassword(length: number = 12): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  const allChars = uppercase + lowercase + numbers + symbols;
  let password = '';

  // 確保包含每種類型的字符
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  // 填充剩餘長度
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // 打亂密碼順序
  return password.split('').sort(() => Math.random() - 0.5).join('');
} 