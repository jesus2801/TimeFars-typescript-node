import { getRepository } from 'typeorm';
import { User } from '../../entity/User';
import Helpers from '../../helpers/helperFunctions';

export function validLoginUser(mail: string, pass: string) {
  return new Promise<
    | boolean
    | {
        userID: number | string;
        userName: string;
        verified: boolean;
      }
  >(async (resolved, reject) => {
    try {
      const repository = getRepository(User);
      const user = await repository.findOne({ mail });

      if (!user) {
        resolved(false);
        return;
      }

      const isValid: boolean = await Helpers.comparePass(user.pass, pass);
      if (isValid) {
        resolved({
          userID: user.userID,
          userName: user.userName,
          verified: user.verified,
        });
        return;
      }
      resolved(false);
    } catch (e) {
      reject(e);
    }
  });
}
