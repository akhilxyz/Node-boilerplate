import crypto from "node:crypto";
import { env } from "@/config/envConfig";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


/**
 * Encrypts data using bcrypt.
 * @param data - The data to encrypt.
 * @returns The hashed data.
 */
async function encrypt(data: string): Promise<string> {
  try {
    return await bcrypt.hash(data, 10);
  } catch (error: any) {
    throw new Error(`Error while encrypting data: ${error.message}`);
  }
}

/**
 * Compares a plain text data with a hashed data to check if they match.
 * @param data - The plain text data.
 * @param hashedData - The hashed data to compare against.
 * @returns A boolean indicating whether the data matches the hash.
 */
async function compare(data: string, hashedData: string): Promise<boolean> {
  try {
    return await bcrypt.compare(data, hashedData);
  } catch (error: any) {
    throw new Error(`Error while comparing data: ${error.message}`);
  }
}


/**
 * Generates a JSON Web Token (JWT) by encrypting the payload using AES-256-CBC encryption.
 * The encrypted payload and IV are embedded in the JWT payload.
 * @param payload - The data to be encrypted and embedded in the JWT.
 * @returns A signed JWT token.
 */
function generateJwt(payload: any) {
  const encryptedData = encryptEngine(payload); // Encrypt the payload
  return jwt.sign(
    { data: encryptedData }, // Store iv and encrypted data separately
    env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}


export function encryptEngine(obj: object): string {
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(env.ENC_SECRET),
    Buffer.from(env.ENC_SECRET.slice(0, 16)) // 16-byte IV (initialization vector)
  );

  let encrypted = cipher.update(JSON.stringify(obj), 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return encrypted;
}

// Function to decrypt an encrypted string back to an object
export function decryptEngine(encrypted: string):  {id : number} {
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(env.ENC_SECRET),
    Buffer.from(env.ENC_SECRET.slice(0, 16)) // 16-byte IV (initialization vector)
  );
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return JSON.parse(decrypted);
}


/**
 * Verifies a JSON Web Token (JWT) using the provided secret key.
 * @param token - The JWT token to be verified.
 * @returns The decoded payload of the JWT token if verification is successful, otherwise returns null.
 */
function verifyJwt(token: string) {
  try {
    const decoded: any = jwt.verify(token, env.JWT_SECRET);
    return decoded;
  } catch (err) {
    console.error("JWT verification failed:", err);
    return null;
  }
}

export const cryptoEngine = { encryptEngine, decryptEngine, compare, encrypt, Jwt: { generateJwt, verifyJwt } };
