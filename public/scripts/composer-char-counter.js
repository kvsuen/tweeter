$(document).ready(function() {
  $('.text-input').keyup(function() {
    $(this).siblings('.counter').text(140 - this.value.length);
  });
});
