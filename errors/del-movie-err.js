const { ERROR_CODE_DEL_MOVIE } = require('../constants');

class DelMovieError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE_DEL_MOVIE;
  }
}

module.exports = DelMovieError;
