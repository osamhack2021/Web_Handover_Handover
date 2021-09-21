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

let indexRouter = require('./routes/index.js');
app.use('/', indexRouter);

let userRouter = require('./routes/api/user.js');
app.use('/user', userRouter);

app.listen(3000, () => {
  console.log(`API listening at http://localhost:3000`)
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next('404 Not Found');
});

let errorHandler = require('./errorHandler.js');
app.use(errorHandler);

