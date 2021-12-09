const express = require('express');
//const { regexp } = require('sequelize/dist/lib/operators');
const router = express.Router();
const { story } = require('../models');
const { campaign } = require('../models');

router.get('/:id', function(req, res) {
    //get all stories
    let campaignId = Number(req.params.id);
    story.findAll({
        where: {campaignId: campaignId}
    })
    .then(function(storyList){
        console.log('FOUND ALL Stories', storyList);
        res.render('stories/index', { stories: storyList, campaignId: campaignId});

    })
    .catch(function(err){
        console.log("ERROR", err);
        res.json({ message: 'Error occured, Try again'});
    })
})

router.get('/new/:id', function(req, res) {
    let campaignId = Number(req.params.id);
    res.render('stories/new', {campaignId: campaignId}); 
});


router.post('/:id', function(req, res) {
    console.log('SUBMITTED FORM', req.body);
    let campaignId = Number(req.params.id);
    campaign.findOne({
        where: {id: campaignId}
    })
    .then(campaign => {
        campaign.createStory({
            name: req.body.name,
            location: req.body.location,
            timeFrame: req.body.timeFrame,
            storyBeats: req.body.storyBeats
        })
        .then(function(newStory) {
            console.log('NEW Story', newStory.toJSON());
            newStory = newStory.toJSON();
            res.redirect(`/stories/s/${newStory.id}`);
        })
        .catch(function(error) {
            console.log('ERROR', error);
            res.render('404', { message: 'Story was not added please try again...' });
        });
    });
    // res.redirect()
});

router.put('/:id', function(req, res) {
    console.log('EDIT FORM DATA THAT WAS SUBMITTED', req.body);
    story.update({
        name: req.body.name,
        location: req.body.location,
        timeFrame: req.body.timeFrame,
        storyBeats: req.body.storyBeats
    }, {where: {id: Number(req.params.id)}})
    .then(function(response){
        console.log(response);
        res.redirect(`/stories/s/${Number(req.params.id)}`);
    })
    .catch(function(err){
        console.log('ERROR', err);
        res.render('404', { message: 'Update was not succesful, try again.'})
    })
})

router.delete('/:id', async function(req,res){ 
    console.log('ID', req.params.id);

    let storyId = Number(req.params.id);
    let campaignId = 0;

    try{ 
        storyFound = await story.findByPk(storyId);
        console.log("LOCATION FOUND", storyFound);
        campaignId = await storyFound.toJSON().campaignId;
        
    }
    catch(err) {
        console.log('ERROR', err);
    }   

    story.destroy({ where: { id: Number(req.params.id)}})
    .then(function(response) {
        console.log('Story DELETED', response);
        res.redirect('/stories/' + campaignId);
    })
    .catch(function(err) {
        console.log('ERROR', err);
        res.render('404', { message: 'Story was not deleted, try again.'})
    })
})


router.get('/edit/:id', function(req, res) {
    let storyIndex = Number(req.params.id);
    story.findByPk(storyIndex)
    .then(function(story) {
        if(story) {
            story = story.toJSON();
            console.log('Story EDITED', story);
            res.render('stories/edit', { story });
        } else {
            console.log('This story does not exist');
            // render a 404 page
            res.render('404', { message: 'Story does not exist' });
        }
    })
    .catch(function(error) {
        console.log('ERROR', error);
    });
    
})

router.get('/s/:id', function(req, res) {
    console.log(req.params.id);
    story.findByPk(Number(req.params.id))
    .then(function(story){
        if (story){
            story = story.toJSON();
            console.log('Story SHOWN', story);
            res.render('stories/show', {story});
        }else{
            res.render('404', {message: 'story does not exist' })
        }
    })
    .catch(function(err){
        console.log("ERROR", err);
        res.json({ message: 'This story does not exist, Try again'});
        
    })
})


module.exports = router;

