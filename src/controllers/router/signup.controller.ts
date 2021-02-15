import {Request, Response} from 'express';
import {reportError} from '../../helpers/reportError';
import {isEmpty, validEmail, validUserName} from '../../helpers/validateFunctions';
import {hashPass, sendResponse} from '../../helpers/helperFunctions';
import {insertUser} from '../DB/signup.controller';
import jwt from 'jsonwebtoken';
import {secretKey} from '../../config';

export const signupMainView = async (req: Request, res: Response) => {
  try {
    res.render('out/signup', {
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
    const userID = await insertUser(name, email, hash);
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
  } catch (e) {
    if (e.code == 'ER_DUP_ENTRY') {
      sendResponse(res, true, 'El correo ingresado ya está utilizado por otro usuario.');
      return;
    }
    res.redirect('/err');
    reportError(e, req.ip, req.url);
  }
};
