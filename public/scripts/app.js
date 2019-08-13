/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const data = [
  {
    "user": {
      "name": "Newton",
      "avatars": "https://i.imgur.com/73hZDYK.png"
      ,
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1461116232227
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": "https://i.imgur.com/nlhLi3I.png",
      "handle": "@rd" },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1461113959088
  }
]

const renderTweets = function(tweets) {
  for (const tweet of tweets) {
    let $tweet = createTweetElement(tweet);
    $(document).ready(function() {
      $("#tweets-container").append($tweet);
    });
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

renderTweets(data);