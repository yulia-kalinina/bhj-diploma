/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    const btn = document.querySelector(".sidebar-toggle");
    const body = document.body;

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (
        body.classList.contains("sidebar-open") &&
        body.classList.contains("sidebar-collapse")
      ) {
        body.classList.remove("sidebar-open", "sidebar-collapse");
      } else {
        body.classList.add("sidebar-open", "sidebar-collapse");
      }
      return false;
    });
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    const registerButton = document.querySelector(".menu-item_register");
    registerButton.addEventListener("click", () => {
      App.getModal("register").open();
    });

    const loginButton = document.querySelector(".menu-item_login");
    loginButton.addEventListener("click", () => {
      App.getModal("login").open();
    });

    const logOutButton = document.querySelector(".menu-item_logout");
    logOutButton.addEventListener("click", () => {
      User.logout((err, response) => {
        if (response && response.success === true) {
          App.setState("init");
        }
      });
    });
  }
}
