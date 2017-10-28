'use strict';

function getDataFromAllApis(searchTerm) {
  $.get('/breeds/fetch/'+searchTerm)
    .done(function ({imageUrls, youTubeData}) {
      showDogImages(imageUrls);
      showYouTubeResults(youTubeData);
    })
    .fail(function (error) {
      console.log(error);
    });
}

function showDogImages(result) {
  let html = '';
  for (let i=0; i<result.length; i++) {
    html += `<img class="dog-image" border="8px" src=${result[i]}>`;
  }
  $('.js-images-div').append(html);
}

function showYouTubeResults(result) {
  var html = ' ';
  $.each(result, function (index, value) {
    if (value.id.videoId) {
      let videoLink = 'https://www.youtube.com/watch?v=' + value.id.videoId;
      //html += `<a href="${videoLink}"><img src="${value.snippet.thumbnails.default.url}"/></a>`;
      //above would be for having a thumbnail that when clicked goes to youtube itself
      let embedLink = 'https://www.youtube.com/embed/' + value.id.videoId;
      if ((value.snippet.title).length > 35) {
        value.snippet.title = (value.snippet.title).substr(0, 35)+'...';
      }
      html += `<div title="youtube-video-${index}"><iframe width="350" height="250" src="${embedLink}"></iframe>` +
              '<br>' +
              `<a href="${videoLink}">${value.snippet.title}</a></div>`;
    }
  });
  $('.js-videos-div').append(html);
}

//getting the breed name from the backend and using it to add a title
//and make API calls
let resultDog = window.location.pathname.replace('/breeds/', '');
if (resultDog.indexOf('%20') >= 1) {
  resultDog = resultDog.split('%20');
  resultDog = resultDog[0]+' '+resultDog[1];
}
$('h1').html(resultDog.toUpperCase());

getDataFromAllApis(resultDog);
//end of above comment section

$('.js-add-to-favorites-button').click(event => {
  $.ajax({
    url: '/api/favorites/' + resultDog,
    method: 'POST',
    data: {breed: resultDog}
  })
    .done(function (done) {
      $('p').append('Added To My Favorites');
      console.log(done);
    })
    .fail(function (fail) {
      console.log(fail);
    });
});

$('.js-log-out-button').click(function(event) {
  window.location.href = '/auth/logout';
});

$('.js-go-to-search-button').click(function(event) {
  window.location.href = '/search';
});

$('.js-view-favorites-button').click(function(event) {
  window.location.href = '/api/favorites';
  //This triggers a move to the api/favorites('/') route which calls showFavorites.
  //Show favorites is a function that loads the favorites HTML page. The
  //favorites HTML page automatically loads the favoritesFrontEnd js. This then
  //immediately calls the getFavorites function which makes a json call to
  //the api/favorites('/all') route. The ('/all') route finds the user and sends
  //back a json object with their favorites. Once that response is sent to the 
  //front end, the same function that made that ajax request uses the response
  //and then calls drawFavoritesList which goes through the json user favorites
  //data and turns it into html and inserts it onto the page.
});
