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
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let cors = require('cors');
app.use(cors({
	origin: true,
	credential: true
}));

const { swaggerUi, specs } = require('./swagger.js');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

let indexRouter = require('./routes/index.js');
app.use('/', indexRouter);

let jwtRouter = require('./routes/api/jwt.js');
app.use('*', jwtRouter);

let userRouter = require('./routes/api/user.js');
app.use('/user', userRouter);

let groupRouter = require('./routes/api/group.js');
app.use('/group', groupRouter);

let itemRouter = require('./routes/api/item.js');
app.use('/item', itemRouter);

app.listen(3000, () => {
  console.log(`API listening at http://localhost:3000`);
});

const { NotFoundError } = require('./services/errors/BusinessError.js');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	throw new NotFoundError();
});

app.use(function(error, req, res, next) {
	res.status(error.status || 500).send(error.message);
});