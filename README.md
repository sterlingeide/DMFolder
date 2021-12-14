# `DM Folder`

A website that stores all of your D&D campaign notes in an orderly and organized fashion.

![Front Page](https://i.imgur.com/t5VYTem.png)

https://dm-folder.herokuapp.com

## User Stories
As a user I want to:
* Create Characters
  * Add information from official classes and races
  * Add ny own personal information
  * Connect characters with my campaigns
* Create Campaigns
  * View characters, villains, locations, etc. of my campaign
  * Have the information sorted and organized to easily find what I'm looking for

## ERD
This ERD details the information stored in the database and the associations between them.
![ERD](https://i.imgur.com/uiQjYQm.png)


## Wire Frame
This is the original plan for how the site would be connected and a rough layout of its look.
![Wire Frame](https://i.imgur.com/H3Lhgyb.png)

## Routing

| Method | Path | Location | Purpose |
| ------ | ---------------- | -------------- | ------------------- |
| GET | / | server.js | Home page |
| GET | /auth/login | auth.js | Login form |
| GET | /auth/signup | auth.js | Signup form |
| POST | /auth/login | auth.js | Login user |
| POST | /auth/signup | auth.js | Creates User |
| GET | /auth/logout | auth.js | Removes session info |
| GET | /profile | server.js | Regular User Profile |
| GET | /campaigns/ | campaigns.js | Display campaigns|
| GET | /campaigns/new | campaigns.js | Page to create new campaign|
| POST | /campaigns/ | campaigns.js | Creates campaign|
| PUT | /campaigns/:id | campaigns.js | Updates campaign|
| DELETE | /campaigns/:id | campaigns.js | Deletes Campaign |
| GET | /campaigns/edit/:id | campaigns.js | Page to edit campaign|
| GET | /campaigns/:id | campaigns.js | Page to show selected campaign|
| GET | /characters/ | characters.js | Display Characters |
| GET | /characters/new | characters.js | Page to Create new characters |
| POST | /characters/ | characters.js | Creates a character |
| PUT | /characters/:id | characters.js | Updats character |
| GET | /characters/bind/:id | characters.js | Page to put a character in a campaign |
| PUT | /characters/bind/:id | characters.js | Puting character in campaign|
| DELETE | /characters/:id | characters.js | Delets character|
| GET | /characters/edit/:id | characters.js | Page to edit a character |
| GET | /characters/:id | characters.js | Page to show a character |
| GET | /characters/b/:id | characters.js | Page to show characters in a campaign|
| GET | /locations/:id | locations.js | Page to show locations in a campaign |
| GET | /locations/new/:id | locations.js | Page to make a new location in a campaign |
| POST | /locations/:id/ | locations.js | Creates a location in a campaign |
| PUT | /locations/:id | locations.js | Updates a location|
| DELETE | /locations/:id | locations.js | Deletes a location|
| GET | /locations/edit/:id | locations.js | Page to edit a location |
| GET | /locations/s/:id | locations.js | Page to show a location|

There are also routes for lores, majorFactions,stories, and villains that are  very similar to/the same as the routes for locations.

## Code Snippets for CRUD
The examples will be from various controllers that show the more complex implementations.
### Create
```text
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
```
This code is creating a location inside a campaign which is why it has to find the campaign before it creates the new location.

### Read
```text
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
```
This code shows all of the characters in a campaign so it searches all of the characters for the ones that are connected to the given campaign. 

### Update
```text 
router.put('/:id', function(req, res) {
    console.log('EDIT FORM DATA THAT WAS SUBMITTED', req.body);
    let idNumber = Number(req.params.id);
    character.update({
        name: req.body.name,
        backstory: req.body.backstory,
    }, {where: {id: idNumber}})
    .then(function(response){
        console.log(response);
        if(req.body.class){
            character.update({
                class: req.body.class
            }, {where: {id: idNumber}})
            .then(function(response){
                if(req.body.race){
                    character.update({
                        race: req.body.race
                    }, {where: {id: idNumber}})
                    .then(function(response){
                        res.redirect(`/characters/` + idNumber);
                    })
                }else{
                    res.redirect(`/characters/` + idNumber);
                }
            })
        }else if(req.body.race){
            character.update({
                race: req.body.race
            }, {where: {id: idNumber}})
            .then(function(response){
                res.redirect(`/characters/` + idNumber);
            })
        }else{
            res.redirect(`/characters/${idNumber}`);
        }
    })
    .catch(function(err){
        console.log('ERROR', err);
        res.render('404', { message: 'Update was not succesful, try again.'})
    })
})
```
This code is updating a character with new values that the user enters. It uses if statements to not update certain values if no value was chosen from the dropdown list rather than overriding the old values with nothing. 

### Delete
```text 
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
```
This code deletes the chosen location. It uses an async function to guarantee it gets the campaign ID from the location before deleting it. It then uses that ID to redirect to the locations from the correct campaign.
