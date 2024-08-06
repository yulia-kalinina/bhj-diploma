class Account extends Entity {
  url = "/account";

  static get(id = "", callback) {
    createRequest({
      url: this.url,
      method: "GET",
      id,
      callback: (err, response) => {
        callback(err, response);
      },
    });
  }
}
