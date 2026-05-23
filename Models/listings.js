const mongoose = require('mongoose');
const Review = require('./review.js')

const listingSchema = mongoose.Schema({
    title : {
        type: String,
        required : true
    },
    description : {
        type: String
    },
    image : {
       url: String,
       filename: String
    },
    price : {
        type: Number,
        default: 0,
        min: 0
    },
    location : {
        type: String
    },
    country : {
        type: String
    },
    reviews : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

listingSchema.post('findOneAndDelete', async(listing)=>{
    if(listing.reviews.length > 0){
        await Review.deleteMany({_id: {$in: listing.reviews}})
    }
});
    
    

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;