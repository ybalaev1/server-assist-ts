import crypto from 'crypto';

// const key = crypto.scryptSync('secret', 'salt', 32);

const encrypt = (message: string, key: string) => {
  const custom_key = crypto.scryptSync(key, 'salt', 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', custom_key, iv);

  let encrypted = cipher.update(message);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted.toString('hex'),
  };
};

export { encrypt };
