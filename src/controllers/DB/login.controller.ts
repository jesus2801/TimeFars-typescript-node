import {PoolConnection} from 'mysql2/promise';
import {connect} from '../../database';
import {comparePass} from '../../helpers/helperFunctions';

export function validLoginUser(mail: string, pass: string) {
  return new Promise<
    boolean | {userID: number | string; userName: string; verified: number | string}
  >(async (resolved, reject) => {
    try {
      const conn: PoolConnection = await connect();
      const [[query]]: any = await conn.query('CALL `searchUserLogin`(?)', [mail]);
      conn.release();
      if (query.length === 0) {
        resolved(false);
        return;
      }
      const hash = query[0].pass;
      const isValid: boolean = await comparePass(hash, pass);
      if (isValid) {
        resolved({
          userID: query[0].userID,
          userName: query[0].userName,
          verified: query[0].verified,
        });
        return;
      }
      resolved(false);
    } catch (e) {
      reject(e);
    }
  });
}
