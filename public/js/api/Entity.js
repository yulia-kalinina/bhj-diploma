class Entity {
  url = "";

  static list(data, callback) {
    createRequest({
      url: this.url,
      method: "GET",
      data,
      callback: (err, response) => {
        callback(err, response);
      },
    });
  }

  static create(data, callback) {
    createRequest({
      url: this.url,
      method: "PUT",
      data,
      callback: (err, response) => {
        callback(err, response);
      },
    });
  }

  static remove(data, callback) {
    createRequest({
      url: this.url,
      method: "DELETE",
      data,
      callback: (err, response) => {
        callback(err, response);
      },
    });
  }
}
