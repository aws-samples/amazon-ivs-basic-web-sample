/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// PlaybackURL
const playbackUrl = "https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8";

// App
const videoPlayer = document.getElementById("video-player");
const playerOverlay = document.getElementById("overlay");
const playerControls = document.getElementById("player-controls");
const btnPlay = document.getElementById("play");
const btnMute = document.getElementById("mute");
const btnSettings = document.getElementById("settings");
const settingsMenu = document.getElementById("settings-menu");

// Btn icons
let setBtnPaused = function(){
  btnPlay.classList.remove("btn--play");
  btnPlay.classList.add("btn--pause");
};

let setBtnPlay = function(){
  btnPlay.classList.add("btn--play");
  btnPlay.classList.remove("btn--pause");
};

let setBtnMute = function(){
  btnMute.classList.remove("btn--mute");
  btnMute.classList.add("btn--unmute");
};

let setBtnUnmute = function(){
  btnMute.classList.add("btn--mute");
  btnMute.classList.remove("btn--unmute");
};


(function (IVSPlayer) {
  const PlayerState = IVSPlayer.PlayerState;
  const PlayerEventType = IVSPlayer.PlayerEventType;

  // Initialize player
  const player = IVSPlayer.create();
  player.attachHTMLVideoElement(videoPlayer);

  // Attach event listeners
  player.addEventListener(PlayerState.PLAYING, function () {
    console.log("Player State - PLAYING");
  });
  player.addEventListener(PlayerState.ENDED, function () {
    console.log("Player State - ENDED");
  });
  player.addEventListener(PlayerState.READY, function () {
    console.log("Player State - READY");
  });
  player.addEventListener(PlayerEventType.ERROR, function (err) {
    console.warn("Player Event - ERROR:", err);
  });

  player.addEventListener(PlayerEventType.TEXT_METADATA_CUE, function (cue) {
    const metadataText = cue.text;
    const position = player.getPosition().toFixed(2);
    console.log(
      `Player Event - TEXT_METADATA_CUE: "${metadataText}". Observed ${position}s after playback started.`
    );
  });
  
  player.addEventListener(PlayerEventType.AUDIO_BLOCKED, function(){
    setBtnMute();
  });


  // Setup stream and play
  player.setAutoplay(true);
  player.load(playbackUrl);

  // Setvolume
  player.setVolume(0.1);

  // Show/Hide player controls
  playerOverlay.addEventListener(
    "mouseover",
    function (e) {
      playerOverlay.classList.add("player--hover");
    },
    false
  );
  playerOverlay.addEventListener("mouseout", function (e) {
    playerOverlay.classList.remove("player--hover");
  });

  // Controls events
  // Play/Pause
  btnPlay.addEventListener(
    "click",
    function (e) {
      if (btnPlay.classList.contains("btn--play")) {
        // change to pause
        setBtnPaused();
        player.pause();
      } else {
        // change to play
        setBtnPlay();
        player.play();
      }
    },
    false
  );

  // Mute/Unmute
  btnMute.addEventListener(
    "click",
    function (e) {
      if (btnMute.classList.contains("btn--mute")) {
        setBtnMute();
        player.setMuted(1);
      } else {
        setBtnUnmute();
        player.setMuted(0);
      }
    },
    false
  );

  // Create Quality Options
  let createQualityOptions = function (obj, i) {
    let q = document.createElement("a");
    let qText = document.createTextNode(obj.name);
    settingsMenu.appendChild(q);
    q.classList.add("settings-menu-item");
    q.appendChild(qText);

    q.addEventListener("click", (event) => {
      player.setQuality(obj);
      closeSettingsMenu();
      return false;
    });
  };

  // Close Settings menu
  let closeSettingsMenu = function () {
    btnSettings.classList.remove("btn--settings-on");
    btnSettings.classList.add("btn--settings-off");
    settingsMenu.classList.remove("open");
  };

  // Settings
  btnSettings.addEventListener(
    "click",
    function (e) {
      let qualities = player.getQualities();
      let currentQuality = player.getQuality();

      // Empty Settings menu
      while (settingsMenu.firstChild)
        settingsMenu.removeChild(settingsMenu.firstChild);

      if (btnSettings.classList.contains("btn--settings-off")) {
        for (var i = 0; i < qualities.length; i++) {
          createQualityOptions(qualities[i], i);
        }
        btnSettings.classList.remove("btn--settings-off");
        btnSettings.classList.add("btn--settings-on");
        settingsMenu.classList.add("open");
      } else {
        closeSettingsMenu();
      }
    },
    false
  );

  // Close Settings menu if user clicks outside the player
  window.addEventListener("click", function (e) {
    if (playerOverlay.contains(e.target)) {
    } else {
      closeSettingsMenu();
    }
  });
})(window.IVSPlayer);