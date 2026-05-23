const express = require('express');
const router = express.Router({mergeParams : true});
const {reviewSchema} = require('./../schema.js');
const asyncWrap = require('./../utils/asyncWrap.js');
const reviewControllers = require('./../controllers/review.js');


function validateReview(req, res, next){
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new expressError(400, error);
    }
    else {
        next();
    }
}

//Handle reviews
router.post("/", validateReview, asyncWrap(reviewControllers.addReview));

router.delete("/:Reviewid", asyncWrap(reviewControllers.deleteReview));

module.exports = router;