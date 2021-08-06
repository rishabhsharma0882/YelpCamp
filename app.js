const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const catchAsync = require('./utils/catchAsync.js')

const ExpressError = require('./utils/ErrorClass.js')
const Campground = require('./models/campground.js')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const User = require('./models/user.js')
const localStrategy = require('passport-local')


const { campgroundSchema, reviewSchema } = require('./schemas.js')
const campgroundRoutes = require('./routes/campground.js')
const reviewRoutes = require('./routes/reviews.js')
const userRoutes = require('./routes/users')
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.engine('ejs', ejsMate)

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false

}).then(() => {
    console.log("Connection Open!!!")
})
    .catch(err => console.log("Oh no error!!!", err))


app.use(session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: Date.now() + 1000 * 60 * 60 * 24 * 7

    }
}))

app.use(flash())


// app.use(passport.initialize())
// app.use(passport.session())
// passport.use(new localStrategy(User.authenticate()))


// passport.serializeUser(User.serializeUser())
// passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')

    next()
})




// app.use('/',userRoutes)
app.use("/campgrounds", campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)

app.get('/', (req, res) => {
    res.render('home.ejs')
})





app.get('/fakeUser', async (req, res) => {

    const user = new User({ email: "rishabh.sharmas0882@gmail.com", username: "rishabhs" })
    const newUser = await User.register(user, 'chicken')
    res.send(newUser)



})

app.all('*', catchAsync(async (req, res, next) => {
    // console.log("123")
    next(new ExpressError("Page Not Found", 404))
}))


app.use((err, req, res, next) => {
    //some error here, it is getting called always
    const { statusCode = 500 } = err
    if (!err.message)
        err.message = "Something Went Wrong"

    res.status(statusCode).render('error.ejs', { err })
    console.log(res.statusCode, "this", err.message)
    // console.log(err.stack)

})



app.listen(3000, () => {
    console.log('Serving on port 3000')
})

