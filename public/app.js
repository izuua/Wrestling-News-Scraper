console.log("app.js loaded");

$(document).on("click", "#news-load", () => {
    $.getJSON("/articles", function(data) {
        data.forEach(function(element) {
            $("#card-news").append(`<a href = "${element.link}"><p data-id="${element._id}"> ${element.title} <br /></p></a>`)
        })
    })
});