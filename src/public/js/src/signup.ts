class UserInterface {
  private loader: any;
  showErrorMessage(message: string) {
    //@ts-ignore
    return Swal.fire('¡Error!', message, 'error');
  }
  showLoading() {
    //@ts-ignore
    this.loader = Swal.fire({
      title: 'Cargando',
      didOpen: () => {
        //@ts-ignore
        Swal.showLoading();
      },
    });
  }
  removeLoading() {
    this.loader.close();
  }
}

const nameInput: HTMLInputElement = document.getElementById('name') as HTMLInputElement,
  emailInput: HTMLInputElement = document.getElementById('email') as HTMLInputElement,
  passInput: HTMLInputElement = document.getElementById('pass') as HTMLInputElement,
  pass2Input: HTMLInputElement = document.getElementById('pass2') as HTMLInputElement,
  formButton: HTMLButtonElement = document.querySelector('.submit') as HTMLButtonElement,
  emailRegex: RegExp = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
  errors = {
    incognitoError:
      'Lo sentimos, ha ocurrido un error, porfavor intente de nuevo o en su defecto más tarde.',
    invalidEmail: 'El correo electronico ingresado es inválido',
    invalidField: 'Por favor rellene correctamente todos los campos.',
    differentsPass: 'Las contraseñas ingresadas no coinciden.',
  },
  UI = new UserInterface();

window.addEventListener('load', () =>
  document.querySelector('.main-ctn')!.classList.add('active')
);
emailInput.addEventListener('change', verifyMailValue);
formButton.addEventListener('click', validateAndSubmitForm);

class User {
  name: string;
  email: string;
  pass: string;
  pass2: string;
  private formData: FormData;

  constructor(name: string, email: string, pass: string, pass2: string) {
    this.name = name;
    this.email = email;
    this.pass = pass;
    this.pass2 = pass2;
    this.formData = new FormData();
    this.formData.append('name', this.name);
    this.formData.append('email', this.email);
    this.formData.append('pass', this.pass);
  }

  public validateFields() {
    return !isEmpty(this.name, this.email, this.pass, this.pass2);
  }

  public validateEmail() {
    return emailRegex.test(this.email);
  }

  public verifyPass() {
    return this.pass === this.pass2;
  }

  public verifyCredentials() {
    UI.showLoading();
    fetch(window.location.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      //@ts-ignore
      body: new URLSearchParams(this.formData).toString(),
    })
      .then(res => res.json())
      .catch(() => {
        UI.removeLoading();
        UI.showErrorMessage(errors.incognitoError);
      })
      .then((res: {error: boolean; message?: string}) => {
        UI.removeLoading();
        if (res.error) {
          return UI.showErrorMessage(res.message!);
        }
        window.location.href = '/app/home';
      });
  }
}

//FUNCTIONS:
// loggic functions
function verifyMailValue() {
  const value: string = emailInput.value.trim();
  if (!validEmail(value)) {
    emailInput.classList.add('error');
    return;
  }
  emailInput.classList.remove('error');
}

function validateAndSubmitForm() {
  const user = new User(
    nameInput.value.trim(),
    emailInput.value.trim(),
    passInput.value.trim(),
    pass2Input.value.trim()
  );
  if (!user.validateFields()) {
    return UI.showErrorMessage(errors.invalidField);
  }
  if (!user.validateEmail()) {
    return UI.showErrorMessage(errors.invalidEmail);
  }
  if (!user.verifyPass()) {
    return UI.showErrorMessage(errors.differentsPass);
  }
  return user.verifyCredentials();
}

// tasks functions
function validEmail(email: string): Boolean {
  return emailRegex.test(email);
}

function isEmpty(...strings: string[]) {
  return strings.some(str => str === '');
}
