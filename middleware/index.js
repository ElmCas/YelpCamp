const Campground = require('../models/campground'),
    Comment = require('../models/comment');
//all the middleware goes here
const middlewareObj = {};

middlewareObj.CheckCampgroundOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err || !foundCampground) {
                req.flash('error', 'Campground not found');
                res.redirect('back');
                //does user own the campground?
                // console.log(foundCampground.author.id); //returns mongoose object thats why we cant compare to a string with an if statement
                // console.log(req.user._id); //returns string
            } else if (foundCampground.author.id.equals(req.user._id) || req.user.isAdmin) {
                req.campground = foundCampground;
                next();
            } else {
                req.flash('error', 'You dont have permission to do that');
                res.redirect('back');
            }
        });
    } else {
        req.flash('error', 'You need to be logged in to do that');
        res.redirect(`/cmapgrounds/${req.params.id}`);
    }
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err || !foundComment) {
                req.flash('error', 'Sorry that comment does not exist');
                res.redirect('back');
                //does user own the campground?
                // console.log(foundCampground.author.id); //returns mongoose object thats why we cant compare to a string with an if statement
                // console.log(req.user._id); //returns string
            } else if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
                req.comment = foundComment;
                next();
            } else {
                req.flash('error', 'You dont have permission to do that');
                res.redirect(`/campgrounds/${req.params.id}`);
            }
        });
    } else {
        req.flash('error', 'You need to be logged in to do that');
        res.redirect('back'); //redirect to the page i was before
    }
};

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('/login');
};

module.exports = middlewareObj