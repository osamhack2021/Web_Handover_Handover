let path = require('path');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let express = require('express');
let app = express();

let mongoose = require('./mongo.js');
mongoose();

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

let indexRouter = require('./routes/index.js');
app.use('/', indexRouter);

/**
	indexRouter내에 정의되지 않은 경로들은 모두 jwtRouter로 이동함.
	jwtRouter에서 token이 없는 사용자면 res.send(401) 발생
**/
let jwtRouter = require('./routes/api/jwt.js');
app.use('*', jwtRouter);

let userRouter = require('./routes/api/user.js');
app.use('/user', userRouter);

app.listen(3000, () => {
  console.log(`API listening at http://localhost:3000`);
});


const { NotFounndError } = require('./services/errors/BusinessError.js');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	throw new NotFounndError();
});

app.use(function(error, req, res, next) {
	res.status(error.status).send(error.message);
});
