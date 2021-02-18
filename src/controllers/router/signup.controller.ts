import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';

import Validates from '../../helpers/validateFunctions';
import Helpers from '../../helpers/helperFunctions';
import {reportError} from '../../helpers/reportError';
import {insertUser} from '../DB/signup.controller';
import {sendMail} from '../../nodeMailer.setup';
import {AppError} from '../../interfaces';
import Errors from '../../assets/errors';
import Config from '../../config';

export default {
  mainView: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).render('out/signup', {
        title: 'TimeFars - Registro',
      });
    } catch (e) {
      const err = new AppError(e, req);
      return next(err);
    }
  },

  postCtrl: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let {name, email, pass} = req.body;
      if (!Validates.validUserName(name)) {
        Helpers.sendResponse(res, true, Errors.invalidSimbols('Nombre de usuario'));
        return;
      }
      if (!Validates.validEmail(email)) {
        Helpers.sendResponse(res, true, Errors.invalidField('Correo electronico'));
        return;
      }
      const hash: string = await Helpers.hashPass(pass);
      const code: string = Helpers.generateCode();
      const userID = await insertUser(name, email, hash, code);
      const token = jwt.sign(
        {
          sub: userID,
          name,
          avatar: 'n-1',
          verified: false,
        },
        Config.secretKey,
        {expiresIn: '2d'}
      );
      res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 86400000),
      });
      res.redirect('/home');
      sendMail(
        email,
        'verificar correo TimeFars',
        Helpers.generateEmailHTML(name, code)
      ).catch(e => {
        reportError(e, req.ip, req.url, userID);
      });
    } catch (e) {
      if (e.code == 'ER_DUP_ENTRY') {
        Helpers.sendResponse(res, true, Errors.emailInUse);
        return;
      }
      const err = new AppError(e, req);
      return next(err);
    }
  },
};
