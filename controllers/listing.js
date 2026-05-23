const listings = require('../Models/listings.js');

//index page
module.exports.index = async (req, res) => {
    let allListings = await listings.find();
    res.render('listings/index.ejs', {allListings});
}

//add new property
module.exports.newListingForm = (req, res)=>{
    res.render('listings/new.ejs');
}

module.exports.createListing = async (req, res)=>{
    let {title, description, price, country, location} = req.body;
    let data = await listings.insertOne({
        title : title,
        description : description,
        image : {url: req.file.path, filename: req.file.filename},
        price : price,
        country : country,
        location : location,
        owner: req.user._id
    });
    req.flash('success', 'Listing added successfully!');
    res.redirect(301, '/listings');
}

//show listing details
module.exports.showListingDetails = async (req, res)=>{
    let {id} = req.params;
    let user = await listings.findOne({_id : id}).populate({path: 'reviews', populate: {path: 'author'}}).populate('owner');
    res.render('listings/show.ejs', {user});
}


//edit listing details
module.exports.editListingForm = async (req, res)=>{
    let {id} = req.params;
    let data = await listings.find({_id : id});
    let user = data[0];
    let compressImage = user.image.url;
    compressImage = compressImage.replace('/upload', '/upload/q_auto/f_auto');
    res.render("listings/edit.ejs", {user, compressImage});

}

module.exports.updateListing = async (req, res, next)=>{
    let {id} = req.params;
    let data = await listings.find({_id : id});
    if(!data[0].owner._id.equals(req.user._id)){
        req.flash('error', 'You do not have permission to edit this listing!');
        return res.redirect('/listings');
    }

    let {title, description, price, country, location} = req.body;
    await listings.updateOne({_id : id}, {$set : {
        title : title,
        description : description,
        price : price,
        country : country,
        location : location
    }}, 
    {runValidators : true}
    );
    
    if(typeof req.file !== "undefined"){
        let listing = await listings.findById(id);
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        }
        await listing.save();
    }
    req.flash('success', 'Listing updated successfully!');
    res.redirect(301, '/listings');
}


//delete property
module.exports.deleteListing = async (req, res)=>{
    let {id} = req.params;
    let data = await listings.find({_id : id});
    if(!data[0].owner._id.equals(req.user._id)){
        req.flash('error', 'You do not have permission to delete this listing!');
        return res.redirect('/listings');
    }
    await listings.findByIdAndDelete(id);
    req.flash('success', 'Listing Deleted Successfully!');
    res.redirect(301, '/listings');
}