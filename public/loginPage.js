'use strict';
const userForm = new UserForm();

userForm.loginFormCallback = (data) => {
    ApiConnector.login({ login: data.login, password: data.password }, (callback) => {
        if (callback.success) {
            location.reload();
        } else {
            userForm.setLoginErrorMessage(callback.error);
        }
    })
}

userForm.registerFormCallback = (data) => {
    ApiConnector.register({ login: data.login, password: data.password }, (callback) => {
        if (callback.success) {
            location.reload();
        } else {
            userForm.setRegisterErrorMessage(callback.error);
        }
    })
}