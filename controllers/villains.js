const express = require('express');
//const { regexp } = require('sequelize/dist/lib/operators');
const router = express.Router();
const { villain } = require('../models');

router.get('/', function(req, res) {
    //get all villains
    villain.findAll()
    .then(function(villainList){
        console.log('FOUND ALL VillainS', villainList);
        res.render('villains/index', { villains: villainList});

    })
    .catch(function(err){
        console.log("ERROR", err);
        res.json({ message: 'Error occured, Try again'});
    })
})

router.get('/new', function(req, res) {
    res.render('villains/new'); 
});


router.post('/', function(req, res) {
    console.log('SUBMITTED FORM', req.body);
    villain.create({
        name: req.body.name,
        goal: req.body.goal,
        plan: req.body.plan,
        description: req.body.description
    })
    .then(function(newVillain) {
        console.log('NEW Villain', newVillain.toJSON());
        newVillain = newVillain.toJSON();
        res.redirect(`/villains/${newVillain.id}`);
    })
    .catch(function(error) {
        console.log('ERROR', error);
        res.render('404', { message: 'Villain was not added please try again...' });
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
        res.redirect(`/villains/${Number(req.params.id)}`);
    })
    .catch(function(err){
        console.log('ERROR', err);
        res.render('404', { message: 'Update was not succesful, try again.'})
    })
})

router.delete('/:id', function(req,res){ 
    console.log('ID', req.params.id);
    villain.destroy({ where: { id: Number(req.params.id)}})
    .then(function(response) {
        console.log('Villain DELETED', response);
        res.redirect('/villains');
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

router.get('/:id', function(req, res) {
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

