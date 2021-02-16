import {Request, Response} from 'express';
import {reportError} from '../../helpers/reportError';
import {isEmpty, validEmail, validUserName} from '../../helpers/validateFunctions';
import {
  generateCode,
  generateEmailHTML,
  hashPass,
  sendResponse,
} from '../../helpers/helperFunctions';
import {insertUser} from '../DB/signup.controller';
import jwt from 'jsonwebtoken';
import {secretKey} from '../../config';
import {sendMail} from '../../nodeMailer.setup';

export const signupMainView = async (req: Request, res: Response) => {
  try {
    res.status(200).render('out/signup', {
      title: 'TimeFars - Registro',
    });
  } catch (e) {
    res.redirect('/err');
    reportError(e, req.ip, req.url);
  }
};

export const postSignupCtrl = async (req: Request, res: Response) => {
  try {
    let {name, email, pass} = req.body;
    name = name.trim();
    email = email.trim();
    pass = pass.trim();
    if (isEmpty(name) || isEmpty(email) || isEmpty(pass)) {
      sendResponse(res, true, 'Porfavor rellene correctamente todos los campos.');
      return;
    }
    if (!validUserName(name)) {
      sendResponse(res, true, 'Nombre de usuario ingresado contiene simbolos inválidos.');
      return;
    }
    if (!validEmail(email)) {
      sendResponse(res, true, 'Correo ingresado inválido.');
      return;
    }
    const hash: string = await hashPass(pass);
    const code: string = await generateCode();
    const userID = await insertUser(name, email, hash, code);
    const token = jwt.sign(
      {
        sub: userID,
        name,
        avatar: 'n-1',
        verified: false,
      },
      secretKey,
      {expiresIn: '30h'}
    );
    res.cookie('token', token, {httpOnly: true});
    res.redirect('/home');
    sendMail(email, 'verificar correo TimeFars', generateEmailHTML(name, code)).catch(
      e => {
        reportError(e, req.ip, req.url, userID);
      }
    );
  } catch (e) {
    if (e.code == 'ER_DUP_ENTRY') {
      sendResponse(res, true, 'El correo ingresado ya está utilizado por otro usuario.');
      return;
    }
    res.redirect('/err');
    reportError(e, req.ip, req.url);
  }
};
