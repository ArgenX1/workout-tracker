const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require('path');
const db = require("./models");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(logger('dev'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false 
});

app.get('/stats', (req,res) => {
    res.sendFile(path.join(__dirname,"public/stats.html"))
});

app.get('/exercise', (req,res) => {
    res.sendFile(path.join(__dirname,"public/exercise.html"))
});

app.get('/api/workouts',(req,res) => {
    db.Workout.find({}, (err,data) => {
      if(err) {
        res.json(err)
      } else {
        res.json(data)
      }
    })
});

app.post("/api/workouts", (req,res) => {
    db.Workout.create(req.body, (err,data) =>{
      if(err) {
        res.json(err)
      } else {
        res.json(data)
      }
    })
});

app.put('/api/workouts/:id',(req,res) => {
    db.Exercise.create(req.body)
      .then((data) => {
        console.log(data);
        db.Workout.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.id), {$push: {exercises:data._id}}, {new: true})
        .then(dbWorkout => {
          console.log(dbWorkout);
          res.json(dbWorkout);
        })
        .catch(err=> res.json(err));
      })
});

app.get('/api/workouts/range',(req,res) => {
    db.Workout.find({})
      .populate("exercises")
      .then(data => res.json(data))
      .catch(err=> res.json(err))
});

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
});