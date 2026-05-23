const Review = require('./../Models/review.js')
const listings = require('./../Models/listings.js');

module.exports.addReview = async (req, res, next) => {
    let {comment, rating} = req.body;
    const review = await Review({
        comment: comment,
        rating: rating,
        author: req.user._id
    });
    const listing = await listings.findOne({_id: req.params.id});
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    req.flash('success', 'Review Added Successfully!');
    res.redirect(`/listings/${req.params.id}`)
};

module.exports.deleteReview = async (req, res, next)=>{
    const {id, Reviewid} = req.params;
    await Review.findOneAndDelete({_id: Reviewid});
    await listings.findByIdAndUpdate(id, {$pull : {reviews: Reviewid}});
    req.flash('success', 'Review Deleted Successfully!');
    res.redirect(`/listings/${id}`);
};