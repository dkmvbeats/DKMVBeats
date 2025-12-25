document.addEventListener("DOMContentLoaded", () => {

  /* ===== AFRO LOGIC ===== */
  function toggleAfro() {
    const afro = document.getElementById('afroSubs');
    if (afro) afro.classList.toggle('hidden');
  }

  function closeAfro() {
    const afro = document.getElementById('afroSubs');
    if (afro) afro.classList.add('hidden');
  }

  /* ===== BEATS ===== */
  function loadBeats(name) {
    const list = document.getElementById('beatsList');
    if (!list) return;

    list.innerHTML = `
      <div class="beat-item">
        <strong>${name} Beat</strong>
        <div class="beat-actions">
          <button class="play-btn" data-name="${name}">▶️ Écouter</button>
        </div>
      </div>
    `;

    list.querySelector(".play-btn").addEventListener("click", () => {
      playBeat(name);
    });
  }

  /* ===== AUDIO ===== */
  const audio = document.getElementById('globalAudio');
  const player = document.getElementById('audio-player');
  const playPause = document.getElementById('playPause');
  const title = document.getElementById('trackTitle');

  function playBeat(name) {
    if (!audio) return;

    audio.src = "audio/demo.mp3";
    audio.play();

    title.textContent = name;
    player.classList.remove('hidden');
    playPause.textContent = "⏸️";
  }

  if (playPause) {
    playPause.addEventListener("click", () => {
      if (audio.paused) {
        audio.play();
        playPause.textContent = "⏸️";
      } else {
        audio.pause();
        playPause.textContent = "▶️";
      }
    });
  }

  window.toggleAfro = toggleAfro;
  window.closeAfro = closeAfro;
  window.loadBeats = loadBeats;
  window.playBeat = playBeat;

});
