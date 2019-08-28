$(document).ready(() => $("#wrapper").hide());

$(document).on("click", "#news-load", () => {
    $.getJSON("/articles", function (data) {
        data.forEach(function (element) {
            $("#card-news").append(`<ul class="list-group list-group-flush"><li class="list-group-item"><a href = "${element.link}"><p data-id="${element._id}"> <strong>${element.title}</strong> <br /></p></a></li></ul>`)
        })
    }).then(function () {
        $("#wrapper").show();
    })
});