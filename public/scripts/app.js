/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const getTimeSincePost = function(initialTime) {
  const timeInSeconds = (Date.now() - initialTime) / 1000;
  const timeInMinutes = timeInSeconds / 60;
  const timeInHours = timeInMinutes / 60;
  const timeInDays = timeInHours / 24;

  if (timeInSeconds < 60) {
    return `${Math.floor(timeInSeconds)} seconds ago`;
  } else if (timeInMinutes < 60) {
    return `${Math.floor(timeInMinutes)} minutes ago`;
  } else if (timeInHours < 24) {
    return `${Math.floor(timeInHours)} hours ago`;
  } else {
    return `${Math.floor(timeInDays)} days ago`;
  }
};

$(document).ready(function () {
  const renderTweets = function(tweets) {
    const container = $('#tweets-container');
    for (const tweet of tweets) {
      let $tweet = createTweetElement(tweet);
      container.append($tweet);
    }
  };
  
  const createTweetElement = function(tweet) {
    const markup = `
        <header>
          <img class="avatar" src=${tweet.user.avatars}>
          <p class="user-name">${tweet.user.name}</p>
          <h5 class="handle">${tweet.user.handle}</h5>
        </header>
        <div class="tweet-body">
          <p>${tweet.content.text}</p>
        </div>
        <footer>
          <p class="date">${getTimeSincePost(tweet.created_at)}</p>
          <div class="tweet-user-options">
            <button>🚩</button> 
            <button>🌀</button>  
            <button>❤</button>
          </div>
        </footer>
    `;
    
    return $('<article>').addClass('tweet').html(markup);
  };

  const loadTweets = function() {
    $.ajax({
      type: 'GET',
      url: '/tweets'
    })
      .success(function(data) {
        renderTweets(data);
      });
  };

  loadTweets();

  $('.new-tweet').submit(function(event) {
    event.preventDefault();
    
    //server expects query string
    const form = $(this).children('form');
    const formData = form.serialize();

    const safeFormData = {};
    $.each(form.serializeArray(), function() {
      safeFormData[this.name] = this.value
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\//g, '&#x2F');
    });

    if (formData.length === 5) {
      alert('Empty tweet. Please enter a message!');
    } else if ( formData.length > 145) {
      alert('Tweet is too long!');
    } else {
      $.ajax({
        type: 'POST',
        url: '/tweets',
        data: safeFormData,
      })
        .success(function() {
          $('.new-tweet').find('textarea').val('');
          $('.new-tweet').find('.counter').text(140);
          // update page when using posts tweet
          // do another ajax request to get updated tweet data and prepend new tweet to the page
          // this is a smoother effect compared to $('article').remove() and then loadTweets()
          $.ajax({
            type: 'GET',
            url: '/tweets'
          })
            .success(function(data) {
              $("#tweets-container").prepend($('<article>').addClass('tweet').html(
                `
                <header>
                  <img class="avatar" src=${data[0].user.avatars}>
                  <p class="user-name">${data[0].user.name}</p>
                  <h5 class="handle">${data[0].user.handle}</h5>
                </header>
                <div class="tweet-body">
                  <p>${data[0].content.text}</p>
                </div>
                <footer>
                  <p class="date">${getTimeSincePost(data[0].created_at)}</p>
                  <div class="tweet-user-options">
                    <button>🚩</button> 
                    <button>🌀</button>  
                    <button>❤</button>
                  </div>
                </footer>
                `
              ));
            });
        });
    }
  });

  $('nav .write-tweet-toggle').click(function() {
    $('.new-tweet').slideToggle(400, function() {
      $('.new-tweet').find('textarea').focus();
    });
  });

});