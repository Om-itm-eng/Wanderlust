const joi = require('joi');

let listingSchema = joi.object({
    title: joi.string().required(),
    description: joi.string().allow(""),
    price: joi.number().min(0).required(), 
    location: joi.string().required(), 
    country: joi.string().required()
}).required();


let reviewSchema = joi.object({
    rating: joi.number().min(1).max(5).required(),
    comment: joi.string().allow("")
});

module.exports = {listingSchema, reviewSchema};