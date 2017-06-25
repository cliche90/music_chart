function hovering(param) {
    $(param).addClass("hovering");
}

function nonhovering(param) {
    $(param).removeClass("hovering");
}

/***********************************************************************************************/

let player;
let playerState;
let statusCode = {
    playingNum: 0,
    playingVideoId: ''
};

function onYouTubeIframeAPIReady() {
    player = new YT.Player('videoFrame', {
        height: '100%',
        width: '100%',
        videoId: '',
        playerVars: {
            'enablejsapi': 1,
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
    changeSong(1);
}

function onPlayerStateChange(event) {
    playerState = event.data == YT.PlayerState.ENDED ? '종료됨' :
        event.data == YT.PlayerState.PLAYING ? '재생 중' :
            event.data == YT.PlayerState.PAUSED ? '일시중지 됨' :
                event.data == YT.PlayerState.BUFFERING ? '버퍼링 중' :
                    event.data == YT.PlayerState.CUED ? '재생준비 완료됨' :
                        event.data == -1 ? '시작되지 않음' : '예외';

    // debugger;
    if (event.data == YT.PlayerState.CUED) event.target.playVideo();
    if (event.data == YT.PlayerState.PAUSED) $("#playPauseButton a i").text("play_arrow");
    if (event.data == YT.PlayerState.PLAYING) $("#playPauseButton a i").text("pause");
    if (event.data == YT.PlayerState.ENDED) changeSong(statusCode.playingNum + 1);

    // console.log('onPlayerStateChange 실행: ' + playerState);
}

function playYoutube() {
    player.playVideo();
}
function pauseYoutube() {
    player.pauseVideo();
}

/***********************************************************************************************/

function onClickPlayPauseButton(param) {

    if (playerState == '재생 중') {
        pauseYoutube();
    } else {
        playYoutube();
    }
}

function onClickNext() {
    changeSong(statusCode.playingNum + 1);
}

function onClickPrevious() {
    changeSong(statusCode.playingNum - 1 == 0 ? 100 : statusCode.playingNum - 1);
}

function onClickSongTitle(params) {

    let playingNum = Number($(params).find(".media-left #rank").text().trim());
    changeSong(playingNum);
}

function changeSong(playingNum) {

    let totalCnt = 100;
    statusCode.playingNum = playingNum > totalCnt ? playingNum % totalCnt : playingNum;

    let url = document.URL.replace(new RegExp("\/charts.*"), "") + "/songChange";

    $.ajax({
        type: 'get',
        url: url,
        data: {
            rank: statusCode.playingNum
        },
        success: function (data) {
            statusCode.playingVideoId = data.videoId;
            player.cuePlaylist([data.videoId]);
            document.title = '' + data.title + ' - ' + data.artist;
            document.getElementById('naviContent').innerHTML = data.title + ' / ' + data.artist;
        }
    });
}

window.onload = function () {
}