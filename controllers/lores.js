const express = require('express');
//const { regexp } = require('sequelize/dist/lib/operators');
const router = express.Router();
const { lore } = require('../models');

router.get('/', function(req, res) {
    //get all lores
    lore.findAll()
    .then(function(loreList){
        console.log('FOUND ALL LoreS', loreList);
        res.render('lores/index', { lores: loreList});

    })
    .catch(function(err){
        console.log("ERROR", err);
        res.json({ message: 'Error occured, Try again'});
    })
})

router.get('/new', function(req, res) {
    res.render('lores/new'); 
});


router.post('/', function(req, res) {
    console.log('SUBMITTED FORM', req.body);
    lore.create({
        history: req.body.history,
        religion: req.body.religion
    })
    .then(function(newLore) {
        console.log('NEW Lore', newLore.toJSON());
        newLore = newLore.toJSON();
        res.redirect(`/lores/${newLore.id}`);
    })
    .catch(function(error) {
        console.log('ERROR', error);
        res.render('404', { message: 'Lore was not added please try again...' });
    });
    // res.redirect()
});

router.put('/:id', function(req, res) {
    console.log('EDIT FORM DATA THAT WAS SUBMITTED', req.body);
    lore.update({
        history: req.body.history,
        religion: req.body.religion
    }, {where: {id: Number(req.params.id)}})
    .then(function(response){
        console.log(response);
        res.redirect(`/lores/${Number(req.params.id)}`);
    })
    .catch(function(err){
        console.log('ERROR', err);
        res.render('404', { message: 'Update was not succesful, try again.'})
    })
})

router.delete('/:id', function(req,res){ 
    console.log('ID', req.params.id);
    lore.destroy({ where: { id: Number(req.params.id)}})
    .then(function(response) {
        console.log('Lore DELETED', response);
        res.redirect('/lores');
    })
    .catch(function(err) {
        console.log('ERROR', err);
        res.render('404', { message: 'Lore was not deleted, try again.'})
    })
})


router.get('/edit/:id', function(req, res) {
    let loreIndex = Number(req.params.id);
    lore.findByPk(loreIndex)
    .then(function(lore) {
        if(lore) {
            lore = lore.toJSON();
            console.log('Lore EDITED', lore);
            res.render('lores/edit', { lore });
        } else {
            console.log('This lore does not exist');
            // render a 404 page
            res.render('404', { message: 'Lore does not exist' });
        }
    })
    .catch(function(error) {
        console.log('ERROR', error);
    });
    
})

router.get('/:id', function(req, res) {
    console.log(req.params.id);
    lore.findByPk(Number(req.params.id))
    .then(function(lore){
        if (lore){
            lore = lore.toJSON();
            console.log('Lore SHOWN', lore);
            res.render('lores/show', {lore});
        }else{
            res.render('404', {message: 'lore does not exist' })
        }
    })
    .catch(function(err){
        console.log("ERROR", err);
        res.json({ message: 'This lore does not exist, Try again'});
        
    })
})


module.exports = router;

