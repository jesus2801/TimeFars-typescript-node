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
// global scope
var emailInput = document.getElementById('email'), passInput = document.getElementById('pass'), formButton = document.querySelector('.submit'), emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i, errors = {
    incognitoError: 'Lo sentimos, ha ocurrido un error, porfavor intente de nuevo o en su defecto más tarde.',
    invalidEmail: 'El correo electronico ingresado es inválido',
    invalidField: 'Por favor rellene correctamente todos los campos.'
}, UI = new UserInterface();
window.addEventListener('load', function () {
    return document.querySelector('.main-ctn').classList.add('active');
});
emailInput.addEventListener('change', verifyMailValue);
formButton.addEventListener('click', function () {
    var user = new User(emailInput.value.trim(), passInput.value.trim());
    if (!user.validateFields()) {
        return UI.showErrorMessage(errors.invalidField);
    }
    if (!user.validateEmail()) {
        return UI.showErrorMessage(errors.invalidEmail);
    }
    return user.verifyCredentials();
});
var User = /** @class */ (function () {
    function User(email, pass) {
        this.email = email;
        this.pass = pass;
        this.formData = new FormData();
        this.formData.append('mail', this.email);
        this.formData.append('pass', this.pass);
    }
    User.prototype.validateFields = function () {
        return this.email === '' || this.pass === '' ? false : true;
    };
    User.prototype.validateEmail = function () {
        return emailRegex.test(this.email);
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
// tasks functions
function validEmail(email) {
    return emailRegex.test(email);
}
