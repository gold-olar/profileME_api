const cookieParser = require('cookie-parser');
const express = require('express');
const httpErrors = require('http-errors');
const logger = require('morgan');
const path = require('path');
const mongoose = require('mongoose');
const db = require('./config/database');
const cors = require('cors');
require('dotenv').config();

mongoose.connect(db.mongoURL,{ useNewUrlParser: true , useUnifiedTopology: true })
.then(()=> console.log("DB running..."))
.catch(err => console.log(err))


const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}




const app = express();

app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-requested-with, Content-Type, Accept");
	next();
})


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(httpErrors(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

module.exports = app;
