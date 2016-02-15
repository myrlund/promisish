const Promise = require("./promise");

Promise.resolve("Never gonna give you up")
  .then(console.log)
  .then(() => { throw new Error("Never gonna let you down") })
  .then(() => console.log("Never gonna print this sentence"))
  .catch(error => console.log(error.message))
  .then(() => {
    console.log("Never gonna run around");
    return Promise.reject(new Error("And desert you"));
  })
  .catch(error => console.log(error.message));

