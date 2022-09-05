const asyncHandler = require("express-async-handler");
const MongoConnection = require("../config/db");
const { ObjectId } = require("mongodb");
const nodemailer = require("nodemailer");
const shortid = require("shortid");
const Razorpay = require("razorpay");

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
    data: movies.reverse(),
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

const searchMovie = asyncHandler(async (req, res) => {
  let name = req.params.name;
  let response = await client
    .db("aditya")
    .collection("movies")
    .find({})
    .toArray();
  let result = response.filter((res) => res.name.toLowerCase().includes(name));
  res.json({
    status: true,
    msg: "Fetched Records Successfully",
    data: result,
  });
});

const referMovie = asyncHandler(async (req, res) => {
  const { referrer_name, referred_name, referred_email, movie } = req.body;

  if ((!referrer_name || !referred_name, !referred_email)) {
    res.json({
      status: false,
      msg: "All Fields are required",
      data: null,
    });
    return;
  }

  const authObject = {
    service: "Gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  };

  let transporter = nodemailer.createTransport(authObject);
  let mailOptions = {
    from: process.env.MAIL_UESR,
    to: referred_email,
    subject: "We've got a movie recommendation for you",
    html: `
    <h3> Seen '${movie.name}' on our Movie app yet? </h3>
    <p>Hey, <b>${referred_name}</b> what are you watching?<br>
    <b>${referrer_name}</b> just referred you this movie, they think you should watch it.<br>

    <h4>So what are you waiting for get this movie now:</h4>
    <a href="${req.get("origin")}/${movie._id}"> ${req.get("origin")}/${
      movie._id
    } </a>
    </p>
    `,
  };
  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log("Email sent successfully");
    }
  });
  res.json({
    status: true,
    msg: "Friend referred successfully",
  });
});

const createOrder = async (req, res) => {
  const razorpayInstance = new Razorpay({
    key_id: "rzp_test_88Rv0leB7MRlDj",
    key_secret: "Fs5007AsPB25DGk60TYtHgaY",
  });
  const { amount, currency, receipt, notes } = req.body;

  console.log(amount, currency, receipt, notes);

  razorpayInstance.orders.create(
    { amount, currency, receipt, notes },
    (err, order) => {
      if (!err) res.json(order);
      else res.send(err);
    }
  );
};

module.exports = {
  getMovies,
  getMovieById,
  addMovie,
  updateMovie,
  deleteMovieById,
  searchMovie,
  referMovie,
  createOrder,
};
