/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    let user = User.current();
    if (user) {
      Account.list(user.data, (err, response) => {
        if (response && response.success === true) {
          let arrOfLists = response.data;
          let selectOfList = this.element.querySelector('[name="account_id"]');
          selectOfList.innerHTML = "";

          arrOfLists.forEach((elem) => {
            let newOptionCode =
              "<option value=" + elem.id + ">" + elem.name + "</option>";
            selectOfList.innerHTML += newOptionCode;
          });
        }
      });
    }
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {
      if (response ) {
      this.element.reset();
      App.getModal("newIncome").close();
      App.getModal("newExpense").close();
      App.update();
    }
    });
  }
}
