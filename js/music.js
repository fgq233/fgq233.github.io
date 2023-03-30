const play = document.getElementById("play");
const music = document.querySelector("audio");
const img = document.querySelector("img");
const title = document.getElementById("title");
let progress = document.getElementById("progress");
let currentTimeUpdate = document.getElementById("current_time");
let durationTime = document.getElementById("duration");
const progress_div = document.getElementById("progress_div");
const mute = document.getElementById("mute");
const loop = document.getElementById("loop");


let isPlaying = false;
let songIndex = 0;

// 初始化
function onloadFun() {
    loadSong(songs[0]);
}

// 加载音频
function loadSong(song) {
    title.textContent = song.title;
    music.src = song.url;
}

// 切换播放状态
function toggleStatus() {
    if (isPlaying) {
        pauseMusic();
        play.classList.replace("fa-pause", "fa-play");
        img.classList.remove("anime");
        play.title = "播放";
    } else {
        playMusic();
        play.classList.replace("fa-play", "fa-pause");
        img.classList.add("anime");
        play.title = "暂停";
    }
    isPlaying = !isPlaying;
}

// 播放
function playMusic() {
    music.play();
}

// 暂停
function pauseMusic() {
    music.pause();
}

// 后一首
function nextSong() {
    songIndex = (songIndex + 1) % songs.length;
    loadSong(songs[songIndex]);
    playMusic();
}

// 前一首
function prevSong() {
    songIndex = (songIndex - 1 + songs.length) % songs.length;
    loadSong(songs[songIndex]);
    playMusic();
}

// 顺序播放 - 单曲循环
function changMode() {
    loop.classList.toggle("active");
    if (loop.classList.contains("active")) {
        music.loop = true;
        loop.title = "顺序播放";
    } else {
        music.loop = false;
        loop.title = "单曲循环";
    }
}

// 静音
function muteAudio() {
    mute.classList.toggle("active");
    if (mute.classList.contains("active")) {
        music.muted = true;
        mute.title = "取消静音";
    } else {
        music.muted = false;
        mute.title = "静音";
    }
}


// 进度
music.addEventListener("timeupdate", (event) => {
    const {currentTime, duration} = event.srcElement;
    // Percentage
    let progressTime = (currentTime / duration) * 100;
    progress.style.width = `${progressTime}%`;

    // current time update:
    let minuteCurrentTime = Math.floor(currentTime / 60);
    let secondCurrentTime = Math.floor(currentTime % 60);
    if (secondCurrentTime < 10) {
        secondCurrentTime = `0${secondCurrentTime}`;
    }
    currentTimeUpdate.textContent = `${minuteCurrentTime}:${secondCurrentTime}`;

    // music duration update
    let minuteDuration = Math.floor(duration / 60);
    let secondDuration = Math.floor(duration % 60);
    if (secondDuration < 10) {
        secondDuration = `0${secondDuration}`;
    }
    if (duration) {
        durationTime.textContent = `${minuteDuration}:${secondDuration}`;
    }
});

// 点击进度条
progress_div.addEventListener("click", (event) => {
    const {duration} = music;
    let move_progress = (event.offsetX / event.srcElement.clientWidth) * duration;
    music.currentTime = move_progress;
});

// 播放完毕
music.addEventListener("ended", nextSong);
