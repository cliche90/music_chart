function hovering(param) {
    $(param).addClass("hovering");
}

function nonhovering(param) {
    $(param).removeClass("hovering");
}

function changeSong(params) {
    let title = $(params).find(".media-body .media-heading").text().trim();
    let artist = $(params).find(".media-body span").text().trim();

    let param = JSON.stringify({
        title: title,
        artist: artist
    });

    $.ajax({
        type: 'post',
        url: 'http://localhost:3001/songChnage',
        contentType: 'application/json',
        dataType: 'json',
        data: param,
        success: function (data) {

            debugger;
            $("#videoFrame").src = data.url;
        }
    });
}