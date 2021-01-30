
const express = require('express')
const router = express.Router()
const {ensureAuth, ensureGuest } = require('../middleware/auth')
const User = require('../models/User')
const Story = require('../models/Story')


// @desc Login/Landing page
// @route GET /
router.get('/', ensureGuest, (req, res) => {
    res.render('login',{layout:'login'})
})

// @desc Dashboard 
// @route GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({user: req.user.id}).lean()
        console.log(stories)
        res.render('dashboard',{
            name:req.user.givenName,
            stories: stories
        })
    } catch (err) {
        console.error(err)
        Response.render('error/500')
    }
})


module.exports = router