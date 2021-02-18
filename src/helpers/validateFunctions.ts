export default {
  isEmpty: function (...string: string[]): boolean {
    return string.some(str => str.trim() === '');
  },

  validUserName: function (userName: string): boolean {
    if (
      userName.includes('<') ||
      userName.includes('>') ||
      userName.includes('"') ||
      userName.includes('`') ||
      userName.includes(')') ||
      userName.includes('(') ||
      userName.includes('$') ||
      userName.includes('{') ||
      userName.includes('}') ||
      userName.includes('|') ||
      userName.includes('[') ||
      userName.includes(']') ||
      userName.includes('*')
    ) {
      return false;
    }
    return true;
  },

  validEmail: function (email: string): Boolean {
    let regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return regex.test(email);
  },
};
