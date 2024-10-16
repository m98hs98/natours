const express = require('express');
const tourController = require('./../controllers/tourControllers');
const authController = require('./../controllers/authControllers');
const reviewRouter = require('./../routes/reviewRoutes');


const router = express.Router();


// POST /tour/23d40h6i9/reviews
router.use('/:tourId/reviews', reviewRouter);


router
    .route('/top-5-cheap')
    .get(tourController.aliasTopTours, tourController.getAllTours);


router  
    .route('/tour-stats')
    .get(tourController.getTourStats);

router  
    .route('/monthly-plan/:year')
    .get(tourController.getMonthlyPlan);


router
    .route('/')
    .get(authController.protect, tourController.getAllTours)
    .post(tourController.createTour);


router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.deleteTour
    );


module.exports = router;