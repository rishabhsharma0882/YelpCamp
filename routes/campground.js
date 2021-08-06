
const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync.js')
const ExpressError = require('../utils/ErrorClass.js')
const Campground = require('../models/campground.js')
const { campgroundSchema } = require('../schemas.js')



const validateCampground = (req, res, next) => {


    const { error } = campgroundSchema.validate(req.body)

    if (error) {
        const m = error.details[0]
        console.log(m.message)
        const msg = error.details.map(el => el.message).join(', ')
        throw new ExpressError(msg, 400)
    }
    else
        next()

}



router.get('/', catchAsync(async (req, res) => {

    const campgrounds = await Campground.find({})

    res.render('campgrounds/index', { campgrounds })


}))





router.get('/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)


    if (!campground) {
        req.flash('error', "Campground Not Found!!")
        const val = res.redirect('/campgrounds')
        console.log(val, " came here?")
        return val
    }

    res.render('campgrounds/edit', { campground })
}))




router.get('/new', catchAsync(async (req, res) => {
    res.render('campgrounds/new')
}))

router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews')
    // console.log(campground)
    if (!campground) {
        req.flash('error', "Campground Not Found!!")
        const val = res.redirect('/campgrounds')
        console.log(val, " came here?")
        return val
    }
    res.render('campgrounds/show', { campground })
}))

router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    // if (!req.body.campground) {
    //     throw new ExpressError('Invalid Campground Data!!', 400)
    // }



    const campground = new Campground(req.body.campground)

    // console.log(campground)
    await campground.save()
    req.flash('success', "successfully created a new campground!")
    res.redirect(`/campgrounds/${campground._id}`)


}))



router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}))
router.put('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground }, { runValidators: true, new: true })
    req.flash('success', "successfully Updated the campground!")
    res.redirect(`/campgrounds/${campground._id}`)
}))



module.exports = router

