const { Router } = require("express");
const router = new Router();
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  "postgres://postgres:password@localhost:5432/postgres"
);
// const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:secret@localhost:5432/postgres'
const express = require("express");
const app = express();
const port = 3000;
const body_parser = require("body-parser");

app.use(body_parser.json());

const Movie = sequelize.define("movie", {
  // attributes
  title: {
    type: Sequelize.STRING,
    field: "movie_name"
  },
  yearOfRelease: {
    type: Sequelize.INTEGER,
    field: "movie_year"
  },
  synopsis: {
    type: Sequelize.STRING,
    field: "movie_synopsis"
  }
});

sequelize
  .sync()
  .then(() => console.log("Tables created successfully"))
  .catch(err => {
    console.error("Unable to create tables, shutting down...", err);
  });

//createmovie
app.post("/newmovie", (req, res, next) => {
  // console.log("WHAT IS REQ.BODY", req.body);
  Movie.create(req.body)
    .then(movie => res.json(movie))
    .catch(next);
});

//readallmovies
app.get("/movies", (req, res, next) => {
  Movie.findAll()
    .then(movie => {
      if (!movie) {
        res.status(404).end();
      } else {
        res.json(movie);
      }
    })
    .catch(next);
});

//findone
app.get("/movie/:id", (req, res, next) => {
  Movie.findByPk(req.params.id)
    .then(movie => {
      if (!movie) {
        res.status(404).end();
      } else {
        res.send(movie);
      }
    })
    .catch(next);
});

//update a single movie
app.put("/update/:id", (req, res, next) => {
  Movie.findByPk(req.params.id)
    .then(movie => {
      if (movie) {
        movie.update(req.body).then(movie => res.json(movie));
      } else {
        res.status(404).end();
      }
    })
    .catch(next);
});

//delete single movie
app.delete("/deletemovie/:id", (req, res, next) => {
  Movie.destroy({
    where: {
      id: req.params.id,
      id: req.params.id
    }
  })
    .then(numDeleted => {
      if (numDeleted) {
        res.status(204).end();
      } else {
        res.status(404).end();
      }
    })
    .catch(next);
});

app.get("/event", (req, res, next) => {
  const limit = req.query.limit || 25;
  const offset = req.query.offset || 0;


  Movie.findAndCountAll({ limit, offset })
    .then(result => res.send({ teams: result.rows, total: result.count }))
    .catch(error => next(error));
});



app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = router;
