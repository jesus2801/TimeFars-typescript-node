import {Request, Response} from 'express';

export const authCallback = async (req: any, res: Response) => {
  res.cookie('token', req.user.token);
  res.redirect('/home');
};
