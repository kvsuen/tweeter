$(document).ready(function() {
  $('.text-input').keyup(function() {
    $(this).siblings('.counter').text(140 - this.value.length);
    if (this.value.length > 140) {
      console.log('hi');
      $(this).siblings('.counter').css({"color": "rgb(175, 0, 0)"});
    } else {
      $(this).siblings('.counter').css({"color": "#545149"})
    }
  });
});
