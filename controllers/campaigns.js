const express = require('express');
//const { regexp } = require('sequelize/dist/lib/operators');
const router = express.Router();
const { campaign } = require('../models');

router.get('/', function(req, res) {
    //get all campaigns
    campaign.findAll()
    .then(function(campaignList){
        console.log('FOUND ALL CAMPAIGNS', campaignList);
        res.render('campaigns/index', { campaigns: campaignList});

    })
    .catch(function(err){
        console.log("ERROR", err);
        res.json({ message: 'Error occured, Try again'});
    })
})

router.get('/new', function(req, res) {
    res.render('campaigns/new'); 
});


router.post('/', function(req, res) {
    console.log('SUBMITTED FORM', req.body);
    campaign.create({
        name: req.body.name,
    })
    .then(function(newCampaign) {
        console.log('NEW CAMPAIGN', newCampaign.toJSON());
        newCampaign = newCampaign.toJSON();
        res.redirect(`/campaigns/${newCampaign.id}`);
    })
    .catch(function(error) {
        console.log('ERROR', error);
        res.render('404', { message: 'Campaign was not added please try again...' });
    });
    // res.redirect()
});

router.put('/:id', function(req, res) {
    console.log('EDIT FORM DATA THAT WAS SUBMITTED', req.body);
    campaign.update({
        name: req.body.name,
    }, {where: {id: Number(req.params.id)}})
    .then(function(response){
        console.log(response);
        res.redirect(`/campaigns/${Number(req.params.id)}`);
    })
    .catch(function(err){
        console.log('ERROR', err);
        res.render('404', { message: 'Update was not succesful, try again.'})
    })
})

router.delete('/:id', function(req,res){ 
    console.log('ID', req.params.id);
    campaign.destroy({ where: { id: Number(req.params.id)}})
    .then(function(response) {
        console.log('CAMPAIGN DELETED', response);
        res.redirect('/campaigns');
    })
    .catch(function(err) {
        console.log('ERROR', err);
        res.render('404', { message: 'Campaign was not deleted, try again.'})
    })
})


router.get('/edit/:id', function(req, res) {
    let campaignIndex = Number(req.params.id);
    campaign.findByPk(campaignIndex)
    .then(function(campaign) {
        if(campaign) {
            campaign = campaign.toJSON();
            console.log('CAMPAIGN EDITED', campaign);
            res.render('campaigns/edit', { campaign });
        } else {
            console.log('This campaign does not exist');
            // render a 404 page
            res.render('404', { message: 'Campaign does not exist' });
        }
    })
    .catch(function(error) {
        console.log('ERROR', error);
    });
    
})

router.get('/:id', function(req, res) {
    console.log(req.params.id);
    campaign.findByPk(Number(req.params.id))
    .then(function(campaign){
        if (campaign){
            campaign = campaign.toJSON();
            console.log('CAMPAIGN SHOWN', campaign);
            res.render('campaigns/show', {campaign});
        }else{
            res.render('404', {message: 'campaign does not exist' })
        }
    })
    .catch(function(err){
        console.log("ERROR", err);
        res.json({ message: 'This campaign does not exist, Try again'});
        
    })
})


module.exports = router;

