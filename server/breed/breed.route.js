'use strict';

const express = require('express');
const router = express.Router();
const breedController = require('./breed.controller');

router.get('/all', breedController.loadSearchBar);
//In Express, order matters. Previously had this as the last router.get and
//it did not work because with (/:breedName) listed first it just assumed
//(/all) was a substitute for breedName

router.get('/:breedName', breedController.showBreedPage);

router.get('/search/:breedName', breedController.saveInputFromBreedSearch);

router.get('/fetch/:breedName', breedController.fetchBreedData);

module.exports = router;
