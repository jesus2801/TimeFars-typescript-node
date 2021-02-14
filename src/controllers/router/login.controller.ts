import {Request, Response} from 'express';
import {sendResponse} from '../../helpers/helperFunctions';
import {reportError} from '../../helpers/reportError';
import {validEmail} from '../../helpers/validateFunctions';
import {validLoginUser} from '../DB/login.controller';
import jwt from 'jsonwebtoken';
import {secretKey} from '../../config';

export const loginMainView = async (req: Request, res: Response) => {
  try {
    res.render('out/login', {
      title: 'TimeFars - Ingresar',
    });
  } catch (e) {
    res.redirect('/err');
    reportError(e, req.ip, req.url);
  }
};

export const postLoginCtrl = async (req: Request, res: Response) => {
  try {
    let {mail, pass} = req.body;
    if (!validEmail(mail)) {
      sendResponse(res, true, 'El correo ingresado es inválido');
    }
    const isValidUser: any = await validLoginUser(mail, pass);
    if (isValidUser) {
      const token = jwt.sign(
        {
          sub: isValidUser.userID,
          name: isValidUser.userName,
          avatar: 'n-1',
        },
        secretKey,
        {expiresIn: '30h'}
      );
      res.cookie('token', token);
      res.redirect('/home');
      return;
    }
    sendResponse(res, true, 'El correo y/o contraseña ingresados son incorrectos.');
  } catch (e) {
    res.redirect('/err');
    reportError(e, req.ip, req.url);
  }
};
