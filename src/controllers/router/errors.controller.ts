import {NextFunction, Request, Response} from 'express';
import {reportError} from '../../helpers/reportError';
import {AppError} from '../../interfaces/index.interfaces';

export default {
  mainView: (err: AppError, req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).render('error', {
        title: 'TimeFars - Error',
      });
      err.report();
    } catch (e) {
      //   reportError(e, req.ip, req.url);
      console.log(e);
    }
  },
};
