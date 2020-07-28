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

// Playback configuration
// Replace these with your own Amazon IVS Playback URLs
const playbackUrl1 = "https://usher.ttvnw.net/api/lvs/hls/lvs.lvs-client-example.9083f9a2-a707-460a-a282-6191cbcfa9ec.m3u8";
const playbackUrl2 = "https://usher.ttvnw.net/api/lvs/hls/lvs.lvs-client-example.e974f90a-0858-4e0e-b535-53221b18b6bb.m3u8";
const playbackUrl3 = "https://usher.ttvnw.net/api/lvs/hls/lvs.lvs-client-example.183c01b7-0539-440f-9176-aa7bef66f7ea.m3u8";
const playbackUrl4 = "https://usher.ttvnw.net/api/lvs/hls/lvs.lvs-client-example.f66454f4-ce3a-4746-b255-a6c6ba29fc5f.m3u8";

const playbackUrls = [
  playbackUrl1,
  playbackUrl2,
  playbackUrl3,
  playbackUrl4
];

// App
const players = document.getElementById('players');

(function (IVSPlayer) {

  // handlePlayerReady
  let handlePlayerReady = function(src, elPlayer) {
    elPlayer.setRebufferToLive(true);
    elPlayer.setAutoplay(true);
    elPlayer.load(src);
    elPlayer.setVolume(0);
  }

  // createPlayers
  let createPlayers = function(src, id){
    const PlayerState = IVSPlayer.PlayerState;
    const PlayerEventType = IVSPlayer.PlayerEventType;

    let video = document.createElement('video');
    video.autoplay = true;
    video.playsinline = true;
    video.className = 'player';
    video.id = 'player-' + id;
    players.appendChild(video);

    // Initialize player
    const elPlayer = IVSPlayer.create();
    elPlayer.attachHTMLVideoElement(video);

    // Attach event listeners
    elPlayer.addEventListener(PlayerState.PLAYING, function () {
      console.log("Player State - PLAYING");
    });
    elPlayer.addEventListener(PlayerState.ENDED, function () {
      console.log("Player State - ENDED");
    });
    elPlayer.addEventListener(PlayerState.READY, function () {
      console.log("Player State - READY");
    });
    elPlayer.addEventListener(PlayerEventType.ERROR, function (err) {
      console.warn("Player Event - ERROR:", err);
    });
    elPlayer.addEventListener(PlayerEventType.TEXT_METADATA_CUE, function (cue) {
      const metadataText = cue.text;
      const position = elPlayer.getPosition().toFixed(2);
      console.log(
        `Player Event - TEXT_METADATA_CUE: "${metadataText}". Observed ${position}s after playback started.`
      );
    });
    
    // Player config
    handlePlayerReady(src, elPlayer);
  }

  // Create 4 players based on the playbackUrls array
  for (var i = 0; i < 4; i++) {
    createPlayers(playbackUrls[i], i);
  }

})(window.IVSPlayer);