const express = require("express");
const {
  getMovies,
  getMovieById,
  addMovie,
  updateMovie,
  deleteMovieById,
  searchMovie,
} = require("../controllers/movie_controller");

const router = express.Router();

router.get("/getMovies", getMovies);

router.get("/getMovieById/:id", getMovieById);

router.post("/addMovie", addMovie);

router.post("/updateMovieById", updateMovie);

router.get("/searchMovie/:name", searchMovie);

router.delete("/deleteMovieById/:id", deleteMovieById);

module.exports = router;
