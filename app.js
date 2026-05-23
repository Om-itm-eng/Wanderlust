require('dotenv').config();
const express = require('express');
const session = require('express-session')
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
const engine = require('ejs-mate');
const flash = require('connect-flash')
const expressError = require('./utils/expressError.js');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./Models/user');
const MongoStore = require('connect-mongo').default;

const listingsRouter = require('./routers/listing.js');
const reviewRouter = require('./routers/review.js');
const userRouter = require('./routers/user.js');

const dbUrl = process.env.MONGODB_URI;

mongoose.connect(dbUrl)
.then(() => console.log("DB connected successfully"))
.catch(err => console.log(err))

//create app
const app = express();

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60
});

store.on("error", function(e){
    console.log("Session Store Error", e);
});

const sessionData = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, //7 Days,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}


//set app
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session(sessionData));
app.engine('ejs', engine);
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
});


app.use('/listings', listingsRouter);
app.use('/listings/:id/reviews', reviewRouter);
app.use('/', userRouter);


//404
app.all('*path', (req, res, next)=>{
    console.log(req.path);
    next(new expressError(404, 'Page not found'));
});

//Handle Errors
app.use((err, req, res, next)=>{
    let {name = "Unknown Error", status = 500, message = "Internal Server Error"} = err;
    console.log(name);
    console.log(status);
    console.log(message);
    res.status(status).render('listings/error.ejs', {message});
});

//app listen
app.listen(8080, ()=>{
    console.log("app running");
});
