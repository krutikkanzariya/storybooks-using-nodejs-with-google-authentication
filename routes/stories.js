const express = require('express')
const router= express.Router()
const {ensureAuth} = require('../middleware/auth')

const Story = require('../models/Story')
const User = require('../models/User')
// @desc add story
// @route GET /stories/add
router.get('/add',ensureAuth,(req,res)=>{
    res.render('stories/add')
})


// @desc send data of form
// @route POST /stories
router.post('/',ensureAuth, async (req,res)=>{
    try {
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        res.render('/error/500')
    }
})

// @desc get all stories
// @route GET stories
router.get('/',ensureAuth,async (req,res)=>{
    try {
        const stories = await Story.find({status:'public'}).populate('user').sort({createdAt:'desc'}).lean()
        //console.log(stories)
        //({status:'public'}).populate('user').sort({createdAt: 'desc'}).lean()
        res.render('stories/index',{
            stories,
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})
// @desc see single  story
// @route GET /stories/:id
router.get('/:id',ensureAuth, async (req,res)=>{
    try {
        let story = await Story.findById(req.params.id)
        .populate('user').lean()

        if(!story){
            return res.redirect('/error/404')
        }
        res.render('stories/show',{
            story
        })

    } catch (err) {
        console.error(err)
        res.render('error/404')
    }
})



// @desc edit story
// @route GET /stories/edit/:id
router.get('/edit/:id',ensureAuth, async (req,res)=>{
    const story = await Story.findOne({
        _id: req.params.id
    }).lean()

    if(!story){
        return res.render('error/404')
    }
    if(story.user!=req.user.id){
        res.redirect('/stories')
    }
    else{
        res.render('stories/edit',{
            story,
        })
    }

})

// desc update story
// put req to /stories/:id
router.put('/:id',ensureAuth, async (req,res)=>{
    let story = await Story.findById(req.params.id).lean()

    if(!story){
        return res.render(error/404)
    }

    if(story.user!=req.user.id){
        res.redirect('/stories')
    }
    else{
        story = await Story.findByIdAndUpdate({_id:req.params.id},req.body,{
            new:true,
            runValidators:true
        })
        res.redirect('/dashboard')
    }
})

// desc delete story
// delete stories/:id
router.delete('/:id',ensureAuth, async (req,res)=>{
    
    try {
        await Story.remove({_id:req.params.id})
        res.redirect('/dashboard')    
    } catch (err) {
        console.error(err)
        return res.redirect('error/500')
    }
})

// @desc user story
// @route GET /stories/user/:id
router.get('/user/:id',ensureAuth,async (req,res)=>{
    try {
        console.log(req.params)
        const stories = await Story.find({user:req.params.id,status:'public'}).populate('user').lean()
        res.render('stories/index',{
            stories
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

module.exports = router