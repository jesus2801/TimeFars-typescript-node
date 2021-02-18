import {NextFunction, Response} from 'express';

import Helpers from '../../helpers/helperFunctions';
import {TaskDB} from '../../interfaces/tasks';
import {insertAction} from '../DB/functions';
import {AppError} from '../../interfaces';
import Errors from '../../assets/errors';
import {
  getTasks,
  insertActivity,
  insertTask,
  updateActivity,
  deleteActivity,
} from '../DB/tasks.controller';

const colorRegex = new RegExp(/^\w{6}$/);

export default {
  mainView: (req: any, res: Response, next: NextFunction) => {
    try {
      res.status(200).render('app/tasks', {
        title: 'TimeFars - Tasks',
      });
    } catch (e) {
      const err = new AppError(e, req, req.token.sub);
      return next(err);
    }
  },

  //--------------------------------------------------------------

  getTasks: async (req: any, res: Response, next: NextFunction) => {
    try {
      const tasks: TaskDB = await getTasks(req.token.sub);
      res.send(tasks);
    } catch (e) {
      const err = new AppError(e, req, req.token.sub);
      return next(err);
    }
  },

  //--------------------------------------------------------------

  insertTask: async (req: any, res: Response, next: NextFunction) => {
    try {
      let {activity, color, importance, startDate, finalDate} = req.body;
      startDate = new Date(startDate);
      finalDate = new Date(finalDate);
      if (!colorRegex.test(color)) {
        Helpers.sendResponse(res, true, Errors.incognitoError);
        return;
      }
      const insertId = await insertActivity(
        req.token.sub,
        activity,
        color,
        importance,
        startDate,
        finalDate
      );
      await insertTask(insertId, new Date());
      Helpers.sendResponse(res, false, '');
      insertAction(req.token.sub, 'insert', req.ip, req.url);
    } catch (e) {
      const err = new AppError(e, req, req.token.sub);
      return next(err);
    }
  },

  //--------------------------------------------------------------

  updateTask: async (req: any, res: Response, next: NextFunction) => {
    try {
      let {activityID, activity, color, importance, startDate, finalDate} = req.body;
      activityID = parseInt(activityID);
      startDate = new Date(startDate);
      finalDate = new Date(finalDate);
      if (!colorRegex.test(color)) {
        Helpers.sendResponse(res, true, Errors.incognitoError);
        return;
      }
      await updateActivity(
        req.token.sub,
        activityID,
        activity,
        color,
        importance,
        startDate,
        finalDate
      );
      Helpers.sendResponse(res, false, '');
      insertAction(req.token.sub, 'update', req.ip, req.url);
    } catch (e) {
      const err = new AppError(e, req, req.token.sub);
      return next(err);
    }
  },

  //--------------------------------------------------------------

  deleteTask: async (req: any, res: Response, next: NextFunction) => {
    try {
      let {activityID} = req.params;
      activityID = parseInt(activityID);
      await deleteActivity(req.token.sub, activityID);
      Helpers.sendResponse(res, false, '');
      insertAction(req.token.sub, 'delete', req.ip, req.url);
    } catch (e) {
      const err = new AppError(e, req, req.token.sub);
      return next(err);
    }
  },
};
