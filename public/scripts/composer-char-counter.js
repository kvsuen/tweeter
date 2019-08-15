$(document).ready(function() {
  $('.text-input').keyup(function() {
    $(this).siblings('.counter').text(140 - this.value.length);
    if ($(this).outerHeight() < this.scrollHeight) {
      while ($(this).outerHeight() < this.scrollHeight) {
        $(this).height($(this).height() + 1);
      }; 
    } else if ($(this).outerHeight() > 58 && $(this).outerHeight() > this.scrollHeight) {
      while ($(this).outerHeight() > 58 && $(this).outerHeight() > this.scrollHeight) {
        $(this).height($(this).height() - 1);
      };
    }
    if (this.value.length > 140) {
      $(this).siblings('.counter').css({"color": "rgb(175, 0, 0)"});
    } else {
      $(this).siblings('.counter').css({"color": "#545149"});
    }
  });
});
