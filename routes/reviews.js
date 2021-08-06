
const express = require('express')
const router = express.Router({mergeParams:true})
const catchAsync = require('../utils/catchAsync.js')
const ExpressError = require('../utils/ErrorClass.js')
const Campground = require('../models/campground.js')
const Review = require('../models/reviews.js')
const { campgroundSchema,reviewSchema } = require('../schemas.js')

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)

    if (error) {
        const m = error.details[0]
        console.log(m.message)
        const msg = error.details.map(el => el.message).join(', ')
        throw new ExpressError(msg, 400)
    }
    else
        next()

}

router.post('/', validateReview, catchAsync(async (req, res) => {
    const { id } = req.params
    console.log(id)
    const campground = await Campground.findById(id)
    const review = new Review(req.body.reviews)
    await review.save()
    campground.reviews.push(review)
    await campground.save()
    req.flash('success',"Successfully created a new Review!")
    res.redirect(`/campgrounds/${campground._id}`)
}))


router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(req.params.reviewId)
    req.flash('success',"Successfully deleted a review!")
    res.redirect(`/campgrounds/${id}`)
}))

module.exports=router