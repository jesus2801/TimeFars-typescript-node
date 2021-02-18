import {Router} from 'express';
import HomeCtrl from '../../controllers/router/home.controller';
import Auth from '../../middlewares/auth';

const router: Router = Router();

router.get('/home', Auth.verifyToken, HomeCtrl.mainView);

export default router;
