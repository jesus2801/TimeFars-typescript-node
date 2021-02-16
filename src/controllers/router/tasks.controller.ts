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
} from '../DB/tasks.controller';

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

export const getTasksCtrl = async (req: any, res: Response) => {
  try {
    const tasks: TaskDB = await getTasks(req.token.sub);
    res.send(tasks);
  } catch (e) {
    res.redirect('/err');
    reportError(e, req.ip, req.url, req.token.sub);
  }
};
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
    const colorRegex = new RegExp(/^\w{6}$/);
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
    const colorRegex = new RegExp(/^\w{6}$/);
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

export const deleteTaskCtrl = (req: any, res: Response) => {
  try {
    res.send();
    insertAction(req.token.sub, 'done', req.ip, req.url);
  } catch (e) {
    res.redirect('/err');
    reportError(e, req.ip, req.url, req.token.sub);
  }
};

// export const ctrlName = (req: any, res: Response) => {
//   try {
//     res.send();
//     insertAction(req.token.sub, 'done', req.ip, req.url);
//   } catch (e) {
//     res.redirect('/err');
//     reportError(e, req.ip, req.url, req.token.sub);
//   }
// };
