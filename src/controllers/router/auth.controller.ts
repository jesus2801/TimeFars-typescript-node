import {Response} from 'express';
import jwt from 'jsonwebtoken';
import {secretKey} from '../../config';
import {generateEmailHTML, hashPass} from '../../helpers/helperFunctions';
import {reportError} from '../../helpers/reportError';
import {sendMail} from '../../nodeMailer.setup';
import {getEmail} from '../DB/auth.controller';
import {validLoginUser} from '../DB/login.controller';
import {insertUser} from '../DB/signup.controller';

export const authCallback = async (req: any, res: Response) => {
  try {
    res.cookie('token', req.user.token, {httpOnly: true});
    res.redirect('/home');
  } catch (e) {
    res.redirect('/err');
    reportError(e, req.ip, req.url);
  }
};

export const unverifiedEmailCtrl = async (req: any, res: Response) => {
  try {
    res.render('app/unverifiedEmail');
  } catch (e) {
    res.redirect('/err');
    reportError(e, req.ip, req.url);
  }
  const email: string = await getEmail(req.token.sub);
  await sendMail(email, 'verificar correo TimeFars', generateEmailHTML(req.token.name));
};

export function authCtrl(profile: any, id: string) {
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
          secretKey,
          {expiresIn: '30h'}
        );
        profile.token = token;
        resolved(profile);
        return;
      }
      const hash: string = await hashPass(id);
      const userID = await insertUser(profile.displayName, profile._json.email, hash);
      const token = jwt.sign(
        {
          sub: userID,
          name: profile.displayName,
          avatar: 'n-1',
        },
        secretKey,
        {expiresIn: '30h'}
      );
      profile.token = token;
      resolved(profile);
    } catch (e) {
      reject(e);
    }
  });
}

export const verifyEmailCtrl = async (req: any, res: Response) => {
  try {
    const newToken = jwt.sign(
      {
        sub: req.token.sub,
        name: req.token.name,
        avatar: req.token.avatar,
        verified: true,
      },
      secretKey,
      {expiresIn: '30h'}
    );
    res.cookie('token', newToken, {httpOnly: true});
    res.redirect('/home');
  } catch (e) {
    res.redirect('/err');
    reportError(e, req.ip, req.url, req.name);
  }
};
