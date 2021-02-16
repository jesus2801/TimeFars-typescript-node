import express from 'express';
import {
  deleteTaskCtrl,
  getTasksCtrl,
  insertTaskCtrl,
  mainView,
  updateTaskCtrl,
} from '../../controllers/router/tasks.controller';
import {verifyToken} from '../../helpers/helperFunctions';
const router = express.Router();

router.get('/', verifyToken, mainView);
router.post('/getTasks', verifyToken, getTasksCtrl);
router.post('/add', verifyToken, insertTaskCtrl);
router.put('/update', verifyToken, updateTaskCtrl);
router.delete('/delete', verifyToken, deleteTaskCtrl);

module.exports = router;
