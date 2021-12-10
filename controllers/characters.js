const express = require('express');
//const { regexp } = require('sequelize/dist/lib/operators');
const router = express.Router();
const { character } = require('../models');
const { User } = require('../models');
const isLoggedIn = require('../middleware/isLoggedIn');
const { campaign } = require('../models');
const { default: axios } = require('axios');
let API_URL = "https://www.dnd5eapi.co/api/";

router.get('/', isLoggedIn, function(req, res) {
    //get all characters
    character.findAll({
        where: {userId: req.user.id}
    })
    .then(function(characterList){
        console.log('FOUND ALL CHARACTER', characterList);
        res.render('characters/index', { characters: characterList});

    })
    .catch(function(err){
        console.log("ERROR", err);
        res.json({ message: 'Error occured, Try again'});
    })
})

router.get('/new', function(req, res) {
    axios.get(API_URL + 'classes') 
    .then(function (response) {
    if(response.status === 200) {
        let classList = [];
        for(let i = 0; i < response.data.count; i++) {
            classList.push(response.data.results[i].name);
        }
        axios.get(API_URL + 'races') 
        .then(function (response) {
        if(response.status === 200) {
            let raceList = [];
            for(let i = 0; i < response.data.count; i++) {
                raceList.push(response.data.results[i].name);
            }
            res.render('characters/new', { classList: classList, raceList: raceList});
        }else{
            console.log('NO RESPONSE');
        }
        })
        .catch(function (err) {
            console.log("API Error", err);
        });  
    }else{
        console.log('NO RESPONSE');
    }
    })
    .catch(function (err) {
        console.log("API Error", err);
    });  
});


router.post('/', isLoggedIn, function(req, res) {
    console.log('SUBMITTED FORM', req.body);
    User.findOne({
        where: {id: req.user.id}
    })
    .then(user => {
        user.createCharacter({
            name: req.body.name,
            class: req.body.class,
            race: req.body.race,
            backstory: req.body.backstory,
        })
        .then(function(newCharacter) {
            console.log('NEW CHARACTER', newCharacter.toJSON());
            newCharacter = newCharacter.toJSON();
            res.redirect(`/characters/${newCharacter.id}`);
        })
        .catch(function(error) {
            console.log('ERROR', error);
            res.render('404', { message: 'Character was not added please try again...' });
        });
    });
    // res.redirect()
});

router.put('/:id', function(req, res) {
    console.log('EDIT FORM DATA THAT WAS SUBMITTED', req.body);
    character.update({
        name: req.body.name,
        class: req.body.class,
        race: req.body.race,
        backstory: req.body.backstory,
    }, {where: {id: Number(req.params.id)}})
    .then(function(response){
        console.log(response);
        res.redirect(`/characters/${Number(req.params.id)}`);
    })
    .catch(function(err){
        console.log('ERROR', err);
        res.render('404', { message: 'Update was not succesful, try again.'})
    })
})

router.get('/bind/:id', isLoggedIn, async function(req, res) {
    let characterIndex = Number(req.params.id);
    try{
        campaignList = await campaign.findAll({where: {userId: req.user.id}})
        console.log('CAMPAIGN LIST', campaignList);
    }
    catch(err){
        console.log('ERROR', err);
    }

    character.findByPk(characterIndex)
    .then(function(character) {
        if(character) {
            character = character.toJSON();
            console.log('CHARACTER BINDING', character);
            res.render('characters/bind', { character ,campaigns: campaignList});
        } else {
            console.log('This character does not exist');
            // render a 404 page
            res.render('404', { message: 'Character does not exist' });
        }
    })
    .catch(function(error) {
        console.log('ERROR', error);
    });
    
})

router.put('/bind/:id', async function(req, res) {

    try{
        characterTemp =  await character.findByPk(Number(req.params.id));
        console.log('Campaign ID', req.body.campaignId)
    }
    catch(err) {
        console.log('ERROR', err);
    }

    campaign.findOne({
        where: {id: Number(req.body.campaignId)}
    })
    .then (campaign => {
        console.log("CORRECT CAMPAIGN", campaign);
        console.log("CORRECT CHARACTER", characterTemp);
        campaign.addCharacter(characterTemp);
        campaign.save();
        res.redirect('/characters');
    })
    .catch(function(error) {
        console.log('ERROR', error);
        res.render('404', { message: 'Location was not added please try again...' });
    });
})

router.delete('/:id', function(req,res){ 
    console.log('ID', req.params.id);
    character.destroy({ where: { id: Number(req.params.id)}})
    .then(function(response) {
        console.log('CHARACTER DELETED', response);
        res.redirect('/characters');
    })
    .catch(function(err) {
        console.log('ERROR', err);
        res.render('404', { message: 'Character was not deleted, try again.'})
    })
})


router.get('/edit/:id', function(req, res) {
    let characterIndex = Number(req.params.id);
    character.findByPk(characterIndex)
    .then(function(character) {
        if(character) {
            character = character.toJSON();
            console.log('CHARACTER EDITED', character);

            axios.get(API_URL + 'classes') 
            .then(function (response) {
            if(response.status === 200) {
                let classList = [];
                for(let i = 0; i < response.data.count; i++) {
                    classList.push(response.data.results[i].name);
                }
                axios.get(API_URL + 'races') 
                .then(function (response) {
                if(response.status === 200) {
                    let raceList = [];
                    for(let i = 0; i < response.data.count; i++) {
                        raceList.push(response.data.results[i].name);
                    }
                    res.render('characters/edit', { classList: classList, raceList: raceList, character});
                }else{
                    console.log('NO RESPONSE');
                }
                })
                .catch(function (err) {
                    console.log("API Error", err);
                });
            }else{
                console.log('NO RESPONSE');
            }
            })
            .catch(function (err) {
                console.log("API Error", err);
            });  
            //res.render('characters/edit', { character });
        } else {
            console.log('This character does not exist');
            // render a 404 page
            res.render('404', { message: 'Character does not exist' });
        }
    })
    .catch(function(error) {
        console.log('ERROR', error);
    });
    
})

router.get('/:id', function(req, res) {
    console.log(req.params.id);
    character.findByPk(Number(req.params.id))
    .then(function(character){
        if (character){
            character = character.toJSON();
            console.log('CHARACTER SHOWN', character);
            res.render('characters/show', {character});
        }else{
            res.render('404', {message: 'character does not exist' })
        }
    })
    .catch(function(err){
        console.log("ERROR", err);
        res.json({ message: 'This character does not exist, Try again'});
        
    })
})

router.get('/b/:id', function(req, res) {
    //get all characters
    let campaignId = Number(req.params.id);
    character.findAll({
        where: {campaignId: campaignId}
    })
    .then(function(characterList){
        console.log('FOUND ALL CHARACTER', characterList);
        res.render('characters/boundIndex', { characters: characterList, campaignId: campaignId});

    })
    .catch(function(err){
        console.log("ERROR", err);
        res.json({ message: 'Error occured, Try again'});
    })
})


module.exports = router;

