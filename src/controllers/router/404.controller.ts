import {NextFunction, Request, Response} from 'express';
import {AppError} from '../../interfaces/index.interfaces';

export default {
  mainView: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(404).render('404', {
        title: 'TimeFars - 404',
        styles: [{style: `<link rel="stylesheet" href="/styles/404.min.css">`}],
      });
    } catch (e) {
      const err = new AppError(e, req);
      return next(err);
    }
  },
};
