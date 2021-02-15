import {Response, Request, NextFunction} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {secretKey} from '../config';

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

export function generateEmailHTML(name: string) {
  return `
<style>
.ctn-main {
  width: 90%;
  height: 200px;

  background: rgba(34, 227, 66, 1);
  background: -moz-linear-gradient(
    top,
    rgba(34, 227, 66, 1) 0%,
    rgba(75, 232, 216, 1) 75%,
    rgba(75, 232, 216, 1) 100%
  );
  background: -webkit-gradient(
    left top,
    left bottom,
    color-stop(0%, rgba(34, 227, 66, 1)),
    color-stop(75%, rgba(75, 232, 216, 1)),
    color-stop(100%, rgba(75, 232, 216, 1))
  );
  background: -webkit-linear-gradient(
    top,
    rgba(34, 227, 66, 1) 0%,
    rgba(75, 232, 216, 1) 75%,
    rgba(75, 232, 216, 1) 100%
  );
  background: -o-linear-gradient(
    top,
    rgba(34, 227, 66, 1) 0%,
    rgba(75, 232, 216, 1) 75%,
    rgba(75, 232, 216, 1) 100%
  );
  background: -ms-linear-gradient(
    top,
    rgba(34, 227, 66, 1) 0%,
    rgba(75, 232, 216, 1) 75%,
    rgba(75, 232, 216, 1) 100%
  );
  background: linear-gradient(
    to bottom,
    rgba(34, 227, 66, 1) 0%,
    rgba(75, 232, 216, 1) 75%,
    rgba(75, 232, 216, 1) 100%
  );
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#22e342', endColorstr='#4be8d8', GradientType=0 );
  border-radius: 8px;
}
h2 {
  font-family: Arial, Helvetica, sans-serif;
  color: #fff;
}
button {
  cursor: pointer;
}
</style>

<div class="ctn-main">
    <h2>¡Valida tu email de TimeFars ${name}!</h2>
    <button>Validar</button>
</div>
    `;
}
