function loadPage(pageUri) {
    $.get(pageUri).done(function(content){
        $('#placeholder').html(function(){
            return content;
        });
    });
}

function loadDefaultPage() {
    loadPage('about.html');
}

$('.navbar-brand').click(loadDefaultPage);

$('.navbar-nav li a').click(function(){
    loadPage($(this).html() + ".html");
});

$(document).ready(loadDefaultPage);

