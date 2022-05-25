const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getMovies,
  addMovieToDataBase,
  deleteMovie,
  // likeMovie,
  // dislikeMovie,
} = require('../controllers/movies');

router.get('/movies', getMovies);

router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/),
    trailerLink: Joi.string().required().pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/),
    thumbnail: Joi.string().required().pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required().pattern(/[\Wа-яА-ЯёЁ0-9\s\-?]+/),
    nameEN: Joi.string().required().pattern(/[\w\d\s\-?]+/i),
  }),
}), addMovieToDataBase);

router.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
}), deleteMovie);

// router.put('/movies/:movieId/likes', celebrate({
//   params: Joi.object().keys({
//     movieId: Joi.string().hex().length(24),
//   }),
// }), likeMovie);

// router.delete('/movies/:movieId/likes', celebrate({
//   params: Joi.object().keys({
//     movieId: Joi.string().hex().length(24),
//   }),
// }), dislikeMovie);

module.exports = router;
