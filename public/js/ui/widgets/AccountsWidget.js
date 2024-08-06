/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    if (element == null) {
      throw "Пустой элемент";
    }
    this.element = element;
    this.registerEvents();
    this.update();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    const createAccountBtn = document.querySelector(".create-account");

    createAccountBtn.addEventListener("click", (e) => {
      e.preventDefault();
      App.getModal("createAccount").open();
    });

    let allAccounts = [...document.querySelectorAll(".account")];

    allAccounts.forEach((elem) => {
      elem.addEventListener("click", (e) => {
        e.preventDefault();
        AccountsWidget.onSelectAccount();
        return false;
      });
    });
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    let user = User.current();
    if (user !== undefined) {
      Account.list(data, (err, response) => {
        if (response.success === true) {
          AccountsWidget.clear();
          this.renderItem(data);
        }
      });
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    let allAccounts = [...document.querySelectorAll(".account")];
    allAccounts.forEach((elem) => {
      elem.remove();
    });
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount(element) {
    let allAccounts = [...document.querySelectorAll(".account")];

    function clearActive() {
      allAccounts.forEach((elem) => {
        elem.classList.remove("active");
      });
    }

    allAccounts.forEach((elem) => {
      elem.addEventListener("click", (e) => {
        e.preventDefault();
        clearActive();
        elem.classList.add("active");
        App.showPage("transactions", { account_id: elem.id });
        return false;
      });
    });
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item) {
    let li = document.createElement("li");
    li.className = "active account";
    li.dataset.id = item.id;
    li.innerHTML =
      '<a href="#"><span>' +
      item.name +
      "</span> / <span>" +
      item.sum +
      "₽</span></a>";
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data) {
    this.element.appendChild(AccountsWidget.getAccountHTML(data));
  }
}
