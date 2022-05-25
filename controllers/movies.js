/*
GET  /movies - возвращает все сохранённые текущим  пользователем фильмы
POST /movies - создаёт фильм с переданными в теле country, director, duration, year,
                                                  description, image,
                                                  trailer, nameRU, nameEN и thumbnail, movieId
DELETE /movies/_id -  удаляет сохранённый фильм по id
PUT /cards/:cardId/likes — поставить лайк карточке фильма
DELETE /cards/:cardId/likes — убрать лайк с карточки фильма
*/

const Movie = require('../models/movie');

const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const DelMovieError = require('../errors/del-movie-err');
// const DelCardError = require('../errors/del-card-err');

// GET /movies — возвращает все movies
module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send({ movies }))
    .catch(next);
};

// POST /movies — создаёт movies
module.exports.createMovie = (req, res, next) => {
  const {
    movieId,
    nameRU,
    nameEN,
    director,
    country,
    year,
    duration,
    description,
    trailerLink,
    image,
    thumbnail,
  } = req.body;

  Movie.create({
    movieId,
    nameRU,
    nameEN,
    director,
    country,
    year,
    duration,
    description,
    trailerLink,
    image,
    thumbnail,
    owner: req.user._id,
  })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании карточки фильма.'));
      }
      return next(err);
    });
};

// DELETE /movies/:movieId — удаляет карточку по идентификатору
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movies) => {
      if (!movies) {
        throw new NotFoundError('Карточка фильма с указанным _id не найдена.');
      } else if (!movies.owner.equals(req.user._id)) {
        throw new DelMovieError('Попытка удалить чужую карточку фильма.');
      } else {
        return movies.remove().then(() => res.status(200).send(movies));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные при удалении карточки фильма.'));
      }
      return next(err);
    });
};

// PUT /movies/:movieId/likes — поставить лайк карточке фильма
module.exports.likeMovie = (req, res, next) => {
  Movie.findByIdAndUpdate(
    req.params.movieId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((movies) => {
      if (!movies) {
        throw new NotFoundError('Передан несуществующий _id карточки фильма.');
      }
      res.send({ movies });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные для изменения лайка.'));
      }
      return next(err);
    });
};

// DELETE /movies/:movieId/likes — убрать лайк с карточки фильма
module.exports.dislikeMovie = (req, res, next) => {
  Movie.findByIdAndUpdate(
    req.params.movieId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((movies) => {
      if (!movies) {
        throw new NotFoundError('Передан несуществующий _id карточки фильма.');
      }
      res.send({ movies });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные для изменения лайка.'));
      }
      return next(err);
    });
};
