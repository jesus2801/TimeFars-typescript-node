import {PoolConnection} from 'mysql2/promise';
import {connect} from '../../database';
import {reportError} from '../../helpers/reportError';

export async function insertAction(
  userID: number | string,
  action: 'insert' | 'delete' | 'update' | 'done' | 'goalDone',
  ip: string,
  url: string
) {
  const conn: PoolConnection = await connect();
  try {
    await conn.query('CALL insertAction(?,?)', [userID, action]);
  } catch (e) {
    reportError(e, ip, url, userID);
  }
}
