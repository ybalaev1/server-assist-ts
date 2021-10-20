import crypto from 'crypto';

const decrypt = (message: string | any, key: string) => {
  try {
    const { iv, encryptedData } = message;
    const custom_key = crypto.scryptSync(key.toString(), 'salt', 32);
    const ive = Buffer.from(iv, 'hex');
    const encryptedText = Buffer.from(encryptedData, 'hex');
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc', custom_key, ive,
    );

    const cry = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return cry.toString();
  } catch (error) {
    return error;
  }
};

export { decrypt };
