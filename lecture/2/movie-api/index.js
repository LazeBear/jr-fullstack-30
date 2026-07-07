const express = require('express');

const app = express();
app.use(express.json());

const movies = [
  {
    id: 0,
    title: 'Inception',
    description: 'A skilled thief steals secrets from dreams.',
    types: ['Sci-Fi'],
    averageRating: 4.5,
    reviews: [
      { id: 1, content: 'Amazing movie!', rating: 5 },
      { id: 2, content: 'Great visuals.', rating: 4 },
    ],
  },
];
let nextId = 1;

// uuid, nanoid

const movieRouter = express.Router();
app.use('/v1/movies', movieRouter);

movieRouter.get('/', (req, res) => {
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
});

movieRouter.post('/', (req, res) => {
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
});

movieRouter.get('/:id', (req, res) => {
  const movie = movies.find((movie) => movie.id === parseInt(req.params.id));
  if (!movie) {
    res.status(404).json({
      message: 'Movie not found',
    });
    return;
  }
  res.json(movie);
});

movieRouter.put('/:id', (req, res) => {
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
});

movieRouter.delete('/:id', (req, res) => {
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
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

// 序列化，反序列化
