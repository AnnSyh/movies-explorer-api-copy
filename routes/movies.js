const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getMovies,
  createMovie,
  deleteMovie,
  // likeMovie,
  // dislikeMovie,
} = require('../controllers/movies');

router.get('/movies', getMovies);

router.post('/movies', celebrate({
  body: Joi.object().keys({
    movieId: Joi.number().required(),
    nameRU: Joi.string().required().pattern(/[\Wа-яА-ЯёЁ0-9\s\-?]+/),
    nameEN: Joi.string().required().pattern(/[\w\d\s\-?]+/i),
    director: Joi.string().required(),
    country: Joi.string().required(),
    year: Joi.string().required(),
    duration: Joi.number().required(),
    description: Joi.string().required(),
    trailerLink: Joi.string().required().pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/),
    image: Joi.string().required().pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/),
    thumbnail: Joi.string().required().pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/),
  }),
}), createMovie);

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
