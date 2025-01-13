import { ApiError } from "./ApiError.js";

class BadReqError extends ApiError {
  constructor(errorlist) {

    let message = "";
    errorlist.forEach(element => {
      message += `${element}\n`
    });

    super(`${message}`, 500)
  }
}

export { BadReqError }