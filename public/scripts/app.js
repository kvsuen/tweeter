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
        $('article').remove();
        $('.new-tweet').find('textarea').val('');
        $('.new-tweet').find('.counter').text(140);
        loadTweets();
      });
  });

});