import {Request, Response} from 'express';
import {reportError} from '../../helpers/reportError';

export const mainView = (req: Request, res: Response) => {
  try {
    res.render('404', {
      title: 'TimeFars - 404',
    });
  } catch (e) {
    res.redirect('/err');
    reportError(e, req.ip, req.url);
  }
};