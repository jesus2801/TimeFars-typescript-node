import {Request, Response} from 'express';
import {reportError} from '../../helpers/reportError';

export const mainView = (req: Request, res: Response) => {
  try {
    res.status(200).render('app/home', {
      title: 'TimeFars - Home',
    });
  } catch (e) {
    res.redirect('/err');
    reportError(e, req.ip, req.url);
  }
};
