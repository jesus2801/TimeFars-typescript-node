import {PoolConnection} from 'mysql2/promise';
import {connect} from '../database';

export const reportError = async (
  err: ErrorConstructor,
  ip: string,
  url: string,
  userID?: number | string
): Promise<void> => {
  try {
    console.log(err);
    const conn: PoolConnection = await connect();
    conn.query('CALL `insertError`(?,?,?,?,?)', [
      err,
      ip,
      url,
      userID ? userID : null,
      new Date(), //date
    ]);
  } catch (e) {
    console.log(e);
  }
};
