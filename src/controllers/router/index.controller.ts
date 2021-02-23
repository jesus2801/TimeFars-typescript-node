import {NextFunction, Request, Response} from 'express';
import {AppError} from '../../interfaces/index.interfaces';

export default {
  mainView: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).render('index', {
        title: 'TimeFars - Inicio',
        styles: [{style: `<link rel="stylesheet" href="/styles/index.min.css">`}],
      });
    } catch (e) {
      const err = new AppError(e, req);
      return next(err);
    }
  },
};
