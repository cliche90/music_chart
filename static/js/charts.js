function hovering(param) {
    $(param).addClass("hovering");
}

function nonhovering(param) {
    $(param).removeClass("hovering");
}

function randomRange(n1, n2) {
    return Math.floor((Math.random() * (n2 - n1 + 1)) + n1);
}

/***********************************************************************************************/

let player;
let playerState;
let statusCode = {
    playingNum: 0,
    playingVideoId: '',
    playType: 'repeat',
    isOpen: true
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

    if (event.data == YT.PlayerState.CUED) event.target.playVideo();
    else if (event.data == YT.PlayerState.PAUSED) $("#playPauseButton a i").text("play_arrow");
    else if (event.data == YT.PlayerState.PLAYING) $("#playPauseButton a i").text("pause");
    else if (event.data == YT.PlayerState.ENDED) {
        if (statusCode.playType == 'repeat') {
            changeSong(statusCode.playingNum + 1);
        } else if (statusCode.playType == 'repeat_one') {
            changeSong(statusCode.playingNum);
        } else if (statusCode.playType == 'shuffle') {
            let randNum = randomRange(1, 100);
            changeSong(randNum == statusCode.playingNum ? randNum + 1 : randNum);
        }
    }

    console.log('onPlayerStateChange 실행: ' + playerState);
}

function playYoutube() {
    player.playVideo();
}
function pauseYoutube() {
    player.pauseVideo();
}

/***********************************************************************************************/

onClickEye = function() {

    if(statusCode.isOpen) {
        $("#row1").slideUp(1600);
        $("#row2").animate({ height: '100%' }, 1600);

        $("#eyeBtn").removeClass("glyphicon-eye-open").addClass("glyphicon-eye-close")
        statusCode.isOpen = false;
    } else {
        $("#row1").slideDown(1600);
        $("#row2").animate({ height: '60%' }, 1600);

        $("#eyeBtn").removeClass("glyphicon-eye-close").addClass("glyphicon-eye-open")
        statusCode.isOpen = true;
    }
}

function onClickPlayType(param) {

    let playType = $(param).find("a i").text().trim();

    if (playType == 'repeat') {
        $(param).find("a i").text('repeat_one')
        statusCode.playType = 'repeat_one';
    } else if (playType == 'repeat_one') {
        $(param).find("a i").text('shuffle')
        statusCode.playType = 'shuffle';
    } else if (playType == 'shuffle') {
        $(param).find("a i").text('repeat')
        statusCode.playType = 'repeat';
    }

}

function onClickPlayPauseButton() {

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

    $(".media").eq(statusCode.playingNum - 1).css("background-color", "white");

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

            $(".media").eq(statusCode.playingNum - 1).css("background-color", "beige");

            let top = $('#list').scrollTop() - $('#list').offset().top + $(".media").eq(statusCode.playingNum - 1).offset().top 
            $('#list').animate({
                scrollTop: top
            }, 800);

            statusCode.playingVideoId = data.videoId;
            player.cuePlaylist([data.videoId]);
            document.title = '' + data.title + ' - ' + data.artist;
            document.getElementById('naviContent').innerHTML = data.title + ' / ' + data.artist;
        }
    });
}

window.onload = function () {
}