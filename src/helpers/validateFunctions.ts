export function isEmpty(string: string): boolean {
  return string.trim() === '';
}

export function validUserName(userName: string): boolean {
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
}

export function validEmail(email: string): Boolean {
  let regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  return regex.test(email);
}
