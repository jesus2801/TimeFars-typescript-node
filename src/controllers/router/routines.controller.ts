import {Response, NextFunction} from 'express';

import {AppError} from '../../interfaces/index.interfaces';
import RoutinesDBCtrl from '../DB/routines.controller';
import Helpers from '../../helpers/helperFunctions';
import DBFunctions from '../DB/functions';
import Errors from '../../assets/errors';
import {colorRegex} from '../../helpers/helperVariables';

export default {
  getRoutineTasks: async (req: any, res: Response, next: NextFunction) => {
    try {
      let {routineID} = req.params;
      const tasks = await RoutinesDBCtrl.getRoutineTasks(req.token.sub, routineID);
      res.send(tasks);
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
      if (!colorRegex.test(color)) {
        Helpers.sendResponse(res, true, Errors.incognitoError);
        return;
      }
      await RoutinesDBCtrl.createRoutineTask(
        routineID,
        activity,
        done,
        color,
        importance,
        startTime,
        finalTime
      );
      res.send({error: false});
      DBFunctions.insertAction(req.token.sub, 'insert', req.ip, req.url);
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
      await RoutinesDBCtrl.updateRoutineTask(
        daily_activityID,
        activity,
        done,
        color,
        importance,
        startTime,
        finalTime
      );
      res.send({error: false});
      DBFunctions.insertAction(req.token.sub, 'update', req.ip, req.url);
    } catch (e) {
      const err = new AppError(e, req, req.token.sub);
      return next(err);
    }
  },

  //--------------------------------------------------------------

  deleteRoutineTask: async (req: any, res: Response, next: NextFunction) => {
    try {
      let {activityID} = req.params;
      RoutinesDBCtrl.deleteRoutineTask(req.token.sub, activityID);
      res.send({error: false});
      DBFunctions.insertAction(req.token.sub, 'delete', req.ip, req.url);
    } catch (e) {
      const err = new AppError(e, req, req.token.sub);
      return next(err);
    }
  },

  //--------------------------------------------------------------

  getRoutines: async (req: any, res: Response, next: NextFunction) => {
    try {
      const routines = await RoutinesDBCtrl.getRoutines(req.token.sub);
      res.send(routines);
    } catch (e) {
      const err = new AppError(e, req, req.token.sub);
      return next(err);
    }
  },

  //--------------------------------------------------------------

  createRoutine: async (req: any, res: Response, next: NextFunction) => {
    try {
      await RoutinesDBCtrl.createRoutine(req.token.sub);
      res.send({error: false});
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
      await RoutinesDBCtrl.updateRoutine(
        req.token.sub,
        routineID,
        title,
        description,
        active
      );
      res.send({error: false});
    } catch (e) {
      const err = new AppError(e, req, req.token.sub);
      return next(err);
    }
  },

  //--------------------------------------------------------------

  deleteRoutine: async (req: any, res: Response, next: NextFunction) => {
    try {
      let {routineID} = req.params;
      RoutinesDBCtrl.deleteRoutine(req.token.sub, routineID);
      res.send({error: false});
      DBFunctions.insertAction(req.token.sub, 'delete', req.ip, req.url);
    } catch (e) {
      const err = new AppError(e, req, req.token.sub);
      return next(err);
    }
  },
};
