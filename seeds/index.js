const mongoose = require('mongoose')
const Campground = require('../models/campground.js')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers.js')
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true

}).then(() => {
    console.log("Connection Open!!!")
})
    .catch(err => console.log("Oh no error!!!", err))

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)]

const func = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 15; i++) {
        const c = Math.floor(Math.random() * 1000)
        const price=Math.floor(Math.random()*30)
        const camp = new Campground({
            
            location: `${cities[c].city}, ${cities[c].state}`,
            title: `${sample(descriptors)},  ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/289662/1600x900',
            description:' Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero, delectus reiciendis! Porro error commodi nisi eligendi perspiciatis. Sunt molestias dolore minima, voluptatum accusantium saepe, cum earum inventore qui iure veniam.',
            price
        })

        await camp.save()
    }
}
func().then(() => mongoose.connection.close())