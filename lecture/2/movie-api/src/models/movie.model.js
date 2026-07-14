const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    // _id: {
    //   type: Number,
    // }
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
    },
  },
  {
    timestamps: true, // createAt updateAt
  },
);

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    types: {
      type: [String],
      validate: {
        validator: (types) => {
          return (
            types.length > 0 && types.every((type) => type.trim().length > 0)
          );
        },
        message: 'At least one type is required',
      },
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  },
);

movieSchema.pre('save', function () {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
    return;
  }
  this.averageRating = +(
    this.reviews.reduce((sum, review) => sum + review.rating, 0) /
    this.reviews.length
  ).toFixed(2);
});

// movies
const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
