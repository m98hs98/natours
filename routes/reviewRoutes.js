const express = require('express');
const reviewController = require('./../controllers/reviewControllers');
const authController = require('./../controllers/authControllers');


const router = express.Router({ mergeParams: true });


// POST /tour/23d40h6i9/reviews
// POST /reviews  

router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(
        authController.protect, 
        authController.restrictTo('user'),
        reviewController.setTourUserIds,
        reviewController.createReview
    );


router
    .route('/:id')
    .get(reviewController.getReview)
    .patch(reviewController.updateReview)
    .delete(reviewController.deleteReview);    

module.exports = router;