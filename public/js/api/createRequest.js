const createRequest = (options = {}) => {
  const xhr = new XMLHttpRequest();
  xhr.responseType = "json";

  let url = options.url;
  let method = options.method;
  let formData = new FormData();

  if (options.data) {
    let data = Object.entries(options.data);

    if (method === "GET") {
      for ([key, value] of data) {
        url += key + "=" + value + "&";
      }
    }

    if (method !== "GET") {
      for ([key, value] of data) {
        formData.append(key, value);
      }
    }
  }

  try {
    xhr.addEventListener("load", () => {
      options.callback(null, xhr.response);
    });

    xhr.open(method, url);
    xhr.send(formData);
  } catch (err) {
    options.callback(err, xhr.response);
  }
};
