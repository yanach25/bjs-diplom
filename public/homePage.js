'use strict';
const logoutButton = new LogoutButton();

logoutButton.action = () => {
    ApiConnector.logout(callback => {
        if (callback.success) {
            location.reload();
        }
    })
}

ApiConnector.current((callback) => {
    if (callback.success) {
        ProfileWidget.showProfile(callback.data)
    }
})

const ratesBoard = new RatesBoard();

function fillStocks() {
    ApiConnector.getStocks(callback => {
        if (callback.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(callback.data);
        }
    })
}

fillStocks();

let timerId = setInterval(() => fillStocks(), 60000);

const moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = ({ currency, amount }) => {
    ApiConnector.addMoney({ currency, amount }, callback => {
        let message;
        if (callback.success) {
            ProfileWidget.showProfile(callback.data);
            message = `${amount} ${currency} успешно добавлены.`;
        } else {
            message = callback.error;
        }

        moneyManager.setMessage(callback.success, message);
    })
}

moneyManager.conversionMoneyCallback = ({ fromCurrency, targetCurrency, fromAmount }) => {
    ApiConnector.convertMoney({ fromCurrency, targetCurrency, fromAmount }, callback => {
        let message;
        if (callback.success) {
            ProfileWidget.showProfile(callback.data);
            message = `${fromAmount} ${fromCurrency} успешно конвертированы в ${targetCurrency}.`;
        } else {
            message = callback.error;
        }

        moneyManager.setMessage(callback.success, message);
    });
}

moneyManager.sendMoneyCallback = ({ to, amount, currency }) => {
    ApiConnector.transferMoney({ to, amount, currency }, callback => {
        let message;
        if (callback.success) {
            ProfileWidget.showProfile(callback.data);
            message = `${amount} ${currency} успешно переведены ${to}.`;
        } else {
            message = callback.error;
        }

        moneyManager.setMessage(callback.success, message);
    });
}

const favoritesWidget = new FavoritesWidget();

ApiConnector.getFavorites(callback => {
    if (callback.success) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(callback.data);
        moneyManager.updateUsersList(callback.data);
    }
})

favoritesWidget.addUserCallback = ({ id, name }) => {
    ApiConnector.addUserToFavorites({ id, name }, callback => {
        let message;

        if (callback.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(callback.data);
            moneyManager.updateUsersList(callback.data);
            message = `${name} с id ${id} успешно добавлен.`;
        } else {
            message = callback.error;
        }

        favoritesWidget.setMessage(callback.success, message);
    })
}

favoritesWidget.removeUserCallback = (id) => {
    ApiConnector.removeUserFromFavorites(id, callback => {
        let message;

        if (callback.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(callback.data);
            moneyManager.updateUsersList(callback.data);
            message = `Пользователь с id ${id} успешно удален.`;
        } else {
            message = callback.error;
        }

        favoritesWidget.setMessage(callback.success, message);
    })
}