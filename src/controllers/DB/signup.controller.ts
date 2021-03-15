import { getRepository } from 'typeorm';
import { User } from '../../entity/User';

export function insertUser(
  names: string,
  mail: string,
  pass: string,
  code: string
) {
  return new Promise<number>(async (resolved, reject) => {
    try {
      const repository = getRepository(User);
      const user = new User();
      user.userName = names;
      user.mail = mail;
      user.pass = pass;
      user.avatar = 'n-1';
      user.verificationCode = code;
      user.verified = false;
      const insertUser = await repository.save(user);

      resolved(insertUser.userID);
    } catch (e) {
      reject(e);
    }
  });
}
