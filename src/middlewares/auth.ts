import {Response, NextFunction} from 'express';

import Helpers from '../helpers/helperFunctions';
import {validLoginUser} from '../controllers/DB/login.controller';
import {insertUser} from '../controllers/DB/signup.controller';
import {AppError} from '../interfaces/index.interfaces';

export default {
  authCallback: async (req: any, res: Response, next: NextFunction) => {
    try {
      req.session.token = req.user.token;
      res.redirect('/app/home');
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
          const token = {
            sub: isUser.userID,
            name: isUser.userName,
            avatar: 'n-1',
            verified: true,
          };
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
        const token = {
          sub: userID,
          name: profile.displayName,
          avatar: 'n-1',
          verified: true,
        };
        profile.token = token;
        resolved(profile);
      } catch (e) {
        reject(e);
      }
    });
  },

  verifyToken: async function (req: any, res: Response, next: NextFunction) {
    try {
      const cookieToken = req.session.token;
      if (cookieToken) {
        if (cookieToken.verified) {
          req.token = req.session.token;
          return next();
        } else {
          return res.redirect('/unverifiedEmail');
        }
      }
      res.redirect('/login');
    } catch (e) {
      res.redirect('/login');
    }
  },

  verifyUser: async function (req: any, res: Response, next: NextFunction) {
    try {
      const cookieToken = req.session.token;
      if (cookieToken) {
        req.token = req.session.token;
        return next();
      }
      res.redirect('/login');
    } catch (e) {
      res.redirect('/login');
    }
  },
};
