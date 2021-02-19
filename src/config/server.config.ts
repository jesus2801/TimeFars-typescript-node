//nodejs modules
import express, {Application, urlencoded, json} from 'express';
import {initialize, session} from 'passport';
import expressSession from 'express-session';
import cookieParser from 'cookie-parser';
import exHbs from 'express-handlebars';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';

//modules
import ErrorsCtrl from '../controllers/router/errors.controller';
import NotFoundCtrl from '../controllers/router/404.controller';
import tasksRoutes from '../routes/app/tasks.routes';
import homeRoute from '../routes/app/home.routes';
import mainRoutes from '../routes/index.routes';
import config from './config';

const path = require('path');
require('./passport.setup');

export class App {
  private app: Application;
  constructor(private port?: number | string) {
    this.app = express();
    this.settings();
    this.middlewares();
    this.routes();
    this.extra();
  }
  settings() {
    this.app.set(`views`, path.join(__dirname, `../views`));
    this.app.set('port', process.env.PORT || this.port || 3000);
    this.app.set('view engine', '.hbs');
    if (process.env.STATE! != 'dev') {
      this.app.set('trust proxy', 1);
    }
    this.app.engine(
      '.hbs',
      exHbs({
        defaultLayout: 'main',
        layoutsDir: path.join(this.app.get('views'), 'layouts'),
        partialsDir: path.join(this.app.get('views'), 'partials'),
        extname: '.hbs',
        helpers: require('../lib/handlebars'),
      })
    );
  }
  middlewares() {
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(urlencoded({extended: false, limit: 5242880}));
    this.app.use(json({limit: 5242880}));
    this.app.use(cookieParser());
    this.app.use(
      expressSession({
        secret: process.env.EXPRESS_SESSION_SECRET!,
        resave: true,
        saveUninitialized: false,
        cookie: {secure: process.env.STATE! == 'dev' ? false : true, maxAge: 28800000},
      })
    );
    this.app.use(initialize()); //passport
    this.app.use(session()); //passport
    //---DEV---
    this.app.use(morgan('dev'));
    //---DEV---
  }
  routes() {
    this.app.use(mainRoutes);
    this.app.use(homeRoute);
    this.app.use('/tasks', tasksRoutes);
  }
  extra() {
    this.app.use(express.static(path.join(__dirname, '../public')));
    this.app.use(NotFoundCtrl.mainView);
    this.app.use(ErrorsCtrl.mainView);
  }
  async listen() {
    const server = await this.app.listen(this.app.get('port'));
    console.log(
      `server is running on port ${this.app.get('port')} and 
      host ${config.hostProtocol}${config.host}`
    );
    return server;
  }
}
