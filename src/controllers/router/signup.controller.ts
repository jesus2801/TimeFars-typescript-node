import {NextFunction, Request, Response} from 'express';

import Validates from '../../helpers/validateFunctions';
import Helpers from '../../helpers/helperFunctions';
import {reportError} from '../../helpers/reportError';
import {insertUser} from '../DB/signup.controller';
import {sendMail} from '../../config/nodeMailer.setup';
import {AppError} from '../../interfaces/index.interfaces';
import Errors from '../../assets/errors';

export default {
  mainView: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).render('out/signup', {
        title: 'TimeFars - Registro',
        styles: [{style: `<link rel="stylesheet" href="/styles/loginSignup.min.css">`}],
        scripts: [
          {script: `<script src="//cdn.jsdelivr.net/npm/sweetalert2@10"></script>`},
          {script: `<script src="/js/dist/signup.js"></script>`},
        ],
      });
    } catch (e) {
      const err = new AppError(e, req);
      return next(err);
    }
  },

  postCtrl: async (req: any, res: Response, next: NextFunction) => {
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
      const token = {
        sub: userID,
        name,
        avatar: 'n-1',
        verified: false,
      };
      req.session.token = token;
      res.send({error: false});
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
