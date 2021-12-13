const express = require('express');
//const { regexp } = require('sequelize/dist/lib/operators');
const router = express.Router();
const { location } = require('../models');
const { campaign } = require('../models');



router.get('/:id', function(req, res) {
    //get all locations
    let campaignId = Number(req.params.id);
    location.findAll({
        where: {campaignId: campaignId}
    })
    .then(function(locationList){
        console.log('FOUND ALL LocationS', locationList);
        res.render('locations/index', { locations: locationList, campaignId: campaignId});

    })
    .catch(function(err){
        console.log("ERROR", err);
        res.json({ message: 'Error occured, Try again'});
    })
})

router.get('/new/:id', function(req, res) {
    let campaignId = Number(req.params.id);
    res.render('locations/new', {campaignId: campaignId}); 
});

router.post('/:id/', function(req, res) {
    console.log('SUBMITTED FORM', req.body);
    let campaignId = Number(req.params.id);
    campaign.findOne({
        where: {id: campaignId}
    })
    .then(campaign => {
        campaign.createLocation({
            name: req.body.name,
            population: req.body.population,
            faction: req.body.faction,
            description: req.body.description
        })
        .then(function(newLocation) {
            console.log('NEW Location', newLocation.toJSON());
            newLocation = newLocation.toJSON();
            res.redirect(`/locations/s/${newLocation.id}`);
        })
        .catch(function(error) {
            console.log('ERROR', error);
            res.render('404', { message: 'Location was not added please try again...' });
        });
    });
});

router.put('/:id', function(req, res) {
    console.log('EDIT FORM DATA THAT WAS SUBMITTED', req.body);
    location.update({
        name: req.body.name,
        population: req.body.population,
        faction: req.body.faction,
        description: req.body.description
    }, {where: {id: Number(req.params.id)}})
    .then(function(response){
        console.log(response);
        res.redirect(`/locations/s/${Number(req.params.id)}`);
    })
    .catch(function(err){
        console.log('ERROR', err);
        res.render('404', { message: 'Update was not succesful, try again.'})
    })
})

router.delete('/:id', async function(req,res){ 
    console.log('ID', req.params.id);
    let locationId = Number(req.params.id);
    let campaignId = 0;

    try{ 
        locationFound = await location.findByPk(locationId);
        console.log("LOCATION FOUND", locationFound);
        campaignId = await locationFound.toJSON().campaignId;
        
    }
    catch(err) {
        console.log('ERROR', err);
    }   
    location.destroy({ where: { id: Number(req.params.id)}})
    .then(function(response) {
        console.log('Location DELETED', response);
        res.redirect('/locations/' + campaignId);
    })
    .catch(function(err) {
        console.log('ERROR', err);
        res.render('404', { message: 'Location was not deleted, try again.'})
    })
})


router.get('/edit/:id', function(req, res) {
    let locationIndex = Number(req.params.id);
    location.findByPk(locationIndex)
    .then(function(location) {
        if(location) {
            location = location.toJSON();
            console.log('Location EDITED', location);
            res.render('locations/edit', { location });
        } else {
            console.log('This location does not exist');
            // render a 404 page
            res.render('404', { message: 'Location does not exist' });
        }
    })
    .catch(function(error) {
        console.log('ERROR', error);
    });
    
})

router.get('/s/:id', function(req, res) {
    console.log(req.params.id);
    location.findByPk(Number(req.params.id))
    .then(function(location){
        if (location){
            location = location.toJSON();
            console.log('Location SHOWN', location);
            res.render('locations/show', {location});
        }else{
            res.render('404', {message: 'location does not exist' })
        }
    })
    .catch(function(err){
        console.log("ERROR", err);
        res.json({ message: 'This location does not exist, Try again'});
        
    })
})


module.exports = router;

