const express = require('express');
const router = express.Router();
const asyncWrap = require('../utils/asyncWrap.js');
const expressError = require('../utils/expressError.js');
const {listingSchema} = require('../schema.js');
const listingControllers = require('../controllers/listing.js');
const fetch = require('node-fetch');
const {storage} = require("../cloudConfig.js");
const multer  = require('multer');
const upload = multer({ storage: storage });

//login middleware
router.use((req, res, next)=>{
    if(!req.isAuthenticated()){
        return res.redirect('/login');
    }
    next();
});

function validateListing(req, res, next){
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new expressError(400, error);
    }
    else {
        next();
    }
}


//show all routes
router.get('/', asyncWrap(listingControllers.index));

// add new property form
router.get('/new', listingControllers.newListingForm);

//add new property
router.post("/", upload.single('image'), validateListing, asyncWrap(listingControllers.createListing));


//show listing details
router.get("/:id", asyncWrap(listingControllers.showListingDetails));

//edit listing details
router.get("/:id/edit", asyncWrap(listingControllers.editListingForm));

router.put("/:id", upload.single('image'), validateListing, asyncWrap(listingControllers.updateListing));


//delete property
router.delete("/:id", asyncWrap(listingControllers.deleteListing));


module.exports = router;