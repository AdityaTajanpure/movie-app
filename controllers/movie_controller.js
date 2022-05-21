const asyncHandler = require("express-async-handler");
const MongoConnection = require("../config/db");
const { ObjectId } = require("mongodb");

var client = MongoConnection.connection;

const getMovies = asyncHandler(async (req, res) => {
  let movies = await client
    .db("aditya")
    .collection("movies")
    .find({})
    .toArray();
  res.json({
    status: true,
    msg: "Fetched movies",
    data: movies,
  });
});

const getMovieById = asyncHandler(async (req, res) => {
  console.log(req.params);
  let _id = req.params.id;
  let movies = await client
    .db("aditya")
    .collection("movies")
    .find({ _id: ObjectId(_id) })
    .toArray();
  res.json({
    status: true,
    msg: "Fetched movie",
    data: movies,
  });
});

const addMovie = asyncHandler(async (req, res) => {
  let name = req.body.name;
  let poster = req.body.poster;
  let rating = req.body.rating;
  let summary = req.body.summary;
  let trailer = req.body.trailer;

  if (!name || !poster || !rating || !summary) {
    res.json({ status: false, msg: "Not all fields are filled in." });
  } else {
    let movies = await client.db("aditya").collection("movies").insertOne({
      name,
      poster,
      rating,
      summary,
      trailer,
    });
    res.json({
      status: true,
      msg: "Movie added successfully",
      data: movies,
    });
  }
});

const updateMovie = asyncHandler(async (req, res) => {
  let _id = req.body._id;
  let name = req.body.name;
  let poster = req.body.poster;
  let rating = req.body.rating;
  let summary = req.body.summary;
  let trailer = req.body.trailer;

  if (!name || !poster || !rating || !summary) {
    res.json({ status: false, msg: "Not all fields are filled in." });
  } else {
    let movies = await client
      .db("aditya")
      .collection("movies")
      .updateOne(
        { _id: ObjectId(_id) },
        {
          $set: {
            name,
            poster,
            rating,
            summary,
            trailer,
          },
        }
      );
    res.json({
      status: true,
      msg: "Movie added successfully",
      data: movies,
    });
  }
});

const deleteMovieById = asyncHandler(async (req, res) => {
  let _id = req.params.id;
  await client
    .db("aditya")
    .collection("movies")
    .findOneAndDelete({ _id: ObjectId(_id) });
  res.json({
    status: true,
    msg: "Movie deleted successfully",
  });
});

module.exports = {
  getMovies,
  getMovieById,
  addMovie,
  updateMovie,
  deleteMovieById,
};
