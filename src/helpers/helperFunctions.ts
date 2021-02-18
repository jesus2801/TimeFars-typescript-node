import {Response} from 'express';
import bcrypt from 'bcrypt';

import {alphabet} from './helperVariables';

export default {
  sendResponse: function (res: Response, err: boolean, message: string): void {
    res.json({
      error: err,
      message,
    });
  },

  hashPass: function (pass: string): Promise<string> {
    return new Promise(async (resolved, reject) => {
      try {
        const hash: string = await bcrypt.hash(pass, 10);
        resolved(hash);
      } catch (e) {
        reject(e);
      }
    });
  },

  comparePass: function (hash: string, pass: string): Promise<boolean> {
    return new Promise(async (resolved, reject) => {
      try {
        const isEquals = await bcrypt.compare(pass, hash);
        resolved(isEquals);
      } catch (e) {
        reject(e);
      }
    });
  },

  generateEmailHTML: function (name: string, code: string) {
    return `
  <div class="ctn-main">
      <h2>¡Valida tu email de TimeFars ${name}!</h2>
      <a href="http://localhost:4002/verifyEmail/${code}"><button>Validar</button></a>
  </div>
      `;
  },

  generateCode: function (): string {
    const time: string = Date.now().toString();
    let code: string = time;
    for (let i = 1, n = 35 - time.length; i <= n; i++) {
      code += alphabet[Math.round(Math.random() * (alphabet.length - 1))];
    }
    return code;
  },
};
