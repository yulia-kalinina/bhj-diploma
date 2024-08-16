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
      throw new Error("Пустой элемент");
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
    const createAccountBtn = this.element.querySelector(".create-account");

    createAccountBtn.addEventListener("click", (e) => {
      e.preventDefault();
      App.getModal("createAccount").open();
    });

    this.element.addEventListener("click", (event) => {
      event.preventDefault();
      let target = event.target.closest("li");
      if (!target) {
        return;
      }
      if (!this.element.contains(target)) {
        return;
      }
      this.onSelectAccount(target);
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
    if (user) {
      Account.list(user.data, (err, response) => {
        if (response && response.success === true) {
          let arrOfLists = response.data;
          this.clear();
          this.renderItem(arrOfLists);
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
    let allAccounts = this.element.querySelectorAll(".account");
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
    let allAccounts = this.element.querySelectorAll(".account");

    function clearActive() {
      allAccounts.forEach((elem) => {
        elem.classList.remove("active");
      });
    }

    clearActive();
    element.classList.add("active");
    App.showPage("transactions", { account_id: element.dataset.id });
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item) {
    return (
      '<li class="account" data-id=' +
      item.id +
      '><a href="#"><span>' +
      item.name +
      "</span> / <span>" +
      item.sum +
      "₽</span></a></li>"
    );
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data) {
    const accountsPanel = document.querySelector(".accounts-panel");

    data.forEach((elem) => {
      let newCode = this.getAccountHTML(elem);
      accountsPanel.insertAdjacentHTML("beforeend", newCode);
    });
  }
}
