'use strict';

module.exports = {
  getDataFromDogCEOApi,
  getDataFromYouTubeApi
};

const axios = require('axios');
const DOG_CEO_BREED_URL = 'https://dog.ceo/api/breed/';// API FOR ?
const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';// API FOR ?

function getDataFromDogCEOApi(searchTerm) {
  let query;
  if(searchTerm.indexOf(' ') >= 0) {
    let splitTerm = searchTerm.split(' ');
    query = `${splitTerm[1]}/${splitTerm[0]}/images`;
  } else {
    query = `${searchTerm}/images`;
  }
  return axios.get(DOG_CEO_BREED_URL+query)
    .then((data) => {
      return data.data; // Why are you not using promise.resolve ?
    })
    .catch(err => {
      console.log(`Error in fetching images from dog CEO ${err}`);
      return Promise.reject(err);
    });
}

function getDataFromYouTubeApi(searchTerm) {
  const query = {
    q: `${searchTerm} dog breed`,
    part: 'snippet',
    key: 'AIzaSyBQV-GhhCOVYxkTVYtSzufauAvpVxNr_4o',
  };
  let queryString = '?';
  for (var key in query) {
    queryString += `${key}=${encodeURIComponent(query[key])}&`;
  }
  queryString = queryString.substr(0, queryString.length-1);
  return axios.get(YOUTUBE_SEARCH_URL+queryString)
    .then((data) => {
      return data.data.items;  // Why are you not using promise.resolve ?
    })
    .catch(err => {
      console.log(`Error in fetching videos from YouTube ${err}`);
      return Promise.reject(err);
    });
}
