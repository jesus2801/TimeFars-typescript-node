import {Request, Response, NextFunction} from 'express';
import Validates from '../helpers/validateFunctions';
import Helpers from '../helpers/helperFunctions';
import Errors from '../assets/errors';

export default {
  emptyField: function (req: Request, res: Response, next: NextFunction) {
    //@ts-ignore
    if (Validates.isEmpty(...Object.values(req.body))) {
      Helpers.sendResponse(res, true, Errors.emptyField);
    }
    for (const property in req.body) {
      req.body[property] = property.trim();
    }
  },
};
