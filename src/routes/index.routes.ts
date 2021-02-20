import {NextFunction, Router} from 'express';
import passport from 'passport';

import {LoginSignupRateLimiter} from '../middlewares/rateLimiter';
import SignupCtrl from '../controllers/router/signup.controller';
import IndexCtrl from '../controllers/router/index.controller';
import LoginCtrl from '../controllers/router/login.controller';
import AuthCtrl from '../controllers/router/auth.controller';
import ValidateMW from '../middlewares/validate';
import {AppError} from '../interfaces/index.interfaces';
import Auth from '../middlewares/auth';

const router: Router = Router();

router
  .route('/login')
  .get(LoginCtrl.mainView)
  .post(LoginSignupRateLimiter, ValidateMW.emptyField, LoginCtrl.postCtrl);
router
  .route('/signup')
  .get(SignupCtrl.mainView)
  .post(LoginSignupRateLimiter, ValidateMW.emptyField, SignupCtrl.postCtrl);
router.get('/', IndexCtrl.mainView);
router.get(
  '/auth/google',
  passport.authenticate('google', {scope: ['profile', 'email']})
);
router.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));

router.get(
  '/auth/google/callback',
  passport.authenticate('google', {failureRedirect: '/err'}),
  Auth.authCallback
);

router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', {failureRedirect: '/err'}),
  Auth.authCallback
);

router.get('/logout', Auth.verifyToken, AuthCtrl.logout);

router.get('/verifyEmail/:code', Auth.verifyUser, AuthCtrl.verifyEmail);

router.get('/unverifiedEmail', Auth.verifyUser, AuthCtrl.unverifiedEmail);

router.post('/resendEmail', Auth.verifyUser, AuthCtrl.resendEmail);

router.get('/pulse', (req: any, res: any, next: NextFunction) => {
  const error = new AppError(new Error('mi error jsjs'), req);
  return next(error);
});

export default router;
