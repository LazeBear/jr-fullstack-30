const Movie = require('../models/movie.model');

const getAllMovies = async (req, res) => {
  let { keyword, sort, page = 1, limit = 10 } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  const filters = {};

  if (keyword) {
    filters.$or = [
      { title: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
    ];
  }

  const sortOption = {};
  if (sort === 'rating') {
    sortOption = { averageRating: 1 };
  } else if (sort === '-rating') {
    sortOption = { averageRating: -1 };
  }
  // page = 2, limit=1
  // (page - 1)*limit => startIndex
  // startIndex + limit => endIndex
  // [1,2,3]

  const startIndex = (page - 1) * limit;

  // db.movie.find()
  const movies = await Movie.find(filters)
    .sort(sortOption)
    .skip(startIndex)
    .limit(limit)
    .exec();

  res.json(movies);
};

const createMovie = async (req, res) => {
  const { title, description, types } = req.body;
  // data validation
  // fail fast
  // if (!title || !description || !Array.isArray(types) || types.length === 0) {
  //   res.status(400).json({
  //     message: 'All fields are required and types must be an non-empty array',
  //   });
  //   return;
  //   // return res.status(400).json({
  //   //   message: 'All fields are required and types must be an non-empty array',
  //   // });
  // }

  // const movie = {
  //   id: nextId++,
  //   title,
  //   description,
  //   types,
  //   averageRating: 0,
  //   reviews: [],
  // };
  // new Movie()
  const movie = await Movie.create({ title, description, types });
  res.status(201).json(movie);
};

const getMovieById = async (req, res) => {
  const movie = await Movie.findById(req.params.id).exec();
  if (!movie) {
    res.status(404).json({
      message: 'Movie not found',
    });
    return;
  }
  res.json(movie);
};

const updateMovieById = async (req, res) => {
  const { title, description, types } = req.body;
  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    { title, description, types },
    { new: true, runValidators: true },
  ).exec();
  if (!movie) {
    res.status(404).json({
      message: 'Movie not found',
    });
    return;
  }
  res.json(movie);
};

const deleteMovieById = async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.pramrs.id).exec();
  if (!movie) {
    res.status(404).json({
      message: 'Movie not found',
    });
    return;
  }
  // res.status(204).send();
  res.sendStatus(204);
};

const createReview = async (req, res) => {
  // reference, value
  // primitive type, string, number
  const movie = await Movie.findById(req.params.id);
  if (!movie) {
    res.status(404).json({
      message: 'Movie not found',
    });
    return;
  }
  const { content, rating } = req.body;
  // if (!content || !rating || rating < 1 || rating > 5) {
  //   res.status(400).json({
  //     message: 'Content is required and rating must be between 1 and 5',
  //   });
  //   return;
  // }
  // const newReview = {
  //   id: nextId++,
  //   content,
  //   rating,
  // };
  movie.reviews.push({ content, rating });
  // movie.averageRating = +(
  //   movie.reviews.reduce((sum, review) => sum + review.rating, 0) /
  //   movie.reviews.length
  // ).toFixed(2);
  await movie.save();

  res.status(201).json(movie.reviews[movie.reviews.length - 1]);
};

const getReviews = async (req, res) => {
  const movie = await Movie.findById(req.params.id).select('reviews').exec();
  if (!movie) {
    res.status(404).json({
      message: 'Movie not found',
    });
    return;
  }
  res.json(movie.reviews);
};

module.exports = {
  getAllMovies,
  createMovie,
  getMovieById,
  updateMovieById,
  deleteMovieById,
  createReview,
  getReviews,
};
