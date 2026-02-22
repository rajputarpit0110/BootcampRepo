document.addEventListener("DOMContentLoaded", function () {

  // 🔹 Get all song divs
  const songs = document.querySelectorAll(".song");

  // 🔹 Audio files (same order as songs in HTML)
  const files = [
    "Tareefan.mp3",
    "Wajah Bewajah (From Do Deewane Seher Mein).mp3",
    "Samjhawan.mp3",
    "Nazare.mp3",
    "Kasturi (From Amar Prem Ki Prem Kahani).mp3",
    "Thinking of You.mp3",
    "Iss Tarah.mp3",
    "Khat.mp3",
    "O Meri Laila.mp3",
    "Dil (feat. Sara Gurpal).mp3",
    "Bam Lahiri.mp3",
    "Lae Dooba.mp3",
    "Shararat (From Dhurandhar).mp3",
    "Main Hoon (From Battle Of Galwan).mp3",
    "Qubool (From Haq).mp3",
    "Parvati Boli Shankar Se.mp3",
    "Preet Re - From Dhadak 2.mp3",
    "Apna Bana Le.mp3",
    "Nazm Nazm.mp3",
    "Saiyaara (From Saiyaara).mp3"
  ];

  // 🔹 Image files
  const images = [
    "images/Tareefan.jfif",
    "images/Wajah Bewajah (From Do Deewane Seher Mein).jfif",
    "images/Samjhawan.jfif",
    "images/Nazare.jfif",
    "images/Kasturi (From Amar Prem Ki Prem Kahani).jfif",
    "images/Thinking of You.jfif",
    "images/Iss Tarah.jfif",
    "images/Khat.jfif",
    "images/O Meri Laila.jfif",
    "images/Dil.jfif",
    "images/Bam Lahiri.jfif",
    "images/Lae Dooba.jfif",
    "images/Shararat.jfif",
    "images/Main Hoon.jfif",
    "images/Qubool.jfif",
    "images/Parvati Boli Shankar Se.jfif",
    "images/Preet Re.jfif",
    "images/Apna Bana Le.jfif",
    "images/Nazm Nazm.jfif",
    "images/Saiyara.jfif"
  ];

  const audio = new Audio();
  let currentSong = 0;
  let loopMode = 0; // 0: loop off, 1: loop on

  const playBtn = document.querySelector(".play");
  const nextBtn = document.querySelector(".fa-caret-right");
  const prevBtn = document.querySelector(".fa-caret-left");
  const replayBtn = document.querySelector(".replay");
  const loopBtn = document.querySelector(".loop");
  const navPart2 = document.querySelector(".nav-part2");
  const progress = document.querySelector('.progress');
  const timeCurr = document.querySelector('.time-current');
  const timeDur = document.querySelector('.time-duration');
  const backdrop = document.querySelector('.song-backdrop');
  const upperImage = document.querySelector('.upper-image-container');
  const volume = document.querySelector('.volume');
  const volumeIcon = document.querySelector('.volume-icon');
  let prevVolume = 1;
  const pulses = document.querySelectorAll('.pulse');
  const bars = document.querySelectorAll('.visualizer .bar');

  // 🔹 Web Audio API Setup
  let audioContext;
  let analyser;
  let dataArray;
  let animationId;

  function initAudioContext() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      const source = audioContext.createMediaElementAudioSource(audio);
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      dataArray = new Uint8Array(analyser.frequencyBinCount);
    }
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
  }

  function updateVisualizer() {
    if (!analyser) return;
    
    analyser.getByteFrequencyData(dataArray);
    const barCount = bars.length;
    const dataPointsPerBar = Math.floor(dataArray.length / barCount);

    bars.forEach((bar, index) => {
      let sum = 0;
      for (let i = 0; i < dataPointsPerBar; i++) {
        sum += dataArray[index * dataPointsPerBar + i];
      }
      const average = sum / dataPointsPerBar;
      const barHeight = (average / 255) * 15 + 1; // Scale to rem
      bar.style.height = barHeight + 'rem';
    });

    animationId = requestAnimationFrame(updateVisualizer);
  }

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

    // Update images
    if (backdrop && images[index]) {
      backdrop.style.backgroundImage = `url('${images[index]}')`;
    }
    if (upperImage && images[index]) {
      upperImage.style.backgroundImage = `url('${images[index]}')`;
      upperImage.classList.add("show");
    }
    
    // Hide bg.jpg when song plays
    const upperPlayer = document.querySelector('.upper-player');
    if (upperPlayer) {
      upperPlayer.classList.add('song-playing');
    }

    // Start pulse animation
    pulses.forEach(pulse => {
      pulse.classList.add('animate');
    });

    // highlight active song
    for (let i = 0; i < songs.length; i++) {
      songs[i].classList.remove("active");
    }

    songs[index].classList.add("active");

    if (navPart2) {
      navPart2.textContent = songs[index].textContent;
      navPart2.classList.add('show');
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
      if (loopMode === 1) {
        // Loop is on - replay same song
        audio.currentTime = 0;
        audio.play();
      } else {
        // Loop is off - go to next song
        currentSong++;
        if (currentSong >= files.length) {
          currentSong = 0;
        }
        playSong(currentSong);
      }
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
    if (loopMode === 1) {
      // Repeat same song
      audio.currentTime = 0;
      audio.play();
    } else {
      // Go to next song
      if (nextBtn) nextBtn.click();
    }
    if (navPart2) navPart2.textContent = '';
  });

  // 🔹 Replay button
  if (replayBtn) {
    replayBtn.addEventListener("click", function () {
      audio.currentTime = 0;
      audio.play();
      updateIcon();
    });
  }

  // 🔹 Loop button
  if (loopBtn) {
    loopBtn.addEventListener("click", function () {
      loopMode = loopMode === 0 ? 1 : 0;
      
      if (loopMode === 1) {
        loopBtn.classList.add("active");
      } else {
        loopBtn.classList.remove("active");
      }
    });
  }

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

  // 🔹 Volume control
  if (volume) {
    // set initial audio volume
    audio.volume = parseFloat(volume.value);

    volume.addEventListener('input', function () {
      const v = parseFloat(volume.value);
      audio.volume = v;
      if (volumeIcon) {
        if (v === 0) {
          volumeIcon.classList.remove('fa-volume-high');
          volumeIcon.classList.add('fa-volume-xmark');
          volumeIcon.style.color = '#0099ff';
        } else {
          volumeIcon.classList.remove('fa-volume-xmark');
          volumeIcon.classList.add('fa-volume-high');
          // if loop active keep its own color; otherwise default
          volumeIcon.style.color = '#0099ff';
        }
      }
    });

    if (volumeIcon) {
      volumeIcon.addEventListener('click', function () {
        if (audio.volume > 0) {
          prevVolume = audio.volume;
          audio.volume = 0;
          volume.value = 0;
          volumeIcon.classList.remove('fa-volume-high');
          volumeIcon.classList.add('fa-volume-xmark');
          volumeIcon.style.color = '#0099ff';
        } else {
          audio.volume = prevVolume || 1;
          volume.value = audio.volume;
          volumeIcon.classList.remove('fa-volume-xmark');
          volumeIcon.classList.add('fa-volume-high');
          volumeIcon.style.color = '#0099ff';
        }
      });
    }
  }

  audio.addEventListener('play', function () {
    if (navPart2 && songs[currentSong]) navPart2.textContent = songs[currentSong].textContent;
    // Start pulse animation
    pulses.forEach(pulse => {
      pulse.classList.add('animate');
    });
    // Start visualizer
    initAudioContext();
    updateVisualizer();
    updateIcon();
  });

  audio.addEventListener('pause', function () {
    // Stop pulse animation
    pulses.forEach(pulse => {
      pulse.classList.remove('animate');
    });
    // Stop visualizer
    cancelAnimationFrame(animationId);
    bars.forEach(bar => {
      bar.style.height = '1rem';
    });
    updateIcon();
  });

});
