import {Response, NextFunction} from 'express';
import Errors from '../../assets/errors';
import Helpers from '../../helpers/helperFunctions';
import {AppError} from '../../interfaces';
import {insertAction} from '../DB/functions';
import {
  createRoutine,
  createRoutineTask,
  deleteRoutine,
  deleteRoutineTask,
  getRoutines,
  getRoutineTasks,
  updateRoutine,
  updateRoutineTask,
} from '../DB/tasks.controller';

const colorRegex = new RegExp(/^\w{6}$/);

export default {
  getRoutineTasks: async (req: any, res: Response, next: NextFunction) => {
    try {
      let {routineID} = req.params;
      getRoutineTasks(req.token.sub, routineID);
      res.send();
    } catch (e) {
      const err = new AppError(e, req, req.token.sub);
      return next(err);
    }
  },

  //--------------------------------------------------------------

  createRoutineTask: async (req: any, res: Response, next: NextFunction) => {
    try {
      let {routineID, activity, done, color, importance, startTime, finalTime} = req.body;
      routineID = parseInt(routineID);
      done = parseInt(done);
      startTime = new Date(startTime);
      finalTime = new Date(finalTime);
      if (!colorRegex.test(color)) {
        Helpers.sendResponse(res, true, Errors.incognitoError);
        return;
      }
      await createRoutineTask(
        routineID,
        activity,
        done,
        color,
        importance,
        startTime,
        finalTime
      );
      res.send();
      insertAction(req.token.sub, 'insert', req.ip, req.url);
    } catch (e) {
      const err = new AppError(e, req, req.token.sub);
      return next(err);
    }
  },

  //--------------------------------------------------------------

  updateRoutineTask: async (req: any, res: Response, next: NextFunction) => {
    try {
      let {
        daily_activityID,
        activity,
        done,
        color,
        importance,
        startTime,
        finalTime,
      } = req.body;
      daily_activityID = parseInt(daily_activityID);
      done = parseInt(done);
      startTime = new Date(startTime);
      finalTime = new Date(finalTime);
      if (!colorRegex.test(color)) {
        Helpers.sendResponse(res, true, Errors.incognitoError);
        return;
      }
      await updateRoutineTask(
        daily_activityID,
        activity,
        done,
        color,
        importance,
        startTime,
        finalTime
      );
      res.send();
      insertAction(req.token.sub, 'update', req.ip, req.url);
    } catch (e) {
      const err = new AppError(e, req, req.token.sub);
      return next(err);
    }
  },

  //--------------------------------------------------------------

  deleteRoutineTask: async (req: any, res: Response, next: NextFunction) => {
    try {
      let {activityID} = req.body;
      deleteRoutineTask(req.token.sub, activityID);
      res.send();
      insertAction(req.token.sub, 'delete', req.ip, req.url);
    } catch (e) {
      const err = new AppError(e, req, req.token.sub);
      return next(err);
    }
  },

  //--------------------------------------------------------------

  getRoutines: async (req: any, res: Response, next: NextFunction) => {
    try {
      const routines = await getRoutines(req.token.sub);
      res.send(routines);
    } catch (e) {
      const err = new AppError(e, req, req.token.sub);
      return next(err);
    }
  },

  //--------------------------------------------------------------

  createRoutine: async (req: any, res: Response, next: NextFunction) => {
    try {
      await createRoutine(req.token.sub);
      res.send();
    } catch (e) {
      const err = new AppError(e, req, req.token.sub);
      return next(err);
    }
  },

  //--------------------------------------------------------------

  updateRoutine: async (req: any, res: Response, next: NextFunction) => {
    try {
      let {routineID, title, description, active} = req.body;
      routineID = parseInt(routineID);
      active = parseInt(active);
      await updateRoutine(req.token.sub, routineID, title, description, active);
      res.send();
    } catch (e) {
      const err = new AppError(e, req, req.token.sub);
      return next(err);
    }
  },

  //--------------------------------------------------------------

  deleteRoutine: async (req: any, res: Response, next: NextFunction) => {
    try {
      let {routineID} = req.params;
      deleteRoutine(req.token.sub, routineID);
      res.send();
      insertAction(req.token.sub, 'delete', req.ip, req.url);
    } catch (e) {
      const err = new AppError(e, req, req.token.sub);
      return next(err);
    }
  },
};
