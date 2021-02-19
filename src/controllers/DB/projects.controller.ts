import {PoolConnection} from 'mysql2/promise';
import {connect} from '../../database';

export default {
  getProjects: function (userID: number | string): Promise<void> {
    return new Promise<void>(async (resolved, reject) => {
      const conn: PoolConnection = await connect();
      try {
        await conn.query('CALL getProjects(?)', [userID]);
        conn.release();
        resolved();
      } catch (e) {
        reject(e);
      }
    });
  },

  //-------------------------------------------------------------------

  createProject: function (userID: string | number): Promise<void> {
    return new Promise<void>(async (resolved, reject) => {
      const conn: PoolConnection = await connect();
      try {
        const [[response]]: any = await conn.query('CALL insertProject(?,?)', [
          userID,
          new Date(),
        ]);
        conn.release();
        resolved(response[0].insertId);
      } catch (e) {
        reject(e);
      }
    });
  },

  //---------------------------------------------------------------------

  updateProject: function (
    userID: number | string,
    projectID: number | string,
    title: string,
    description: string,
    color: string
  ): Promise<void> {
    return new Promise<void>(async (resolved, reject) => {
      const conn: PoolConnection = await connect();
      try {
        await conn.query('CALL updateProject(?,?,?,?,?)', [
          userID,
          projectID,
          title,
          description,
          color,
          new Date(),
        ]);
        conn.release();
        resolved();
      } catch (e) {
        reject(e);
      }
    });
  },

  //---------------------------------------------------------------------

  deleteProject: function (
    userID: number | string,
    projectID: number | string
  ): Promise<void> {
    return new Promise<void>(async (resolved, reject) => {
      const conn: PoolConnection = await connect();
      try {
        await conn.query('CALL deleteProject(?,?)', [userID, projectID]);
        conn.release();
        resolved();
      } catch (e) {
        reject(e);
      }
    });
  },

  //---------------------------------------------------------------------

  getProjectTasks: function (
    userID: number | string,
    projectID: number | string
  ): Promise<void> {
    return new Promise<void>(async (resolved, reject) => {
      const conn: PoolConnection = await connect();
      try {
        await conn.query('CALL getProjectTasks(?,?)', [userID, projectID]);
        conn.release();
        resolved();
      } catch (e) {
        reject(e);
      }
    });
  },

  //---------------------------------------------------------------------

  insertProjectTask: function (
    projectID: number | string,
    activityID: number | string
  ): Promise<number> {
    return new Promise<number>(async (resolved, reject) => {
      const conn: PoolConnection = await connect();
      try {
        const [[response]]: any = await conn.query('CALL insertProjectTask(?,?,?)', [
          projectID,
          activityID,
          new Date(),
        ]);
        conn.release();
        resolved(response[0].insertId);
      } catch (e) {
        reject(e);
      }
    });
  },
};
