import { NextFunction, Response } from 'express';
import { AppError } from '../../interfaces/index.interfaces';

export default {
  mainView: (req: any, res: Response, next: NextFunction) => {
    try {
      res.status(200).render('app/home', {
        title: 'TimeFars - Home',
        name: req.token.name,
      });
    } catch (e) {
      const err = new AppError(e, req);
      return next(err);
    }
  },
};
