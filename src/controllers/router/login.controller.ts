import { NextFunction, Request, Response } from 'express';

import Helpers from '../../helpers/helperFunctions';
import Validates from '../../helpers/validateFunctions';
import { validLoginUser } from '../DB/login.controller';
import { AppError } from '../../interfaces/index.interfaces';
import Errors from '../../assets/errors';

export default {
  mainView: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).render('out/login', {
        title: 'TimeFars - Ingresar',
        styles: [
          {
            style: `<link rel="stylesheet" href="/styles/loginSignup.min.css">`,
          },
        ],
        scripts: [
          {
            script: `<script src="//cdn.jsdelivr.net/npm/sweetalert2@10"></script>`,
          },
          { script: `<script src="/js/dist/login.js"></script>` },
        ],
      });
    } catch (e) {
      const err = new AppError(e, req);
      return next(err);
    }
  },

  postCtrl: async (req: any, res: Response, next: NextFunction) => {
    try {
      let { mail, pass } = req.body;
      if (!Validates.validEmail(mail)) {
        Helpers.sendResponse(res, true, Errors.invalidField('Correo'));
        return;
      }

      const isValidUser: any = await validLoginUser(mail, pass);
      if (isValidUser) {
        const verified =
          Object.values(isValidUser.verified)[0] == 1 ? true : false;
        const token = {
          sub: isValidUser.userID,
          name: isValidUser.userName,
          avatar: 'n-1',
          verified: verified,
        };

        req.session.token = token;
        res.send({ error: false });
        return;
      }
      Helpers.sendResponse(res, true, Errors.invalidCredentials);
    } catch (e) {
      const err = new AppError(e, req);
      return next(err);
    }
  },
};
