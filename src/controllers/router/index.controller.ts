import {Request, Response} from 'express';
import {reportError} from '../../helpers/reportError';

export const mainView = (req: Request, res: Response) => {
  try {
    res.render('index', {
      title: 'TimeFars - Inicio',
    });
  } catch (e) {
    res.redirect('/err');
    reportError(e, req.ip, req.url);
  }
};
