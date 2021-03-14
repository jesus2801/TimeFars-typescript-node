import {NextFunction, Request, Response} from 'express';
import {AppError} from '../../interfaces/index.interfaces';

export default {
  mainView: (err: AppError, req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).render('error', {
        title: 'TimeFars - Error',
      });
      err.report();
    } catch (e) {
      console.log(e);
    }
  },
};
