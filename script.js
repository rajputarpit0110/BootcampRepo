document.addEventListener("DOMContentLoaded", function () {

  // 🔹 Get all song divs
  const songs = document.querySelectorAll(".song");

  // 🔹 Audio files (same order as songs)
  const files = [
    "Tareefan.mp3",
    "Wajah Bewajah (From Do Deewane Seher Mein).mp3",
    "Samjhawan.mp3",
    "Nazare.mp3",
    "Kasturi (From Amar Prem Ki Prem Kahani).mp3",
    "Thinking of You.mp3",
    "Iss Tarah.mp3",
    "Khat.mp3",
    "O Meri Laila.mp3"
  ];

  const audio = new Audio();
  let currentSong = 0;

  const playBtn = document.querySelector(".play");
  const nextBtn = document.querySelector(".fa-caret-right");
  const prevBtn = document.querySelector(".fa-caret-left");
  const navPart2 = document.querySelector(".nav-part2");
  const progress = document.querySelector('.progress');
  const timeCurr = document.querySelector('.time-current');
  const timeDur = document.querySelector('.time-duration');

  function formatTime(sec) {
    if (!isFinite(sec)) return '00:00';
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  // 🔹 Function to play song
  function playSong(index) {

    if (!files[index]) return; // safety check

    currentSong = index;

    audio.src = "songs/" + files[index];
    audio.play();

    // highlight active song
    for (let i = 0; i < songs.length; i++) {
      songs[i].classList.remove("active");
    }

    songs[index].classList.add("active");

    if (navPart2) {
      navPart2.textContent = songs[index].textContent;
    }

    updateIcon();
  }

  // 🔹 Update play/pause icon
  function updateIcon() {
    if (!playBtn) return;

    if (audio.paused) {
      playBtn.classList.remove("fa-pause");
      playBtn.classList.add("fa-play");
    } else {
      playBtn.classList.remove("fa-play");
      playBtn.classList.add("fa-pause");
    }
  }

  // 🔹 Click on song
  for (let i = 0; i < songs.length; i++) {
    songs[i].addEventListener("click", function () {
      playSong(i);
    });
  }

  // 🔹 Play button
  if (playBtn) {
    playBtn.addEventListener("click", function () {

      if (!audio.src) {
        playSong(0); // first song play
        return;
      }

      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }

      updateIcon();
    });
  }

  // 🔹 Next button
  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      currentSong++;
      if (currentSong >= files.length) {
        currentSong = 0;
      }
      playSong(currentSong);
    });
  }

  // 🔹 Previous button
  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      currentSong--;
      if (currentSong < 0) {
        currentSong = files.length - 1;
      }
      playSong(currentSong);
    });
  }

  // 🔹 Auto next when song ends
  audio.addEventListener("ended", function () {
    if (nextBtn) nextBtn.click();
    if (navPart2) navPart2.textContent = '';
  });

  audio.addEventListener('loadedmetadata', function () {
    if (timeDur) timeDur.textContent = formatTime(audio.duration);
  });

  audio.addEventListener('timeupdate', function () {
    if (timeCurr) timeCurr.textContent = formatTime(audio.currentTime);
    if (progress && audio.duration) progress.value = (audio.currentTime / audio.duration) * 100;
  });

  if (progress) {
    progress.addEventListener('input', function () {
      if (!audio.duration) return;
      audio.currentTime = (progress.value / 100) * audio.duration;
    });
  }

  audio.addEventListener('play', function () {
    if (navPart2 && songs[currentSong]) navPart2.textContent = songs[currentSong].textContent;
  });

  audio.addEventListener('pause', function () {
    if (navPart2) navPart2.textContent = '';
  });

});
