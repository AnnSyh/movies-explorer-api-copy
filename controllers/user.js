/*

//  login (/POST)  авторизация(залогинивание) пользователя по email и password
// GET /users/:userId - возвращает пользователя по _id
//  GET /users — возвращает всех пользователей
// POST /signup — создаёт пользователя по обязательным полям email и password

GET     /users/me       - возвращает информацию о пользователе (email и имя)
PATCH   /users/me       - обновляет информацию о пользователе (email и имя)

GET     /movies         - возвращает все сохранённые текущим  пользователем фильмы
POST    /movies         - создаёт фильм с переданными в теле: country, director,
                          duration, year, description, image, trailer, nameRU,
                          nameEN и thumbnail, movieId
DELETE  /movies/_id     - удаляет сохранённый фильм по id
*/

const bcrypt = require('bcrypt'); // импортируем bcrypt
const jwt = require('jsonwebtoken'); // импортируем jwt
const User = require('../models/user');
const { SEKRET_KEY } = require('../constants');

const SALT_ROUNDS = 10;

const BadAuthError = require('../errors/bad-auth-err');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ExistEmailError = require('../errors/exist-email-err');

// + login (/POST)  авторизация(залогинивание) пользователя по email и password
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SEKRET_KEY, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      next(new BadAuthError('Неправильные почта или пароль.'));
    });
};

// + GET /users/:userId - возвращает пользователя по _id
module.exports.getUserById = (req, res, next) => {
  console.log('4444444444444');
  User.findById(req.params.userId)
    .orFail(() => {
      next(new NotFoundError('_id Ошибка. Пользователь не найден, попробуйте еще раз'));
    })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw (new NotFoundError('_id Ошибка. Пользователь не найден, попробуйте еще раз'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError(`_id Ошибка. ${req.params} Введен некорректный id пользователя`));
      }
      return next(err);
    });
};

//  + GET /users — возвращает всех пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((result) => res.send(result))
    .catch(next);
};
// ----------------------
// + POST /signup — создаёт пользователя по обязательным полям email и password
module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    return res.status(BadRequestError).send({ message: 'Поля email и password обязательны' });
  }
  // хешируем пароль
  return bcrypt.hash(req.body.password, SALT_ROUNDS)
    .then((hash) => User.create({
      name,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => {
      res.status(200).send({
        name: user.name,
        _id: user._id,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      if (err.code === 11000) {
        return next(new ExistEmailError('Передан уже зарегистрированный email.'));
      }
      return next(err);
    });
};

// + GET /users/   - возвращает список пользователей

// GET /users/me  - возвращает информацию о пользователе (email и имя)
module.exports.getCurrentUser = (req, res, next) => {
  console.log('req.user._id = ', req.user._id);
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('GET /users/me Пользователь по указанному _id не найден.'));
      }
      return res.status(200).send(user);
    })
    .catch((err) => next(err));
};

// PATCH /users/me  - обновляет информацию о пользователе (email и имя)
module.exports.updateUserProfile = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь по указанному _id не найден.'));
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при обновлении пользователя'));
      }
      return next(err);
    });
};
