/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {
    if (element == null) {
      throw new Error("Пустой элемент");
    }
    this.element = element;
    this.lastOptions;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const removeAccountBtn = this.element.querySelector(".remove-account");

    removeAccountBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.removeAccount();
    });

    const contentSection = document.querySelector(".content");

    contentSection.addEventListener("click", (e) => {
      e.preventDefault();
      let target = e.target.closest("button");
      if (!target) {
        return;
      }
      if (!contentSection.contains(target)) {
        return;
      }
      this.removeTransaction(target.dataset.id);
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (!this.lastOptions) {
      return;
    }

    let areYouSure = confirm("Вы действительно хотите удалить счёт?");

    if (areYouSure) {
      Account.remove(this.lastOptions, (err, response) => {
        if (response && response.success) {
          App.updateWidgets();
          App.updateForms();
        }
      });
      this.clear();
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    let areYouSure = confirm("Вы действительно хотите удалить эту транзакцию?");

    if (areYouSure) {
      Transaction.remove(this.lastOptions, (err, response) => {
        if (response && response.success) {
          App.update();
        }
      });
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    this.lastOptions = options;
    if (!options) {
      return;
    }

    Account.get(this.lastOptions["account_id"], (err, response) => {
      if (response && response.success) {
        this.renderTitle(response.data.name);
      }
    });

    Transaction.list(this.lastOptions, (err, response) => {
      if (response && response.success) {
        this.renderTransactions(response.data);
      }
    });
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    let newItem = [];
    this.renderTransactions(newItem);
    this.renderTitle("«Название счёта»");
    this.lastOptions = "";
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name) {
    let contentTitle = this.element.querySelector(".content-title");
    contentTitle.textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {
    let formatedDate = new Date(date).toLocaleString("ru", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
    return formatedDate;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    console.log(item);
    return `<div class="transaction transaction_${item.type} row">
    <div class="col-md-7 transaction__details">
      <div class="transaction__icon">
          <span class="fa fa-money fa-2x"></span>
      </div>
      <div class="transaction__info">
          <h4 class="transaction__title">${item.name}</h4>
          <div class="transaction__date">${this.formatDate(
            item["created_at"]
          )}</div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="transaction__summ">
          ${item.sum} <span class="currency">₽</span>
      </div>
    </div>
    <div class="col-md-2 transaction__controls">
        <button class="btn btn-danger transaction__remove" data-id=${
          item["account_id"]
        }>
            <i class="fa fa-trash"></i>  
        </button>
    </div>
</div>`;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {
    const contentTransactions = document.querySelector(".content");

    contentTransactions.innerHTML = data.reduce(
      (accumulator, currentElem) =>
        accumulator + " " + this.getTransactionHTML(currentElem),
      ""
    );
  }
}
