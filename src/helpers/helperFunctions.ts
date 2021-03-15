import { Response } from 'express';
import bcrypt from 'bcrypt';
import { alphabet } from './helperVariables';
import config from '../config/config';

export default {
  sendResponse: function (
    res: Response,
    err: boolean,
    message: string
  ): void {
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
  <div
      style="
        box-sizing: border-box;
        background-color: transparent;
        width: 90%;
        margin: 0 auto;
        border-radius: 2px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px 40px;
        text-align: center;
      "
    >
      <h1 style="color: #ff2055; font-family: Arial, Helvetica, sans-serif; margin: 0px">
        Hola ${name}, ¡valida tu correo!
      </h1>
      <p style="color: rgb(20, 20, 20); font-family: sans-serif; margin: 14px 0">
        Te damos la bienvenida a TimeFars, la mejor plataforma para lograr ganar la mayor
        productividad y eficacia de tu tiempo, deberes y obligaciones.
        <br />
        El paso siguiente es verificar tu correo con el siguiente link:
      </p>
      <a href="${config.hostProtocol}${config.host}/verifyEmail/${code}" style="text-decoration: none">
        <button
          style="
            border: none;
            outline: none;
            border-radius: 4px;
            padding: 6px 15px;
            background-color: #ff2055;
            color: #fff;
            font-family: Arial, Helvetica, sans-serif;
            font-weight: bold;
            font-size: 16px;
            cursor: pointer;
          "
        >
          Verifivar correo
        </button>
      </a>
      <p style="color: rgb(20, 20, 20); font-family: sans-serif;">
        En el caso de tener dificultades para poder verificar el correo ingrese <a href="${config.hostProtocol}${config.host}/unverifiedEmail">aquí</a> para
        poder reenviar este correo.
      </p>
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
