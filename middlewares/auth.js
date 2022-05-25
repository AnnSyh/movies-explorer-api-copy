const jwt = require('jsonwebtoken');
const { SEKRET_KEY } = require('../constants');
const BadAuthError = require('../errors/bad-auth-err');

module.exports = (err, req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;
  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    // return next(new BadAuthError('Необходима авторизация.'));
    return next(new BadAuthError(`err.message = ${err.message} ; Необходима авторизация 1.`));
  }
  // извлечём токен
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, SEKRET_KEY);
  } catch (error) {
    // return next(new BadAuthError('Необходима авторизация.'));
    return next(new BadAuthError(`err.message = ${err.message} ; Необходима авторизация 2.`));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
