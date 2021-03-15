import { getRepository } from 'typeorm';
import { User } from '../../entity/User';

export function validateEmailDB(code: string, userID: number) {
  return new Promise(async (resolved, reject) => {
    const repository = getRepository(User);
    try {
      const user = (await repository.findOne({ userID })) as User;
      console.log(user);
      console.log(code);
      if (user.verificationCode === code) {
        user.verified = true;
        const insert = await repository.save(user);
        console.log(insert);
        resolved(true);
      }
      resolved(false);
    } catch (e) {
      reject(e);
    }
  });
}

export function getEmail(userID: number): Promise<string> {
  return new Promise<string>(async (resolved, reject) => {
    const repository = getRepository(User);
    try {
      const user = await repository.findOne({ userID });
      resolved(user!.mail);
    } catch (e) {
      reject(e);
    }
  });
}

export function getCode(userID: number): Promise<string> {
  return new Promise<string>(async (resolved, reject) => {
    const repository = getRepository(User);
    try {
      const user = await repository.findOne({ userID });
      resolved(user!.verificationCode);
    } catch (e) {
      reject(e);
    }
  });
}
