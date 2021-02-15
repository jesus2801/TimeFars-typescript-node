import express from 'express';
const router = express.Router();
import {mainView} from '../controllers/router/index.controller';
import {loginMainView, postLoginCtrl} from '../controllers/router/login.controller';
import {postSignupCtrl, signupMainView} from '../controllers/router/signup.controller';
import passport from 'passport';
import {authCallback, verifyEmailCtrl} from '../controllers/router/auth.controller';
import {verifyUser} from '../helpers/helperFunctions';

router.route('/login').get(loginMainView).post(postLoginCtrl);
router.route('/signup').get(signupMainView).post(postSignupCtrl);
router.get('/', mainView);
router.get(
  '/auth/google',
  passport.authenticate('google', {scope: ['profile', 'email']})
);
router.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));

router.get(
  '/auth/google/callback',
  passport.authenticate('google', {failureRedirect: '/err'}),
  authCallback
);

router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', {failureRedirect: '/err'}),
  authCallback
);

router.get('/verifyEmail', verifyUser, verifyEmailCtrl);

router.get('unverifiedEmail', verifyUser, );

module.exports = router;
