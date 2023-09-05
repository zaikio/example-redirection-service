import crypto from "crypto";

const encryptionKey = process.env.ENCRYPTION_KEY; // crypto.randomBytes(32)
if (encryptionKey == null) {
  console.error("Must set ENCRYPTION_KEY environment variable");
  process.exit(1);
}

const algorithm = "aes-256-cbc";

export function decrypt(message) {
  const [iv, ciphertext] = message.split("--");
  const decipher = crypto.createDecipheriv(algorithm, encryptionKey, Buffer.from(iv, "hex"));

  let decryptedData = decipher.update(ciphertext, "hex", "utf8");
  decryptedData += decipher.final("utf-8");

  return JSON.parse(decryptedData);
}

export function encrypt(object) {
  const plaintext = JSON.stringify(object);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, encryptionKey, iv);

  let cryptedData = cipher.update(plaintext, "utf8", "hex");
  cryptedData += cipher.final("hex");

  return `${iv.toString("hex")}--${cryptedData}`;
}

