import {NextFunction, Request, Response} from 'express';
import {AppError} from '../../interfaces';

export default {
  mainView: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).render('index', {
        title: 'TimeFars - Inicio',
      });
    } catch (e) {
      const err = new AppError(e, req);
      return next(err);
    }
  },
};
