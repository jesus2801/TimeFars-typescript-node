import {PoolConnection} from 'mysql2/promise';
import {connect} from '../../database';

export default {
  getRoutines: function (userID: number | string): Promise<void> {
    return new Promise<void>(async (resolved, reject) => {
      const conn: PoolConnection = await connect();
      try {
        await conn.query('CALL name(?)', []);
        conn.release();
        resolved();
      } catch (e) {
        reject(e);
      }
    });
  },

  //---------------------------------------------------------------------

  createRoutine: function (userID: number | string): Promise<void> {
    return new Promise<void>(async (resolved, reject) => {
      const conn: PoolConnection = await connect();
      try {
        await conn.query('CALL name(?)', []);
        conn.release();
        resolved();
      } catch (e) {
        reject(e);
      }
    });
  },

  //---------------------------------------------------------------------

  updateRoutine: function (
    userID: number | string,
    routineID: number | string,
    title: string,
    description: string,
    active: 0 | 1
  ): Promise<void> {
    return new Promise<void>(async (resolved, reject) => {
      const conn: PoolConnection = await connect();
      try {
        await conn.query('CALL name(?)', []);
        conn.release();
        resolved();
      } catch (e) {
        reject(e);
      }
    });
  },

  //---------------------------------------------------------------------

  deleteRoutine: function (
    userID: number | string,
    routineID: string | number
  ): Promise<void> {
    return new Promise<void>(async (resolved, reject) => {
      const conn: PoolConnection = await connect();
      try {
        await conn.query('CALL name(?)', []);
        conn.release();
        resolved();
      } catch (e) {
        reject(e);
      }
    });
  },

  //---------------------------------------------------------------------

  getRoutineTasks: function (
    userID: number | string,
    routineID: number | string
  ): Promise<void> {
    return new Promise<void>(async (resolved, reject) => {
      const conn: PoolConnection = await connect();
      try {
        await conn.query('CALL name(?)', []);
        conn.release();
        resolved();
      } catch (e) {
        reject(e);
      }
    });
  },

  //---------------------------------------------------------------------

  createRoutineTask: function (
    routineID: number | string,
    activity: string,
    done: 0 | 1,
    color: string,
    importance: 'i-1' | 'i-2' | '1-3' | 'i-4',
    startTime: Date,
    finalTime: Date
  ): Promise<void> {
    return new Promise<void>(async (resolved, reject) => {
      const conn: PoolConnection = await connect();
      try {
        await conn.query('CALL name(?)', []);
        conn.release();
        resolved();
      } catch (e) {
        reject(e);
      }
    });
  },

  //---------------------------------------------------------------------

  updateRoutineTask: function (
    daily_activityID: number | string,
    activity: string,
    done: 0 | 1,
    color: string,
    importance: 'i-1' | 'i-2' | '1-3' | 'i-4',
    startTime: Date,
    finalTime: Date
  ): Promise<void> {
    return new Promise<void>(async (resolved, reject) => {
      const conn: PoolConnection = await connect();
      try {
        await conn.query('CALL name(?)', []);
        conn.release();
        resolved();
      } catch (e) {
        reject(e);
      }
    });
  },

  //---------------------------------------------------------------------

  deleteRoutineTask: function (
    userID: number | string,
    acticityID: number | string
  ): Promise<void> {
    return new Promise<void>(async (resolved, reject) => {
      const conn: PoolConnection = await connect();
      try {
        await conn.query('CALL name(?)', []);
        conn.release();
        resolved();
      } catch (e) {
        reject(e);
      }
    });
  },

  //---------------------------------------------------------------------
};
