import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';

import Helpers from '../../helpers/helperFunctions';
import Validates from '../../helpers/validateFunctions';
import {validLoginUser} from '../DB/login.controller';
import {AppError} from '../../interfaces';
import Errors from '../../assets/errors';
import Config from '../../config';

export default {
  mainView: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).render('out/login', {
        title: 'TimeFars - Ingresar',
      });
    } catch (e) {
      const err = new AppError(e, req);
      return next(err);
    }
  },

  postCtrl: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let {mail, pass} = req.body;
      if (!Validates.validEmail(mail)) {
        Helpers.sendResponse(res, true, Errors.invalidField('Correo'));
      }
      const isValidUser: any = await validLoginUser(mail, pass);
      if (isValidUser) {
        const verified = Object.values(isValidUser.verified)[0] == 1 ? true : false;
        const token = jwt.sign(
          {
            sub: isValidUser.userID,
            name: isValidUser.userName,
            avatar: 'n-1',
            verified: verified,
          },
          Config.secretKey,
          {expiresIn: '2d'}
        );
        res.cookie('token', token, {
          httpOnly: true,
          expires: new Date(Date.now() + 86400000),
        });
        res.redirect('/home');
        return;
      }
      Helpers.sendResponse(res, true, Errors.invalidCredentials);
    } catch (e) {
      const err = new AppError(e, req);
      return next(err);
    }
  },
};
