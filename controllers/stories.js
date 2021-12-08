const express = require('express');
//const { regexp } = require('sequelize/dist/lib/operators');
const router = express.Router();
const { story } = require('../models');

router.get('/', function(req, res) {
    //get all stories
    story.findAll()
    .then(function(storyList){
        console.log('FOUND ALL Stories', storyList);
        res.render('stories/index', { stories: storyList});

    })
    .catch(function(err){
        console.log("ERROR", err);
        res.json({ message: 'Error occured, Try again'});
    })
})

router.get('/new', function(req, res) {
    res.render('stories/new'); 
});


router.post('/', function(req, res) {
    console.log('SUBMITTED FORM', req.body);
    story.create({
        name: req.body.name,
        location: req.body.location,
        timeFrame: req.body.timeFrame,
        storyBeats: req.body.storyBeats
    })
    .then(function(newStory) {
        console.log('NEW Story', newStory.toJSON());
        newStory = newStory.toJSON();
        res.redirect(`/stories/${newStory.id}`);
    })
    .catch(function(error) {
        console.log('ERROR', error);
        res.render('404', { message: 'Story was not added please try again...' });
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
        res.redirect(`/stories/${Number(req.params.id)}`);
    })
    .catch(function(err){
        console.log('ERROR', err);
        res.render('404', { message: 'Update was not succesful, try again.'})
    })
})

router.delete('/:id', function(req,res){ 
    console.log('ID', req.params.id);
    story.destroy({ where: { id: Number(req.params.id)}})
    .then(function(response) {
        console.log('Story DELETED', response);
        res.redirect('/stories');
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

router.get('/:id', function(req, res) {
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

