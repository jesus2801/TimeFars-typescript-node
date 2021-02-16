import {Response, Request, NextFunction} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {secretKey} from '../config';
import {alphabet} from './helperVariables';

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
    const token: any = await jwt.verify(cookieToken, secretKey);
    if (token.verified !== true) {
      res.redirect('/unverifiedEmail');
      return;
    }
    //@ts-ignore
    req.token = token;
    next();
  } catch (e) {
    res.redirect('/login');
  }
}

export async function verifyUser(req: Request, res: Response, next: NextFunction) {
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

export function generateEmailHTML(name: string, code: string) {
  return `
<div class="ctn-main">
    <h2>¡Valida tu email de TimeFars ${name}!</h2>
    <a href="http://localhost:4002/verifyEmail/${code}"><button>Validar</button></a>
</div>
    `;
}

export function generateCode(): string {
  let now: Date = new Date();
  let time: string = now.getTime().toString();
  let code: string = time;
  for (let i = 1, n = 35 - time.length; i <= n; i++) {
    code += alphabet[Math.round(Math.random() * (alphabet.length - 1))];
  }
  return code;
}
