export const reportError = async (
  err: ErrorConstructor,
  ip: string,
  url: string,
  userID?: number | string
): Promise<void> => {
  try {
    console.log(err, ip, url, userID);
  } catch (e) {
    console.log(e);
  }
};
