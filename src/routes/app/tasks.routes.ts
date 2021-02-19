import {Router} from 'express';
import ProjectsCtrl from '../../controllers/router/projects.controller';
import RoutinesCtrl from '../../controllers/router/routines.controller';
import TaskCtrl from '../../controllers/router/tasks.controller';
import Auth from '../../middlewares/auth';
import ValidateMW from '../../middlewares/validate';

const router: Router = Router();

router.get('/', Auth.verifyToken, TaskCtrl.mainView);

router.post('/getTasks', Auth.verifyToken, TaskCtrl.getTasks);
router.post('/add', ValidateMW.emptyField, Auth.verifyToken, TaskCtrl.insertTask);
router.put('/update', ValidateMW.emptyField, Auth.verifyToken, TaskCtrl.updateTask);
router.delete('/delete/:activityID', Auth.verifyToken, TaskCtrl.deleteTask);

router.post('/getProjects', Auth.verifyToken, ProjectsCtrl.getProjects);
router.post('/createProject', Auth.verifyToken, ProjectsCtrl.insertProject);
router.put(
  '/updateProject',
  ValidateMW.emptyField,
  Auth.verifyToken,
  ProjectsCtrl.updateProject
);
router.delete('/deleteProject/:projectID', Auth.verifyToken, ProjectsCtrl.deleteProject);

router.post(
  '/getProjectTasks/:projectID',
  Auth.verifyToken,
  ProjectsCtrl.getProjectTasks
);
router.post(
  '/createProjectTask',
  ValidateMW.emptyField,
  Auth.verifyToken,
  ProjectsCtrl.insertProjectTask
);
router.put(
  '/updateProjectTask',
  ValidateMW.emptyField,
  Auth.verifyToken,
  ProjectsCtrl.updateProjectTask
);
router.delete(
  '/deleteProjectTask/:activityID',
  Auth.verifyToken,
  ProjectsCtrl.deleteProjectTask
);

router.post(
  '/getRoutineTasks/:routineID',
  Auth.verifyToken,
  RoutinesCtrl.getRoutineTasks
);
router.post(
  '/createRoutineTask',
  ValidateMW.emptyField,
  Auth.verifyToken,
  RoutinesCtrl.createRoutineTask
);
router.put(
  '/updateRoutineTask',
  ValidateMW.emptyField,
  Auth.verifyToken,
  RoutinesCtrl.updateRoutineTask
);
router.delete(
  '/deleteRoutineTask/:activityID',
  Auth.verifyToken,
  RoutinesCtrl.deleteRoutineTask
);

router.post('/getRoutines', Auth.verifyToken, RoutinesCtrl.getRoutines);
router.post('/createRoutine', Auth.verifyToken, RoutinesCtrl.createRoutine);
router.put(
  '/updateRoutine',
  ValidateMW.emptyField,
  Auth.verifyToken,
  RoutinesCtrl.updateRoutine
);
router.delete('/deleteRoutine/:routineID', Auth.verifyToken, RoutinesCtrl.deleteRoutine);

export default router;
