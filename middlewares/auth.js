const jwt = require('jsonwebtoken');
const { SEKRET_KEY } = require('../constants');
const BadAuthError = require('../errors/bad-auth-err');

module.exports = (err, req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;
  console.log('middlewares; auth.js: authorization = ', authorization);
  console.log('middlewares; auth.js: Bearer  = ', authorization.startsWith('Bearer '));
  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    // return next(new BadAuthError('Необходима авторизация.'));
    return next(new BadAuthError(`err.message = ${err.message} ; Необходима авторизация 1.`));
  }
  // извлечём токен
  const token = authorization.replace('Bearer ', '');
  console.log('middlewares; auth.js: token = ', token);
  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, SEKRET_KEY);
    console.log('middlewares; auth.js: payload = ', payload);
  } catch (error) {
    // return next(new BadAuthError('Необходима авторизация.'));
    return next(new BadAuthError(`err.message = ${err.message} ; Необходима авторизация 2.`));
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  console.log('middlewares; auth.js: req.user = ', req.user);

  return next(); // пропускаем запрос дальше
};
