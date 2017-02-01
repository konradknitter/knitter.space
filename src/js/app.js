function loadDefaultPage() {
    loadSinglePage('about.html');

    $( "<ul/>", {
        "id": "navbar-list",
        "class": "nav navbar-nav",
    }).appendTo( "#navbar" );
    
    $.getJSON( "database.json", function(data) {
        $.each(data, function(key, val) {
            var hash = Math.random().toString(36).substr(2, 10);
            $("<li/>",{
                "id": key + "-" + hash
            }).appendTo( "#navbar-list" );

            $("<a/>", {
                "href": "#",
                "html": key
            }).appendTo("#" + key + "-" + hash);

            if (val.type === "page") {
                $("#" + key + "-" + hash).click(function(){
                    loadSinglePage(val.location);
                });
            } else if ( val.type === "directory" ) {
                $("#" + key + "-" + hash).click(function(){
                    loadMultiPage(key, val.subpages, []);
                });
            }
        });
        console.log(data);
    });
}

function loadSinglePage(pageUri) {
    $.get(pageUri).done(function(content){
        $('#placeholder').html(function(){
            return content;
        });
    });
}

function loadMultiPage(pageName, subpages, rootpages) {
    $('#placeholder').html("");

    $("<ol/>", {
        "class": "breadcrumb",
        "style": "margin-top: 20px;",
        html: rootpages.join(" ") + "<li class=\"active\">" + pageName + "</li>"
    }).appendTo("#placeholder");

    $( "<ul/>", {
        id: "multipage-list"
    }).appendTo("#placeholder");

    $.each(subpages, function(key, val) {
        var hash = Math.random().toString(36).substr(2, 10);
        $("<li/>",{
            "id": key + "-" + hash
        }).appendTo( "#multipage-list" );

        $("<a/>", {
            "href": "#",
            "html": key
        }).appendTo("#" + key + "-" + hash);

        if (val.type === "page") {
            $("#" + key + "-" + hash).click(function(){
                loadSinglePage(val.location);
            });
        } else if ( val.type === "directory" ) {
            $("#" + key + "-" + hash).click(function(){
                rootpages.push("<li>" + pageName + "</li>");
                loadMultiPage(key, val.subpages, rootpages);
            });
        }
    });
}
$(document).ready(loadDefaultPage);

