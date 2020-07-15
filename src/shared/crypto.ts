import { AES, enc } from 'crypto-js';

import { APPConfig } from '@/config/app.config';

export function encrypt(value: string): string {
  return AES.encrypt(value, APPConfig.authAudience).toString();
}

export function decrypt(value: string): string {
  const decrypted = AES.decrypt(value, APPConfig.authAudience);
  return decrypted.toString(enc.Utf8);
}
