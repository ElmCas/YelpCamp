const express = require('express'),
    router = express.Router({ mergeParams: true }), //merge params to be able to use :id otherwise it will be set as null
    Campground = require('../models/campground'),
    middleware = require('../middleware'),
    Comment = require('../models/comment');

//NEW ROUTE for comments
// router.get('/campgrounds/:id/comments/new', isLoggedin, (req, res) => {
router.get('/new', middleware.isLoggedIn, (req, res) => {
    //find campground by id
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', { campground: campground });
        }
    });

});

//CREATE new comment to campground
// router.post('/campgrounds/:id/comments', isLoggedin, (req, res) => {
router.post('/', middleware.isLoggedIn, (req, res) => {
    //lookup campground using id
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            //create new comment
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                } else {
                    //add username and id to comments
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    //connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    req.flash('success', 'Successfully added comment');
                    //redirect to campground show page
                    res.redirect(`/campgrounds/${campground._id}`);
                }
            });
        }
    });
});
//COMMENTS EDIT ROUTE
router.get('/:comment_id/edit', middleware.isLoggedIn, middleware.checkCommentOwnership, (req, res) => {
    // Comment.findById(req.params.comment_id, (err, foundComment) => {
    //     if (err) {
    //         res.redirect('back');
    //     } else {
    //         res.render('comments/edit', { campground_id: req.params.id, comment: foundComment });
    //     }
    // });
    res.render('comments/edit', { campground_id: req.params.id, comment: req.comment });
});
//COMMENTS UPDATE ROUTE
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if (err) {
            res.redirect('back');
        } else {
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});
//COMMENTS DESTROY ROUTE
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) {
            res.redirect(back);
        } else {
            req.flash('success', 'Comment deleted');
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

module.exports = router;