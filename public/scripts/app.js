/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

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
        <img class="avatar" src=${tweet.user.avatars} alt="User Avatar" title="User Avatar" >
        <p class="user-name">${tweet.user.name}</p>
        <h5 class="handle">${tweet.user.handle}</h5>
      </header>
      <div class="tweet-body">
        <p>${tweet.content.text}</p>
      </div>
      <footer>
        <p class="date">${getTimeSincePost(tweet.created_at)}</p>
        <div class="tweet-user-options">
          <button><img src="/images/flag.png" alt="Flag Tweet" title="Flag Tweet"> </button> 
          <button><img src="/images/retweet.png" alt="Retweet" title="Retweet"> </button>  
          <button><img src="/images/rose.png" alt="Like!" title="Like!"> </button>
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

$(document).ready(function () {
  loadTweets();

  $('.new-tweet').submit(function(event) {
    event.preventDefault();
    const form = $(this).children('form');

    // userInput used for tweet validation prior to sanitizing
    const userInput = $('.new-tweet textarea').val()
    
    // serialize because server expects query string
    // sanitizing user input
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

    $('.error-no-msg').fadeOut();
    $('.error-excess-msg').fadeOut();
    
    if (userInput.length === 0) {
      $('.error-no-msg').slideDown(400, function() {
        $('.new-tweet').find('.text-input').focus();
      });
    } else if (userInput.length > 140) {
      $('.error-excess-msg').slideDown(400, function() {
        $('.new-tweet').find('.text-input').focus();
      });
    } else {
      $.ajax({
        type: 'POST',
        url: '/tweets',
        data: safeFormData,
      })
        .success(function() {
          $('.successful-tweet').fadeIn(400, function() {
            $('.successful-tweet').delay(2000).fadeOut(400);
          });
          $('.new-tweet').find('.text-input').val('');
          $('.new-tweet').find('.counter').text(140);
          $('.text-input').height(58);
          // update page when using posts tweet
          // do another ajax request to get updated tweet data and prepend new tweet to the page
          // this is a smoother effect compared to $('article').remove() and then loadTweets()
          $.ajax({
            type: 'GET',
            url: '/tweets'
          })
            .success(function(data) {
              $("#tweets-container").prepend(createTweetElement(data[0]));
            });
        });
    }
  });

  $('nav .write-tweet-toggle').click(function() {
    $('.new-tweet').slideToggle(400, function() {
      $('.new-tweet').find('.text-input').focus();
    });
  });

  $('.back-to-top').click(function() {
    window.scrollTo(0, 0);
    $('.new-tweet').slideDown(400, function() {
      $('.new-tweet').find('.text-input').focus();

    });
  });

  $(window).scroll(function() {
    if ($(window).scrollTop() < 350) {
      $('.back-to-top').fadeOut(400);
      $('.write-tweet-toggle').fadeIn(400);
    }
    if ($(window).scrollTop() >= 350) {
      $('.back-to-top').fadeIn(400);
      $('.write-tweet-toggle').fadeOut(400);
    }
  });
});