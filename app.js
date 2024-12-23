const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const hemlet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp =require('hpp');
const compression = require('compression');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorControllers');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const { default: helmet } = require('helmet');

const app = express();

// 1. Global Middlewares

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
    max: 200,
    windowMS: 60 * 60 * 1000,
    message: "Too many requests from this IP, plase try again in an hour :)"
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' })); 

// Data sanitisation against NoSQL query injection
app.use(mongoSanitize());

// Data sanitisation against XSS
app.use(xss());

// Prevent Parameter Pollution
app.use(hpp({
    whitelist: ["duration", "ratingsAverage", "ratingsQuantity", "maxGroupSize", "price", "difficulty"]
}));

// Serving static files
app.use(express.static(`${__dirname}/public`));


app.use(compression());


// Test Middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.headers);
    next();
});



// 3. Routes (Mount our Routers)
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

    
app.all('*', (req, res, next) => {
    
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));

});

app.use(globalErrorHandler);


module.exports = app;