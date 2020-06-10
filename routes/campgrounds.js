const express = require('express'),
    router = express.Router(),
    middleware = require('../middleware'), //in node if we name the js file index it will look automaticaly for that file inside the file as a primary file so we done have to set /index.js 
    Campground = require('../models/campground');

//INDEX - shows all campgrounds
// router.get('/campgrounds', (req, res) => {
router.get('/', middleware.isLoggedIn, (req, res) => { //its not /campgrounds anymore becayse we set in app.js the start of the route with /campgrounds, same for the other routes
    //get all campgrounds from DB
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/index', { campgrounds: allCampgrounds });
        }
    });
});
//CREATE - adds new campground to the DB
// router.post('/campgrounds', (req, res) => {
router.post('/', middleware.isLoggedIn, (req, res) => {
    //get data from form and add to campground
    const name = req.body.name;
    const image = req.body.image;
    const description = req.body.description;
    const price = req.body.price;
    const author = {
        id: req.user._id,
        username: req.user.username
    };
    const newCampground = { name: name, price: price, image: image, description: description, author: author };
    //create new campground and save to db
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect('/campgrounds');
        }
    });
});
//NEW - show form to create a new campground
// router.get('/campgrounds/new', (req, res) => {
router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});
//SHOW - shows more infor about one campground
// router.get('/campgrounds/:id', (req, res) => {
router.get('/:id', (req, res) => {
    //find the campground with privided id
    Campground.findById(req.params.id).populate('comments').exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            //render show template with that campground
            res.render('campgrounds/show', { campground: foundCampground });
        }
    });
});
//EDIT CAMPGROUND ROUTE
router.get('/:id/edit', middleware.isLoggedIn, middleware.CheckCampgroundOwnership, (req, res) => {
    // Campground.findById(req.params.id, (err, foundCampground) => {
    //     res.render('campgrounds/edit', { campground: foundCampground });
    // });
    res.render('campgrounds/edit', { campground: req.campground });
});
//UPDATE CAMPGROUND ROUTE
router.put('/:id', middleware.CheckCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if (err) {
            res.redirect('/campgrounds');
        } else {
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});
//DESTROY CAMPGROUND ROUTE
// router.delete('/:id', checkCampgroundOwnership, (req, res) => {
//     Campground.findByIdAndRemove(req.params.id, (err) => {
//         if (err) {
//             res.redirect('/campgrounds');
//         } else {
//             res.redirect('/campgrounds');
//         }
//     });
// });

//ROUTE to remove campground and all comments related
router.delete("/:id", middleware.CheckCampgroundOwnership, async (req, res) => {
    try {
        let foundCampground = await Campground.findById(req.params.id);
        await foundCampground.remove();
        res.redirect("/campgrounds");
    } catch (error) {
        console.log(error.message);
        res.redirect("/campgrounds");
    }
});

module.exports = router;