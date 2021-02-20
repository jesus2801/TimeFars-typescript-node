import {Response, NextFunction} from 'express';

import {AppError} from '../../interfaces/index.interfaces';
import ProjectsDBCtrl from '../DB/projects.controller';
import Helpers from '../../helpers/helperFunctions';
import TasksDBCtrl from '../DB/tasks.controller';
import DBFunctions from '../DB/functions';
import Errors from '../../assets/errors';
import {colorRegex} from '../../helpers/helperVariables';

export default {
  getProjects: async (req: any, res: Response, next: NextFunction) => {
    try {
      const projects = await ProjectsDBCtrl.getProjects(req.token.sub);
      res.send(projects);
    } catch (e) {
      const err = new AppError(e, req, req.token.sub);
      return next(err);
    }
  },

  //--------------------------------------------------------------

  insertProject: async (req: any, res: Response, next: NextFunction) => {
    try {
      const projectID = await ProjectsDBCtrl.createProject(req.token.sub);
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
      await ProjectsDBCtrl.updateProject(
        req.token.sub,
        projectID,
        title,
        description,
        color
      );
      res.send({error: false});
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
      await ProjectsDBCtrl.deleteProject(req.token.sub, projectID);
      res.send({error: false});
    } catch (e) {
      const err = new AppError(e, req, req.token.sub);
      return next(err);
    }
  },

  //--------------------------------------------------------------

  getProjectTasks: async (req: any, res: Response, next: NextFunction) => {
    try {
      let {projectID} = req.params;
      const projectTasks = await ProjectsDBCtrl.getProjectTasks(req.token.sub, projectID);
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
      const activityID = await TasksDBCtrl.insertActivity(
        req.token.sub,
        activity,
        color,
        importance,
        startDate,
        finalDate
      );
      const id = await ProjectsDBCtrl.insertProjectTask(projectID, activityID);
      res.json({id});
      DBFunctions.insertAction(req.token.sub, 'insert', req.ip, req.url);
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
      startDate = new Date(startDate);
      finalDate = new Date(finalDate);
      await TasksDBCtrl.updateActivity(
        req.token.sub,
        activityID,
        activity,
        color,
        importance,
        startDate,
        finalDate
      );
      res.send({error: false});
      DBFunctions.insertAction(req.token.sub, 'update', req.ip, req.url);
    } catch (e) {
      const err = new AppError(e, req, req.token.sub);
      return next(err);
    }
  },

  //--------------------------------------------------------------

  deleteProjectTask: async (req: any, res: Response, next: NextFunction) => {
    try {
      let {activityID} = req.params;
      await TasksDBCtrl.deleteActivity(req.token.sub, activityID);
      res.send({error: false});
      DBFunctions.insertAction(req.token.sub, 'done', req.ip, req.url);
    } catch (e) {
      const err = new AppError(e, req, req.token.sub);
      return next(err);
    }
  },
};
