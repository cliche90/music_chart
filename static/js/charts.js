function hovering(param) {
    $(param).addClass("hovering");
}

function nonhovering(param) {
    $(param).removeClass("hovering");
}

/***********************************************************************************************/

var player;

function onYouTubeIframeAPIReady() {

    player = new YT.Player('videoFrame', {
        height: 'auto',
        width: '100%',
        videoId: '',
        playerVars : {
            'autoplay': 1,
            'controls': 1,
            'html5': 1,
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError
        }
    });
}

function onPlayerError(event) {
    console.log('onPlayerError', event);
}

function onPlayerReady(event) {
    console.log('onPlayerReady 실행');
    // 플레이어 자동실행 (주의: 모바일에서는 자동실행되지 않음)
    event.target.playVideo();
}
var playerState;
function onPlayerStateChange(event) {
    playerState = event.data == YT.PlayerState.ENDED ? '종료됨' :
                  event.data == YT.PlayerState.PLAYING ? '재생 중' :
                  event.data == YT.PlayerState.PAUSED ? '일시중지 됨' :
                  event.data == YT.PlayerState.BUFFERING ? '버퍼링 중' :
                  event.data == YT.PlayerState.CUED ? '재생준비 완료됨' :
                  event.data == -1 ? '시작되지 않음' : '예외';

    if (event.data == YT.PlayerState.CUED) {
        onPlayerReady(event);
    }

    console.log('onPlayerStateChange 실행: ' + playerState);
}

/***********************************************************************************************/

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
            player.cuePlaylist([data.videoId]);
        }
    });
}