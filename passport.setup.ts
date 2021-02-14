import passport from 'passport';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import {Strategy as FacebookStrategy} from 'passport-facebook';
import {validLoginUser} from './src/controllers/DB/login.controller';
import {secretKey} from './src/config';
import jwt from 'jsonwebtoken';
import {insertUser} from './src/controllers/DB/signup.controller';
import {hashPass} from './src/helpers/helperFunctions';

passport.serializeUser(function (user: any, done) {
  done(null, user);
});


passport.deserializeUser(function (id: any, done) {
  done(null, id);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: 'http://localhost:4002/auth/google/callback',
    },
    async function (token: any, tokenSecret: any, profile: any, done: any) {
      try {
        const isUser: any = await validLoginUser(profile._json.email, profile._json.sub);
        if (isUser) {
          const token = jwt.sign(
            {
              sub: isUser.userID,
              name: isUser.userName,
              avatar: 'n-1',
            },
            secretKey,
            {expiresIn: '30h'}
          );
          profile.token = token;
          return done(null, profile);
        }
        const hash: string = await hashPass(profile._json.sub);
        const userID = await insertUser(profile.displayName, profile._json.email, hash);
        const token = jwt.sign(
          {
            sub: userID,
            name: profile.displayName,
            avatar: 'n-1',
          },
          secretKey,
          {expiresIn: '30h'}
        );
        profile.token = token;
        return done(null, profile);
      } catch (e) {
        return done(e, profile);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      callbackURL: 'http://localhost:4002/auth/facebook/callback',
      profileFields: ['emails', 'displayName'],
    },
    async function (accessToken, refreshToken, profile: any, done) {
      try {
        const isUser: any = await validLoginUser(profile._json.email, profile._json.id);
        if (isUser) {
          const token = jwt.sign(
            {
              sub: isUser.userID,
              name: isUser.userName,
              avatar: 'n-1',
            },
            secretKey,
            {expiresIn: '30h'}
          );
          profile.token = token;
          return done(null, profile);
        }
        const hash: string = await hashPass(profile._json.id);
        const userID = await insertUser(profile.displayName, profile._json.email, hash);
        const token = jwt.sign(
          {
            sub: userID,
            name: profile.displayName,
            avatar: 'n-1',
          },
          secretKey,
          {expiresIn: '30h'}
        );
        profile.token = token;
        return done(null, profile);
      } catch (e) {
        return done(e, profile);
      }
    }
  )
);
