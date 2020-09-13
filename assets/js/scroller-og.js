$('a').click(function(){
    $('html, body, div, h2').animate({
        scrollTop: $( $(this).attr('href') ).offset().top
    }, 500);
    return false;
});
