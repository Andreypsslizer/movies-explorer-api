const cardsRouter = require('express').Router();

const {
  getMovies,
  addMovies,
  deleteMovie,
} = require('../controllers/movies');

cardsRouter.get('/', getMovies);
cardsRouter.post('/', addMovies);
cardsRouter.delete('/:movieId', deleteMovie);

module.exports = cardsRouter;
