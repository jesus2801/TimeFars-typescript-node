import express from 'express';
import {
  deleteTaskCtrl,
  getTasksCtrl,
  insertProjectCtrl,
  insertTaskCtrl,
  mainView,
  updateTaskCtrl,
  insertProjectTaskCtrl,
  getProjectsCtrl,
  updateProjectCtrl,
  deleteProjectCtrl,
  getProjectTasksCtrl,
  updateProjectTaskCtrl,
  getRoutineTasksCtrl,
  createRoutineTaskCtrl,
  updateRoutineTaskCtrl,
  deleteRoutineTaskCtrl,
  getRoutinesCtrl,
  createRoutineCtrl,
  updateRoutineCtrl,
  deleteRoutineCtrl,
} from '../../controllers/router/tasks.controller';
import {verifyToken} from '../../helpers/helperFunctions';
const router = express.Router();

router.get('/', verifyToken, mainView);

router.post('/getTasks', verifyToken, getTasksCtrl);
router.post('/add', verifyToken, insertTaskCtrl);
router.put('/update', verifyToken, updateTaskCtrl);
router.delete('/delete/:activityID', verifyToken, deleteTaskCtrl);

router.post('/getProjects', verifyToken, getProjectsCtrl);
router.post('/createProject', verifyToken, insertProjectCtrl);
router.put('/updateProject', verifyToken, updateProjectCtrl);
router.delete('/deleteProject', verifyToken, deleteProjectCtrl);

router.post('/getProjectTasks', verifyToken, getProjectTasksCtrl);
router.post('/createProjectTask', verifyToken, insertProjectTaskCtrl);
router.put('/updateProjectTask', verifyToken, updateProjectTaskCtrl);
router.delete('/deleteProjectTask', verifyToken);

router.post('/getRoutineTasks', verifyToken, getRoutineTasksCtrl);
router.post('/createRoutineTask', verifyToken, createRoutineTaskCtrl);
router.put('/updateRoutineTask', verifyToken, updateRoutineTaskCtrl);
router.delete('/deleteRoutineTask', verifyToken, deleteRoutineTaskCtrl);

router.post('/getRoutines', verifyToken, getRoutinesCtrl);
router.post('/createRoutine', verifyToken, createRoutineCtrl);
router.put('/updateRoutine', verifyToken, updateRoutineCtrl);
router.delete('/deleteRoutine', verifyToken, deleteRoutineCtrl);

module.exports = router;
