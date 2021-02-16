import {PoolConnection} from 'mysql2/promise';
import {connect} from '../../database';

export function validateEmailDB(code: string, userID: string) {
  return new Promise(async (resolved, reject) => {
    const conn: PoolConnection = await connect();
    try {
      const [
        [dbCode],
      ]: any = await conn.query('SELECT verificationCode FROM users WHERE userID = ?', [
        userID,
      ]);
      if (dbCode.verificationCode === code) {
        await conn.query('UPDATE users SET verified = 1 WHERE userID = ?', [userID]);
        conn.release();
        resolved(true);
      }
      conn.release();
      resolved(false);
    } catch (e) {
      conn.release();
      reject(e);
    }
  });
}

export function getEmail(userID: string | number): Promise<string> {
  return new Promise<string>(async (resolved, reject) => {
    const conn: PoolConnection = await connect();
    try {
      const [
        [queryMail],
      ]: any = await conn.query('SELECT mail FROM users WHERE userID = ?', [userID]);
      conn.release();
      resolved(queryMail.mail);
    } catch (e) {
      conn.release();
      reject(e);
    }
  });
}

export function getCode(userID: string | number): Promise<string> {
  return new Promise<string>(async (resolved, reject) => {
    const conn: PoolConnection = await connect();
    try {
      const [
        [queryVerificationCode],
      ]: any = await conn.query('SELECT verificationCode FROM users WHERE userID = ?', [userID]);
      conn.release();
      resolved(queryVerificationCode.verificationCode);
    } catch (e) {
      conn.release();
      reject(e);
    }
  });
}
