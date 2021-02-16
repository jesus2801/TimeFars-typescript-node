import express, {Application, Request, Response} from 'express';
import {initialize, session} from 'passport';
import cookieSession from 'cookie-session';
import exHbs from 'express-handlebars';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import {mainView} from './controllers/router/404.controller';
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
    this.app.set(`views`, path.join(__dirname, `views`));
    this.app.set('port', process.env.PORT || this.port || 3000);
    this.app.set('view engine', '.hbs');
    this.app.engine(
      '.hbs',
      exHbs({
        defaultLayout: 'main',
        layoutsDir: path.join(this.app.get('views'), 'layouts'),
        partialsDir: path.join(this.app.get('views'), 'partials'),
        extname: '.hbs',
        helpers: require('./lib/handlebars'),
      })
    );
  }
  middlewares() {
    this.app.use(compression());
    this.app.use(express.urlencoded({extended: false, limit: 5242880}));
    this.app.use(express.json({limit: 5242880}));
    this.app.use(cookieParser());
    this.app.use(
      cookieSession({
        name: 'session',
        keys: ['key1', 'key2'],
      })
    );
    this.app.use(initialize()); //passport
    this.app.use(session()); //passport
  }
  routes() {
    this.app.use(require('./routes/'));
    this.app.use(require('./routes/app/home'));
    this.app.use('/tasks', require('./routes/app/tasks'));
  }
  extra() {
    this.app.use(express.static(path.join(__dirname, 'public')));
    this.app.use(mainView);
  }
  async listen() {
    const server = await this.app.listen(this.app.get('port'));
    console.log(`server is running on port ${this.app.get('port')}`);
    return server;
  }
}
