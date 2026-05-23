const User = require('../Models/user');

module.exports.renderSignupForm = (req, res) => {
    res.render('./users/signup');
};

module.exports.signup = async (req, res, next) => {
    try{
        let {email, username, password} = req.body;
        let user = new User({
            email: email,
            username: username
        });

        let registeredUser = await User.register(user, password);
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash('success', 'Successfully Registered');
            res.redirect('/listings');
        });
    }
    catch(e){
        req.flash('error', e.message);
        res.redirect('/signup');
    }
};

module.exports.loginForm = (req, res) => {
    res.render('./users/login');
};

module.exports.login = async(req, res) =>{
    req.flash('success', 'login successfully');
    res.redirect('/listings');
};

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        res.redirect('/listings');
    });
};