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
// Replace this with your own Amazon IVS Playback URL
let playbackUrl = 'https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8';

if (IVSPlayer.isPlayerSupported) {
  let player;
  const IVSPlayerPackage = window.IVSPlayer;
  const PlayerState = IVSPlayerPackage.PlayerState;
  const PlayerEventType = IVSPlayerPackage.PlayerEventType;

  player = IVSPlayerPackage.create({
    serviceWorker: {
      url: 'amazon-ivs-service-worker-loader.js'
    }
  });

  player.attachHTMLVideoElement(document.getElementById('video-player'));
  player.setAutoplay(true);
  player.setMuted(1);
  player.load(playbackUrl);
  player.setRebufferToLive(true);
  player.play();

  player.addEventListener(PlayerEventType.AUDIO_BLOCKED, function(){
    player.setMuted(1);
  });

  const playbackUrlInput = document.getElementById('playback_url');
  const loadBtn = document.getElementById('load_btn');

  loadBtn.addEventListener('click', () => {
    playbackUrl = playbackUrlInput.value;
    player.load(playbackUrl);
    player.play();
  });

}
