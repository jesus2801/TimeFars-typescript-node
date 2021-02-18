import {Request,Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

import Helpers from '../helpers/helperFunctions';
import {validLoginUser} from '../controllers/DB/login.controller';
import {insertUser} from '../controllers/DB/signup.controller';
import {sendMail} from '../nodeMailer.setup';
import {AppError} from '../interfaces';
import Config from '../config';

export default {
  authCallback: async (req: any, res: Response, next: NextFunction) => {
    try {
      res.cookie('token', req.user.token, {
        httpOnly: true,
        expires: new Date(Date.now() + 86400000),
      });
      res.redirect('/home');
    } catch (e) {
      const err = new AppError(e, req);
      return next(err);
    }
  },

  OAuthAuthenticate: function (profile: any, id: string) {
    return new Promise(async (resolved, reject) => {
      try {
        const isUser: any = await validLoginUser(profile._json.email, id);
        if (isUser) {
          const token = jwt.sign(
            {
              sub: isUser.userID,
              name: isUser.userName,
              avatar: 'n-1',
            },
            Config.secretKey,
            {expiresIn: '2d'}
          );
          profile.token = token;
          resolved(profile);
          return;
        }
        const hash: string = await Helpers.hashPass(id);
        const code: string = Helpers.generateCode();
        const userID = await insertUser(
          profile.displayName,
          profile._json.email,
          hash,
          code
        );
        const token = jwt.sign(
          {
            sub: userID,
            name: profile.displayName,
            avatar: 'n-1',
          },
          Config.secretKey,
          {expiresIn: '2d'}
        );
        profile.token = token;
        resolved(profile);
        await sendMail(
          profile._json.email,
          'verificar correo TimeFars',
          Helpers.generateEmailHTML(profile.displayName, code)
        );
      } catch (e) {
        reject(e);
      }
    });
  },
  verifyToken: async function(req: Request, res: Response, next: NextFunction) {
    try {
      const cookieToken = req.cookies['token'];
      const token: any = await jwt.verify(cookieToken, Config.secretKey);
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
  },
  
  verifyUser: async function(req: Request, res: Response, next: NextFunction) {
    try {
      const cookieToken = req.cookies['token'];
      const token = await jwt.verify(cookieToken, Config.secretKey);
      //@ts-ignore
      req.token = token;
      next();
    } catch (e) {
      res.redirect('/login');
    }
  }
};
