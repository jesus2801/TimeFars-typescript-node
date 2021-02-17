import {Response} from 'express';
import {sendResponse} from '../../helpers/helperFunctions';
import {reportError} from '../../helpers/reportError';
import {TaskDB} from '../../interfaces/tasks';
import {insertAction} from '../DB/functions';
import {
  getTasks,
  insertActivity,
  insertTask,
  updateActivity,
  deleteActivity,
  createProject,
  insertProjectTask,
} from '../DB/tasks.controller';
const colorRegex = new RegExp(/^\w{6}$/);

export const mainView = (req: any, res: Response) => {
  try {
    res.status(200).render('app/tasks', {
      title: 'TimeFars - Tasks',
    });
  } catch (e) {
    res.redirect('/err');
    reportError(e, req.ip, req.url, req.token.sub);
  }
};

//--------------------------------------------------------------
//--------------------------------------------------------------

export const getTasksCtrl = async (req: any, res: Response) => {
  try {
    const tasks: TaskDB = await getTasks(req.token.sub);
    res.send(tasks);
  } catch (e) {
    res.redirect('/err');
    reportError(e, req.ip, req.url, req.token.sub);
  }
};

//--------------------------------------------------------------
//--------------------------------------------------------------

export const insertTaskCtrl = async (req: any, res: Response) => {
  try {
    let {activity, color, importance, startDate, finalDate} = req.body;
    activity = activity.trim();
    color = color.trim();
    importance = importance.trim();
    startDate = new Date(startDate.trim());
    finalDate = new Date(finalDate.trim());
    if (activity === '' || color === '' || importance === '') {
      sendResponse(res, true, 'Porfavor, rellene todos los campos correctamente.');
      return;
    }
    if (!colorRegex.test(color)) {
      sendResponse(res, true, 'Lo sentimos ha ocurrido un error, vuelve a intentarlo.');
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
    sendResponse(res, false, '');
    insertAction(req.token.sub, 'insert', req.ip, req.url);
  } catch (e) {
    sendResponse(res, true, 'Lo sentimos ha ocurrido un error, vuelve a intentarlo.');
    reportError(e, req.ip, req.url, req.token.sub);
  }
};

//--------------------------------------------------------------
//--------------------------------------------------------------

export const updateTaskCtrl = async (req: any, res: Response) => {
  try {
    let {activityID, activity, color, importance, startDate, finalDate} = req.body;
    activityID = parseInt(activityID);
    activity = activity.trim();
    color = color.trim();
    importance = importance.trim();
    startDate = new Date(startDate.trim());
    finalDate = new Date(finalDate.trim());
    if (activity === '' || color === '' || importance === '') {
      sendResponse(res, true, 'Porfavor, rellene todos los campos correctamente.');
      return;
    }
    if (!colorRegex.test(color)) {
      sendResponse(res, true, 'Lo sentimos ha ocurrido un error, vuelve a intentarlo.');
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
    sendResponse(res, false, '');
    insertAction(req.token.sub, 'update', req.ip, req.url);
  } catch (e) {
    res.redirect('/err');
    reportError(e, req.ip, req.url, req.token.sub);
  }
};

//--------------------------------------------------------------
//--------------------------------------------------------------

export const deleteTaskCtrl = async (req: any, res: Response) => {
  try {
    let {activityID} = req.params;
    await deleteActivity(req.token.sub, activityID);
    sendResponse(res, false, '');
    insertAction(req.token.sub, 'delete', req.ip, req.url);
  } catch (e) {
    res.redirect('/err');
    reportError(e, req.ip, req.url, req.token.sub);
  }
};

//--------------------------------------------------------------
//--------------------------------------------------------------

export const insertProjectCtrl = async (req: any, res: Response) => {
  try {
    const projectID = await createProject(req.token.sub);
    res.json({projectID});
  } catch (e) {
    res.redirect('/err');
    reportError(e, req.ip, req.url, req.token.sub);
  }
};

//--------------------------------------------------------------
//--------------------------------------------------------------

export const insertProjectTaskCtrl = async (req: any, res: Response) => {
  try {
    let {projectID, activity, color, importance, startDate, finalDate} = req.body;
    activity = activity.trim();
    color = color.trim();
    importance = importance.trim();
    startDate = new Date(startDate.trim());
    finalDate = new Date(finalDate.trim());
    if (activity === '' || color === '' || importance === '') {
      sendResponse(res, true, 'Porfavor, rellene todos los campos correctamente.');
      return;
    }

    if (!colorRegex.test(color)) {
      sendResponse(res, true, 'Lo sentimos ha ocurrido un error, vuelve a intentarlo.');
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
    res.redirect('/err');
    reportError(e, req.ip, req.url, req.token.sub);
  }
};

//--------------------------------------------------------------
//--------------------------------------------------------------

export const getProjectsCtrl = async (req: any, res: Response) => {
  try {
    let {} = req.body;
    res.send();
    insertAction(req.token.sub, 'done', req.ip, req.url);
  } catch (e) {
    res.redirect('/err');
    reportError(e, req.ip, req.url, req.token.sub);
  }
};

//--------------------------------------------------------------
//--------------------------------------------------------------

export const updateProjectCtrl = async (req: any, res: Response) => {
  try {
    let {} = req.body;
    res.send();
    insertAction(req.token.sub, 'done', req.ip, req.url);
  } catch (e) {
    res.redirect('/err');
    reportError(e, req.ip, req.url, req.token.sub);
  }
};

//--------------------------------------------------------------
//--------------------------------------------------------------

export const deleteProjectCtrl = async (req: any, res: Response) => {
  try {
    let {} = req.body;
    res.send();
    insertAction(req.token.sub, 'done', req.ip, req.url);
  } catch (e) {
    res.redirect('/err');
    reportError(e, req.ip, req.url, req.token.sub);
  }
};

//--------------------------------------------------------------
//--------------------------------------------------------------

export const getProjectTasksCtrl = async (req: any, res: Response) => {
  try {
    let {} = req.body;
    res.send();
    insertAction(req.token.sub, 'done', req.ip, req.url);
  } catch (e) {
    res.redirect('/err');
    reportError(e, req.ip, req.url, req.token.sub);
  }
};

//--------------------------------------------------------------
//--------------------------------------------------------------

export const updateProjectTaskCtrl = async (req: any, res: Response) => {
  try {
    let {} = req.body;
    res.send();
    insertAction(req.token.sub, 'done', req.ip, req.url);
  } catch (e) {
    res.redirect('/err');
    reportError(e, req.ip, req.url, req.token.sub);
  }
};

//--------------------------------------------------------------
//--------------------------------------------------------------

export const deleteProjectTaskCtrl = async (req: any, res: Response) => {
  try {
    let {} = req.body;
    res.send();
    insertAction(req.token.sub, 'done', req.ip, req.url);
  } catch (e) {
    res.redirect('/err');
    reportError(e, req.ip, req.url, req.token.sub);
  }
};

//--------------------------------------------------------------
//--------------------------------------------------------------

export const getRoutineTasksCtrl = async (req: any, res: Response) => {
  try {
    let {} = req.body;
    res.send();
    insertAction(req.token.sub, 'done', req.ip, req.url);
  } catch (e) {
    res.redirect('/err');
    reportError(e, req.ip, req.url, req.token.sub);
  }
};

//--------------------------------------------------------------
//--------------------------------------------------------------

export const createRoutineTaskCtrl = async (req: any, res: Response) => {
  try {
    let {} = req.body;
    res.send();
    insertAction(req.token.sub, 'done', req.ip, req.url);
  } catch (e) {
    res.redirect('/err');
    reportError(e, req.ip, req.url, req.token.sub);
  }
};

//--------------------------------------------------------------
//--------------------------------------------------------------

export const updateRoutineTaskCtrl = async (req: any, res: Response) => {
  try {
    let {} = req.body;
    res.send();
    insertAction(req.token.sub, 'done', req.ip, req.url);
  } catch (e) {
    res.redirect('/err');
    reportError(e, req.ip, req.url, req.token.sub);
  }
};

//--------------------------------------------------------------
//--------------------------------------------------------------

export const deleteRoutineTaskCtrl = async (req: any, res: Response) => {
  try {
    let {} = req.body;
    res.send();
    insertAction(req.token.sub, 'done', req.ip, req.url);
  } catch (e) {
    res.redirect('/err');
    reportError(e, req.ip, req.url, req.token.sub);
  }
};

//--------------------------------------------------------------
//--------------------------------------------------------------

export const getRoutinesCtrl = async (req: any, res: Response) => {
  try {
    let {} = req.body;
    res.send();
    insertAction(req.token.sub, 'done', req.ip, req.url);
  } catch (e) {
    res.redirect('/err');
    reportError(e, req.ip, req.url, req.token.sub);
  }
};

//--------------------------------------------------------------
//--------------------------------------------------------------

export const createRoutineCtrl = async (req: any, res: Response) => {
  try {
    let {} = req.body;
    res.send();
    insertAction(req.token.sub, 'done', req.ip, req.url);
  } catch (e) {
    res.redirect('/err');
    reportError(e, req.ip, req.url, req.token.sub);
  }
};

//--------------------------------------------------------------
//--------------------------------------------------------------

export const updateRoutineCtrl = async (req: any, res: Response) => {
  try {
    let {} = req.body;
    res.send();
    insertAction(req.token.sub, 'done', req.ip, req.url);
  } catch (e) {
    res.redirect('/err');
    reportError(e, req.ip, req.url, req.token.sub);
  }
};

//--------------------------------------------------------------
//--------------------------------------------------------------

export const deleteRoutineCtrl = async (req: any, res: Response) => {
  try {
    let {} = req.body;
    res.send();
    insertAction(req.token.sub, 'done', req.ip, req.url);
  } catch (e) {
    res.redirect('/err');
    reportError(e, req.ip, req.url, req.token.sub);
  }
};

//--------------------------------------------------------------
//--------------------------------------------------------------

// export const updateRoutineCtrl = async (req: any, res: Response) => {
//   try {
//     let {} = req.body;
//     res.send();
//     insertAction(req.token.sub, 'done', req.ip, req.url);
//   } catch (e) {
//     res.redirect('/err');
//     reportError(e, req.ip, req.url, req.token.sub);
//   }
// };
