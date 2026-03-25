import * as crypto from 'crypto';

// ✅ proper global injection
if (!(global as any).crypto) {
  (global as any).crypto = crypto.webcrypto;
}