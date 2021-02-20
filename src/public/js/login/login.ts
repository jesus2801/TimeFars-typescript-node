class UserInterface {
  loader: any;
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

// global scope
const emailInput: HTMLInputElement = <HTMLInputElement>document.getElementById('email'),
  passInput: HTMLInputElement = <HTMLInputElement>document.getElementById('pass'),
  formButton: HTMLButtonElement = <HTMLButtonElement>document.querySelector('.submit'),
  emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
  errors = {
    incognitoError:
      'Lo sentimos, ha ocurrido un error, porfavor intente de nuevo o en su defecto más tarde.',
    invalidEmail: 'El correo electronico ingresado es inválido',
    invalidField: 'Por favor rellene correctamente todos los campos.',
  },
  UI = new UserInterface();

window.addEventListener('load', () =>
  document.querySelector('.main-ctn')!.classList.add('active')
);
emailInput.addEventListener('change', verifyMailValue);
formButton.addEventListener('click', () => {
  const user = new User(emailInput.value.trim(), passInput.value.trim());
  if (!user.validateFields()) {
    return UI.showErrorMessage(errors.invalidField);
  }
  if (!user.validateEmail()) {
    return UI.showErrorMessage(errors.invalidEmail);
  }
  return user.verifyCredentials();
});

class User {
  email: string;
  pass: string;
  formData: FormData;

  constructor(email: string, pass: string) {
    this.email = email;
    this.pass = pass;
    this.formData = new FormData();
    this.formData.append('mail', this.email);
    this.formData.append('pass', this.pass);
  }

  validateFields() {
    return this.email === '' || this.pass === '' ? false : true;
  }

  validateEmail() {
    return emailRegex.test(this.email);
  }

  verifyCredentials() {
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

// tasks functions
function validEmail(email: string): Boolean {
  return emailRegex.test(email);
}
