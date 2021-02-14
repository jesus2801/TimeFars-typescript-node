import {PoolConnection} from 'mysql2/promise';
import {connect} from '../../database';

export function insertUser(names: string, mail: string, pass: string) {
  return new Promise<number>(async (resolved, reject) => {
    try {
      const conn: PoolConnection = await connect();
      const [[response]]: any = await conn.query('CALL insertUser(?,?,?)', [
        names,
        mail,
        pass,
      ]);
      conn.release();
      resolved(response[0].latestId);
    } catch (e) {
      reject(e);
    }
  });
}
