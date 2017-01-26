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

$.getJSON( "database.json", function(data) {
    console.log("ello");
  var items = [];
  $.each( data, function( key, val ) {
    items.push( "<li><a href=\"#\">" + key + "</a></li>" );
  });

  $( "<ul/>", {
    "class": "nav navbar-nav",
    html: items.join( "" )
  }).appendTo( "#navbar" );
  
  $('.navbar-nav li a').click(function(){
    loadPage($(this).html() + ".html");
   });
});

$(document).ready(loadDefaultPage);

