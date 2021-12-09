const express = require('express');
//const { regexp } = require('sequelize/dist/lib/operators');
const router = express.Router();
const { villain } = require('../models');
const { campaign } = require('../models');

router.get('/:id', function(req, res) {
    //get all villains
    let campaignId = Number(req.params.id);
    villain.findAll({
        where: {campaignId: campaignId}
    })
    .then(function(villainList){
        console.log('FOUND ALL VillainS', villainList);
        res.render('villains/index', { villains: villainList, campaignId: campaignId});

    })
    .catch(function(err){
        console.log("ERROR", err);
        res.json({ message: 'Error occured, Try again'});
    })
})

router.get('/new/:id', function(req, res) {
    let campaignId = Number(req.params.id);
    res.render('villains/new', {campaignId: campaignId}); 
});


router.post('/:id/', function(req, res) {
    console.log('SUBMITTED FORM', req.body);
    let campaignId = Number(req.params.id);
    campaign.findOne({
        where: {id: campaignId}
    })
    .then(campaign => {
        campaign.createVillain({
            name: req.body.name,
            goal: req.body.goal,
            plan: req.body.plan,
            description: req.body.description
        })
        .then(function(newVillain) {
            console.log('NEW Villain', newVillain.toJSON());
            newVillain = newVillain.toJSON();
            res.redirect(`/villains/s/${newVillain.id}`);
        })
        .catch(function(error) {
            console.log('ERROR', error);
            res.render('404', { message: 'Villain was not added please try again...' });
        });
    });
    // res.redirect()
});

router.put('/:id', function(req, res) {
    console.log('EDIT FORM DATA THAT WAS SUBMITTED', req.body);
    villain.update({
        name: req.body.name,
        goal: req.body.goal,
        plan: req.body.plan,
        description: req.body.description
    }, {where: {id: Number(req.params.id)}})
    .then(function(response){
        console.log(response);
        res.redirect(`/villains/s/${Number(req.params.id)}`);
    })
    .catch(function(err){
        console.log('ERROR', err);
        res.render('404', { message: 'Update was not succesful, try again.'})
    })
})

router.delete('/:id', async function(req,res){ 
    console.log('ID', req.params.id);
    let villainId = Number(req.params.id);
    let campaignId = 0;

    try{ 
        villainFound = await villain.findByPk(villainId);
        console.log("VILLAIN FOUND", villainFound);
        campaignId = await villainFound.toJSON().campaignId;
        
    }
    catch(err) {
        console.log('ERROR', err);
    }   

    villain.destroy({ where: { id: Number(req.params.id)}})
    .then(function(response) {
        console.log('Villain DELETED', response);
        res.redirect('/villains/' + campaignId);
    })
    .catch(function(err) {
        console.log('ERROR', err);
        res.render('404', { message: 'Villain was not deleted, try again.'})
    })
})


router.get('/edit/:id', function(req, res) {
    let villainIndex = Number(req.params.id);
    villain.findByPk(villainIndex)
    .then(function(villain) {
        if(villain) {
            villain = villain.toJSON();
            console.log('Villain EDITED', villain);
            res.render('villains/edit', { villain });
        } else {
            console.log('This villain does not exist');
            // render a 404 page
            res.render('404', { message: 'Villain does not exist' });
        }
    })
    .catch(function(error) {
        console.log('ERROR', error);
    });
    
})

router.get('/s/:id', function(req, res) {
    console.log(req.params.id);
    villain.findByPk(Number(req.params.id))
    .then(function(villain){
        if (villain){
            villain = villain.toJSON();
            console.log('Villain SHOWN', villain);
            res.render('villains/show', {villain});
        }else{
            res.render('404', {message: 'villain does not exist' })
        }
    })
    .catch(function(err){
        console.log("ERROR", err);
        res.json({ message: 'This villain does not exist, Try again'});
        
    })
})


module.exports = router;

