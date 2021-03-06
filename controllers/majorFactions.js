const express = require('express');
//const { regexp } = require('sequelize/dist/lib/operators');
const router = express.Router();
const { majorFaction } = require('../models');
const { campaign } = require('../models');

router.get('/:id', function(req, res) {
    //get all majorFactions
    let campaignId = Number(req.params.id);
    majorFaction.findAll({
        where: {campaignId: campaignId}
    })
    .then(function(majorFactionList){
        console.log('FOUND ALL MajorFactionS', majorFactionList);
        res.render('majorFactions/index', { majorFactions: majorFactionList, campaignId: campaignId});

    })
    .catch(function(err){
        console.log("ERROR", err);
        res.json({ message: 'Error occured, Try again'});
    })
})

router.get('/new/:id', function(req, res) {
    let campaignId = Number(req.params.id);
    res.render('majorFactions/new', {campaignId: campaignId}); 
});


router.post('/:id/', function(req, res) {
    console.log('SUBMITTED FORM', req.body);
    let campaignId = Number(req.params.id);
    campaign.findOne({
        where: {id: campaignId}
    })
    .then(campaign => {
        campaign.createMajorFaction({
            name: req.body.name,
            leader: req.body.leader,
            size: req.body.size,
            location: req.body.location,
            agenda: req.body.agenda
        })
        .then(function(newMajorFaction) {
            console.log('NEW MajorFaction', newMajorFaction.toJSON());
            newMajorFaction = newMajorFaction.toJSON();
            res.redirect(`/majorFactions/s/${newMajorFaction.id}`);
        })
        .catch(function(error) {
            console.log('ERROR', error);
            res.render('404', { message: 'MajorFaction was not added please try again...' });
        });
    });
    // res.redirect()
});

router.put('/:id', function(req, res) {
    console.log('EDIT FORM DATA THAT WAS SUBMITTED', req.body);
    majorFaction.update({
        name: req.body.name,
        leader: req.body.leader,
        size: req.body.size,
        location: req.body.location,
        agenda: req.body.agenda
    }, {where: {id: Number(req.params.id)}})
    .then(function(response){
        console.log(response);
        res.redirect(`/majorFactions/s/${Number(req.params.id)}`);
    })
    .catch(function(err){
        console.log('ERROR', err);
        res.render('404', { message: 'Update was not succesful, try again.'})
    })
})

router.delete('/:id', async function(req,res){ 
    console.log('ID', req.params.id);
    let majorFactionId = Number(req.params.id);
    let campaignId = 0;

    try{ 
        majorFactionFound = await majorFaction.findByPk(majorFactionId);
        console.log("LOCATION FOUND", majorFactionFound);
        campaignId = await majorFactionFound.toJSON().campaignId;
        
    }
    catch(err) {
        console.log('ERROR', err);
    }  

    majorFaction.destroy({ where: { id: Number(req.params.id)}})
    .then(function(response) {
        console.log('MajorFaction DELETED', response);
        res.redirect('/majorFactions/' + campaignId);
    })
    .catch(function(err) {
        console.log('ERROR', err);
        res.render('404', { message: 'MajorFaction was not deleted, try again.'})
    })
})


router.get('/edit/:id', function(req, res) {
    let majorFactionIndex = Number(req.params.id);
    majorFaction.findByPk(majorFactionIndex)
    .then(function(majorFaction) {
        if(majorFaction) {
            majorFaction = majorFaction.toJSON();
            console.log('MajorFaction EDITED', majorFaction);
            res.render('majorFactions/edit', { majorFaction });
        } else {
            console.log('This majorFaction does not exist');
            // render a 404 page
            res.render('404', { message: 'MajorFaction does not exist' });
        }
    })
    .catch(function(error) {
        console.log('This ERROR', error);
    });
    
})

router.get('/s/:id', function(req, res) {
    console.log(req.params.id);
    majorFaction.findByPk(Number(req.params.id))
    .then(function(majorFaction){
        if (majorFaction){
            majorFaction = majorFaction.toJSON();
            console.log('MajorFaction SHOWN', majorFaction);
            res.render('majorFactions/show', {majorFaction});
        }else{
            res.render('404', {message: 'majorFaction does not exist' })
        }
    })
    .catch(function(err){
        console.log("ERROR", err);
        res.json({ message: 'This majorFaction does not exist, Try again'});
        
    })
})


module.exports = router;

