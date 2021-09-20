let createError = require('http-errors');
let path = require('path');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let express = require('express');
let app = express();

let mongoose = require('./mongo.js');
mongoose();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let cors = require('cors');
app.use(cors({
	origin: true,
	credential: true
}));

let session = require('express-session');
app.use(
	session({
		key: "loginData",
    // need to blind
		secret: "secretSample",
		resave: false,
		saveUninitialized: false,
		cookie: {
			express: 60 * 60 * 24
		}
	})
);

let userRouter = require('./routes/api/user.js');
app.use('/user', userRouter);

app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:3000`)
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
