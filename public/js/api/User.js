class User {
  URL = "/user";

  static setCurrent(user) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  static unsetCurrent() {
    localStorage.removeItem("user");
  }

  static current() {
    let storedUser = JSON.parse(localStorage.getItem("user"));
    return storedUser;
  }

  static fetch(callback) {
    createRequest({
      url: "/user" + "/current",
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
      url: "/user" + "/login",
      method: "POST",
      responseType: "json",
      data,
      callback: (err, response) => {
        if (response && response.success === true) {
          this.setCurrent(response.user);
        }
        callback(err, response);
      },
    });
  }

  static register(data, callback) {
    createRequest({
      url: "/user" + "/register",
      method: "POST",
      responseType: "json",
      data,
      callback: (err, response) => {
        if (response && response.success === true) {
          this.setCurrent(response.user);
        }
        callback(err, response);
      },
    });
  }

  static logout(callback) {
    createRequest({
      url: "/user" + "/logout",
      method: "POST",
      responseType: "json",
      callback: (err, response) => {
        if (response && response.success === true) {
          this.unsetCurrent();
        }
        callback(err, response);
      },
    });
  }
}
