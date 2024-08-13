class Account extends Entity {
  URL = "/account";

  static get(id = "", callback) {
    createRequest({
      url: "/account" + "/" + id,
      method: "GET",
      callback,
    });
  }
}
