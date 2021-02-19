import {NextFunction, Response} from 'express';
import jwt from 'jsonwebtoken';

import {getCode, getEmail, validateEmailDB} from '../DB/auth.controller';
import Helpers from '../../helpers/helperFunctions';
import {sendMail} from '../../config/nodeMailer.setup';
import {AppError} from '../../interfaces/index.interfaces';
import Config from '../../config/config';

export default {
  unverifiedEmail: async (req: any, res: Response, next: NextFunction) => {
    try {
      const email = await getEmail(req.token.sub);
      res.render('app/unverifiedEmail', {
        title: 'TimeFars - Verificar Correo',
        email,
      });
    } catch (e) {
      const err = new AppError(e, req);
      return next(err);
    }
  },

  resendEmail: async (req: any, res: Response, next: NextFunction) => {
    let responses: any = {};
    getEmail(req.token.sub)
      .then(response => {
        responses.mail = response;
        if (Object.keys(responses).length === 2) {
          sendMail(
            responses.mail,
            'verificar correo TimeFars',
            Helpers.generateEmailHTML(req.token.name, responses.code)
          );
        }
      })
      .catch(reportErr);

    getCode(req.token.sub)
      .then(response => {
        responses.code = response;
        if (Object.keys(responses).length === 2) {
          sendMail(
            responses.mail,
            'verificar correo TimeFars',
            Helpers.generateEmailHTML(req.token.name, responses.code)
          );
        }
      })
      .catch(reportErr);

    function reportErr(e: any) {
      const err = new AppError(e, req);
      return next(err);
    }
  },

  verifyEmail: async (req: any, res: Response, next: NextFunction) => {
    try {
      let {code} = req.params;
      const isValid = await validateEmailDB(code, req.token.sub);
      if (!isValid) {
        res.redirect('/');
        return;
      }
      const newToken = jwt.sign(
        {
          sub: req.token.sub,
          name: req.token.name,
          avatar: req.token.avatar,
          verified: true,
        },
        Config.secretKey,
        {expiresIn: '2d'}
      );
      res.cookie('token', newToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 86400000),
      });
      res.redirect('/home');
    } catch (e) {
      const err = new AppError(e, req);
      return next(err);
    }
  },

  logout: (req: any, res: Response, next: NextFunction) => {
    try {
      res.clearCookie('token');
      res.redirect('/');
    } catch (e) {
      const err = new AppError(e, req);
      return next(err);
    }
  },
};
