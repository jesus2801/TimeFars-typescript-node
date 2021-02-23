var UserInterface = /** @class */ (function () {
    function UserInterface() {
    }
    UserInterface.prototype.showErrorMessage = function (message) {
        //@ts-ignore
        return Swal.fire('¡Error!', message, 'error');
    };
    UserInterface.prototype.showLoading = function () {
        //@ts-ignore
        this.loader = Swal.fire({
            title: 'Cargando',
            didOpen: function () {
                //@ts-ignore
                Swal.showLoading();
            }
        });
    };
    UserInterface.prototype.removeLoading = function () {
        this.loader.close();
    };
    return UserInterface;
}());
var nameInput = document.getElementById('name'), emailInput = document.getElementById('email'), passInput = document.getElementById('pass'), pass2Input = document.getElementById('pass2'), formButton = document.querySelector('.submit'), emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i, errors = {
    incognitoError: 'Lo sentimos, ha ocurrido un error, porfavor intente de nuevo o en su defecto más tarde.',
    invalidEmail: 'El correo electronico ingresado es inválido',
    invalidField: 'Por favor rellene correctamente todos los campos.',
    differentsPass: 'Las contraseñas ingresadas no coinciden.'
}, UI = new UserInterface();
window.addEventListener('load', function () {
    return document.querySelector('.main-ctn').classList.add('active');
});
emailInput.addEventListener('change', verifyMailValue);
formButton.addEventListener('click', validateAndSubmitForm);
var User = /** @class */ (function () {
    function User(name, email, pass, pass2) {
        this.name = name;
        this.email = email;
        this.pass = pass;
        this.pass2 = pass2;
        this.formData = new FormData();
        this.formData.append('name', this.name);
        this.formData.append('email', this.email);
        this.formData.append('pass', this.pass);
    }
    User.prototype.validateFields = function () {
        return !isEmpty(this.name, this.email, this.pass, this.pass2);
    };
    User.prototype.validateEmail = function () {
        return emailRegex.test(this.email);
    };
    User.prototype.verifyPass = function () {
        return this.pass === this.pass2;
    };
    User.prototype.verifyCredentials = function () {
        UI.showLoading();
        fetch(window.location.href, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            //@ts-ignore
            body: new URLSearchParams(this.formData).toString()
        })
            .then(function (res) { return res.json(); })["catch"](function () {
            UI.removeLoading();
            UI.showErrorMessage(errors.incognitoError);
        })
            .then(function (res) {
            UI.removeLoading();
            if (res.error) {
                return UI.showErrorMessage(res.message);
            }
            window.location.href = '/app/home';
        });
    };
    return User;
}());
//FUNCTIONS:
// loggic functions
function verifyMailValue() {
    var value = emailInput.value.trim();
    if (!validEmail(value)) {
        emailInput.classList.add('error');
        return;
    }
    emailInput.classList.remove('error');
}
function validateAndSubmitForm() {
    var user = new User(nameInput.value.trim(), emailInput.value.trim(), passInput.value.trim(), pass2Input.value.trim());
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
function validEmail(email) {
    return emailRegex.test(email);
}
function isEmpty() {
    var strings = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        strings[_i] = arguments[_i];
    }
    return strings.some(function (str) { return str === ''; });
}
