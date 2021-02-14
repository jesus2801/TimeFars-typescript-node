import {Response, Request, NextFunction} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { secretKey } from '../config';

export function sendResponse(res: Response, err: boolean, message: string): void {
  res.json({
    error: err,
    message,
  });
}

export function hashPass(pass: string): Promise<string> {
  return new Promise(async (resolved, reject) => {
    try {
      const hash: string = await bcrypt.hash(pass, 10);
      resolved(hash);
    } catch (e) {
      reject(e);
    }
  });
}

export function comparePass(hash: string, pass: string): Promise<boolean> {
  return new Promise(async (resolved, reject) => {
    try {
      const isEquals = await bcrypt.compare(pass, hash);
      resolved(isEquals);
    } catch (e) {
      reject(e);
    }
  });
}

export async function verifyToken(req: Request, res: Response, next: NextFunction) {
  try {
    const cookieToken = req.cookies['token'];
    const token = await jwt.verify(cookieToken, secretKey);
    //@ts-ignore
    req.token = token;
    next();
  } catch (e) {
    res.redirect('/login');
  }
}
