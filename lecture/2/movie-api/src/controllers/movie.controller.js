const movies = [];
let nextId = 1;
const getAllMovies = (req, res) => {
  let { keyword, sort, page = 1, limit = 10 } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  // shallow copy vs deep copy
  let filteredMovies = [...movies];

  if (keyword) {
    filteredMovies = filteredMovies.filter((movie) => {
      const insensitiveTitle = movie.title.toLowerCase();
      const insensitiveDescription = movie.description.toLowerCase();
      const insensitiveKeyword = keyword.toLowerCase();
      return (
        insensitiveTitle.includes(insensitiveKeyword) ||
        insensitiveDescription.includes(insensitiveKeyword)
      );
    });
  }

  if (sort === 'rating') {
    filteredMovies.sort((a, b) => a.averageRating - b.averageRating);
  } else if (sort === '-rating') {
    filteredMovies.sort((a, b) => b.averageRating - a.averageRating);
  }
  // page = 2, limit=1
  // (page - 1)*limit => startIndex
  // startIndex + limit => endIndex
  // [1,2,3]

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  filteredMovies = filteredMovies.slice(startIndex, endIndex);

  res.json(filteredMovies);
};

const createMovie = (req, res) => {
  const { title, description, types } = req.body;
  // data validation
  // fail fast
  if (!title || !description || !Array.isArray(types) || types.length === 0) {
    res.status(400).json({
      message: 'All fields are required and types must be an non-empty array',
    });
    return;
    // return res.status(400).json({
    //   message: 'All fields are required and types must be an non-empty array',
    // });
  }

  const movie = {
    id: nextId++,
    title,
    description,
    types,
    averageRating: 0,
    reviews: [],
  };

  movies.push(movie);
  res.status(201).json(movie);
};

const getMovieById = (req, res) => {
  const movie = movies.find((movie) => movie.id === parseInt(req.params.id));
  if (!movie) {
    res.status(404).json({
      message: 'Movie not found',
    });
    return;
  }
  res.json(movie);
};

const updateMovieById = (req, res) => {
  const movie = movies.find((movie) => movie.id === parseInt(req.params.id));
  if (!movie) {
    res.status(404).json({
      message: 'Movie not found',
    });
    return;
  }
  const { title, description, types } = req.body;
  if (title) {
    movie.title = title;
  }
  if (description) {
    movie.description = description;
  }
  if (types) {
    if (!Array.isArray(types)) {
      res.status(400).json({ message: 'Types must be an array' });
      return;
    }
    movie.types = types;
  }
  res.json(movie);
};

const deleteMovieById = (req, res) => {
  const movieIndex = movies.findIndex(
    (movie) => movie.id === parseInt(req.params.id),
  );
  if (movieIndex === -1) {
    res.status(404).json({
      message: 'Movie not found',
    });
    return;
  }
  // filter
  movies.splice(movieIndex, 1);
  // res.status(204).send();
  res.sendStatus(204);
};

const createReview = (req, res) => {
  // reference, value
  // primitive type, string, number
  const movie = movies.find((movie) => movie.id === parseInt(req.params.id));
  if (!movie) {
    res.status(404).json({
      message: 'Movie not found',
    });
    return;
  }
  const { content, rating } = req.body;
  if (!content || !rating || rating < 1 || rating > 5) {
    res.status(400).json({
      message: 'Content is required and rating must be between 1 and 5',
    });
    return;
  }
  const newReview = {
    id: nextId++,
    content,
    rating,
  };
  movie.reviews.push(newReview);
  movie.averageRating = +(
    movie.reviews.reduce((sum, review) => sum + review.rating, 0) /
    movie.reviews.length
  ).toFixed(2);

  res.status(201).json(newReview);
};

const getReviews = (req, res) => {
  const movie = movies.find((movie) => movie.id === parseInt(req.params.id));
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
