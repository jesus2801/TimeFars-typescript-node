import {Request} from 'express';

export class AppError {
  err: Error;
  ip: string;
  url: string;
  userID: number | string | undefined;
  constructor(error: Error, req: Request, id?: number | string) {
    this.err = error;
    this.ip = req.ip;
    this.url = req.url;
    this.userID = id;
  }
  report() {
    console.log('Error reportado');
  }
}
