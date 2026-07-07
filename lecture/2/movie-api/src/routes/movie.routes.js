const express = require('express');
const {
  getAllMovies,
  createMovie,
  getMovieById,
  updateMovieById,
  deleteMovieById,
  createReview,
  getReviews,
} = require('../controllers/movie.controller');

const movieRouter = express.Router();

movieRouter.get('/', getAllMovies);

movieRouter.post('/', createMovie);

movieRouter.get('/:id', getMovieById);

movieRouter.put('/:id', updateMovieById);

movieRouter.delete('/:id', deleteMovieById);

movieRouter.post('/:id/reviews', createReview);

movieRouter.get('/:id/reviews', getReviews);

module.exports = movieRouter;

// intelli path, intelli sense
