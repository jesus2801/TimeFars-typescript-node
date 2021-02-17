import {Response} from 'express';
import jwt from 'jsonwebtoken';
import {secretKey} from '../../config';
import {generateCode, generateEmailHTML, hashPass} from '../../helpers/helperFunctions';
import {reportError} from '../../helpers/reportError';
import {sendMail} from '../../nodeMailer.setup';
import {getCode, getEmail, validateEmailDB} from '../DB/auth.controller';
import {validLoginUser} from '../DB/login.controller';
import {insertUser} from '../DB/signup.controller';

export const authCallback = async (req: any, res: Response) => {
  try {
    res.cookie('token', req.user.token, {
      httpOnly: true,
      expires: new Date(Date.now() + 86400000),
    });
    res.redirect('/home');
  } catch (e) {
    res.redirect('/err');
    reportError(e, req.ip, req.url);
  }
};

export const unverifiedEmailCtrl = async (req: any, res: Response) => {
  try {
    const email = await getEmail(req.token.sub);
    res.render('app/unverifiedEmail', {
      title: 'TimeFars - Verificar Correo',
      email,
    });
  } catch (e) {
    res.redirect('/err');
    reportError(e, req.ip, req.url, req.token.sub);
  }
};

export const resendEmailCtrl = async (req: any, res: Response) => {
  let responses: any = {};
  getEmail(req.token.sub)
    .then(response => {
      responses.mail = response;
      if (Object.keys(responses).length === 2) {
        sendMail(
          responses.mail,
          'verificar correo TimeFars',
          generateEmailHTML(req.token.name, responses.code)
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
          generateEmailHTML(req.token.name, responses.code)
        );
      }
    })
    .catch(reportErr);

  function reportErr(e: any) {
    res.redirect('/err');
    reportError(e, req.ip, req.url, req.token.sub);
  }
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
          {expiresIn: '2d'}
        );
        profile.token = token;
        resolved(profile);
        return;
      }
      const hash: string = await hashPass(id);
      const code: string = generateCode();
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
        secretKey,
        {expiresIn: '2d'}
      );
      profile.token = token;
      resolved(profile);
      await sendMail(
        profile._json.email,
        'verificar correo TimeFars',
        generateEmailHTML(profile.displayName, code)
      );
    } catch (e) {
      reject(e);
    }
  });
}

export const verifyEmailCtrl = async (req: any, res: Response) => {
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
      secretKey,
      {expiresIn: '2d'}
    );
    res.cookie('token', newToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 86400000),
    });
    res.redirect('/home');
  } catch (e) {
    res.redirect('/err');
    reportError(e, req.ip, req.url, req.name);
  }
};

export const logoutCtrl = (req: any, res: Response) => {
  try {
    res.clearCookie('token');
    res.redirect('/');
  } catch (e) {
    res.redirect('/err');
    reportError(e, req.ip, req.url, req.name);
  }
};
