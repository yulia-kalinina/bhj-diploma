class User {
  url = "/user";

  static setCurrent(user) {
    localStorage.setItem("user", user);
  }

  static unsetCurrent() {
    localStorage.removeItem("user");
  }

  static current() {
    let storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser) {
      return storedUser;
    } else {
      return undefined;
    }
  }

  static fetch(callback) {
    createRequest({
      url: this.url + "/current",
      method: "GET",
      responseType: "json",
      callback: (err, response) => {
        if (response && response.success === true) {
          this.setCurrent(response.user);
        } else {
          this.unsetCurrent();
        }
        callback(err, response);
      },
    });
  }

  static login(data, callback) {
    createRequest({
      url: this.url + "/login",
      method: "POST",
      responseType: "json",
      data,
      callback: (err, response) => {
        if (response && response.user) {
          this.setCurrent(response.user);
        }
        callback(err, response);
      },
    });
  }

  static register(data, callback) {
    createRequest({
      url: this.url + "/register",
      method: "POST",
      responseType: "json",
      data,
      callback: (err, response) => {
        if (response && response.user) {
          this.setCurrent(response.user);
        }
        callback(err, response);
      },
    });
  }

  static logout(callback) {
    createRequest({
      url: this.url + "/logout",
      method: "POST",
      responseType: "json",
      callback: (err, response) => {
        if (response.success === true) {
          this.unsetCurrent();
        }
        callback(err, response);
      },
    });
  }
}
