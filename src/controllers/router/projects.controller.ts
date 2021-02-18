import {Response, NextFunction} from 'express';
import Errors from '../../assets/errors';
import Helpers from '../../helpers/helperFunctions';
import {AppError} from '../../interfaces';
import {insertAction} from '../DB/functions';
import {
  createProject,
  deleteActivity,
  deleteProject,
  getProjects,
  getProjectTasks,
  insertActivity,
  insertProjectTask,
  updateActivity,
  updateProject,
} from '../DB/tasks.controller';

const colorRegex = new RegExp(/^\w{6}$/);

export default {
  getProjects: async (req: any, res: Response, next: NextFunction) => {
    try {
      const projects = await getProjects(req.token.sub);
      res.send(projects);
    } catch (e) {
      const err = new AppError(e, req, req.token.sub);
      return next(err);
    }
  },

  //--------------------------------------------------------------

  insertProject: async (req: any, res: Response, next: NextFunction) => {
    try {
      const projectID = await createProject(req.token.sub);
      res.json({projectID});
    } catch (e) {
      const err = new AppError(e, req, req.token.sub);
      return next(err);
    }
  },

  //--------------------------------------------------------------

  updateProject: async (req: any, res: Response, next: NextFunction) => {
    try {
      let {projectID, title, description, color} = req.body;
      projectID = parseInt(projectID);
      if (!colorRegex.test(color)) {
        Helpers.sendResponse(res, true, Errors.incognitoError);
        return;
      }
      await updateProject(req.token.sub, projectID, title, description, color);
      res.send();
    } catch (e) {
      const err = new AppError(e, req, req.token.sub);
      return next(err);
    }
  },

  //--------------------------------------------------------------

  deleteProject: async (req: any, res: Response, next: NextFunction) => {
    try {
      let {projectID} = req.params;
      projectID = parseInt(projectID);
      await deleteProject(req.token.sub, projectID);
      res.send();
    } catch (e) {
      const err = new AppError(e, req, req.token.sub);
      return next(err);
    }
  },

  //--------------------------------------------------------------

  getProjectTasks: async (req: any, res: Response, next: NextFunction) => {
    try {
      let {projectID} = req.params;
      const projectTasks = await getProjectTasks(req.token.sub, projectID);
      res.send(projectTasks);
    } catch (e) {
      const err = new AppError(e, req, req.token.sub);
      return next(err);
    }
  },

  //--------------------------------------------------------------

  insertProjectTask: async (req: any, res: Response, next: NextFunction) => {
    try {
      let {projectID, activity, color, importance, startDate, finalDate} = req.body;
      startDate = new Date(startDate);
      finalDate = new Date(finalDate);
      if (!colorRegex.test(color)) {
        Helpers.sendResponse(res, true, Errors.incognitoError);
        return;
      }
      const activityID = await insertActivity(
        req.token.sub,
        activity,
        color,
        importance,
        startDate,
        finalDate
      );
      const id = await insertProjectTask(projectID, activityID);
      res.json({id});
      insertAction(req.token.sub, 'insert', req.ip, req.url);
    } catch (e) {
      const err = new AppError(e, req, req.token.sub);
      return next(err);
    }
  },

  //--------------------------------------------------------------

  updateProjectTask: async (req: any, res: Response, next: NextFunction) => {
    try {
      let {activityID, activity, color, importance, startDate, finalDate} = req.body;
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
      res.send();
      insertAction(req.token.sub, 'update', req.ip, req.url);
    } catch (e) {
      const err = new AppError(e, req, req.token.sub);
      return next(err);
    }
  },

  //--------------------------------------------------------------

  deleteProjectTask: async (req: any, res: Response, next: NextFunction) => {
    try {
      let {activityID} = req.params;
      await deleteActivity(req.token.sub, activityID);
      res.send();
      insertAction(req.token.sub, 'done', req.ip, req.url);
    } catch (e) {
      const err = new AppError(e, req, req.token.sub);
      return next(err);
    }
  },
};
