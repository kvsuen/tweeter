/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(document).ready(function () {
  const renderTweets = function(tweets) {
    for (const tweet of tweets) {
      let $tweet = createTweetElement(tweet);
      $("#tweets-container").append($tweet);
    }
  };
  
  const createTweetElement = function(tweet) {
    const markup = `
        <header>
          <img src=${tweet.user.avatars}>
          <span>${tweet.user.name}</span>
          <aside>${tweet.user.handle}</aside>
        </header>
        <div>${tweet.content.text}</div>
        <footer>
          <p>${Math.floor((Date.now() - tweet.created_at) / 1000 / 60 / 60 / 24)} days ago</p>
          <aside>
            <button>🚩</button> 
            <button>🌀</button>  
            <button>❤</button>
          </aside>
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
    const formData = $(this).children('form').serialize();

    $.ajax({
      type: 'POST', 
      url: '/tweets', 
      data: formData,
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
                <img src=${data[0].user.avatars}>
                <span>${data[0].user.name}</span>
                <aside>${data[0].user.handle}</aside>
              </header>
              <div>${data[0].content.text}</div>
              <footer>
                <p>${Math.floor((Date.now() - data[0].created_at) / 1000 / 60 / 60 / 24)} days ago</p>
                <aside>
                  <button>🚩</button> 
                  <button>🌀</button>  
                  <button>❤</button>
                </aside>
              </footer>
              `
            ));
          });
      });
  });

});