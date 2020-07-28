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
const playbackUrl = "https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.xhP3ExfcX8ON.m3u8";

// App
const videoPlayer = document.getElementById("video-player");
const quizEl = document.getElementById("quiz");
const waitMessage = document.getElementById("waiting");
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const cardInnerEl = document.getElementById("card-inner");

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
    triggerQuiz(metadataText);
  });

  // Setup stream and play
  player.setAutoplay(true);
  player.load(playbackUrl);

  // Setvolume
  player.setVolume(0.1);

  // Remove card
  function removeCard() {
    quizEl.classList.toggle("drop");
  }

  // Trigger quiz
  function triggerQuiz(metadataText) {
    let obj = JSON.parse(metadataText);

    quizEl.style.display = "";
    quizEl.classList.remove("drop");
    waitMessage.style.display = "none";
    cardInnerEl.style.display = "none";
    cardInnerEl.style.pointerEvents = "auto";

    while (answersEl.firstChild) answersEl.removeChild(answersEl.firstChild);
    questionEl.textContent = obj.question;

    let createAnswers = function (obj, i) {
      let q = document.createElement("a");
      let qText = document.createTextNode(obj.answers[i]);
      answersEl.appendChild(q);
      q.classList.add("answer");
      q.appendChild(qText);

      q.addEventListener("click", (event) => {
        cardInnerEl.style.pointerEvents = "none";
        if (q.textContent === obj.answers[obj.correctIndex]) {
          q.classList.toggle("correct");
        } else {
          q.classList.toggle("wrong");
        }
        setTimeout(function () {
          removeCard();
          waitMessage.style.display = "";
        }, 1050);
        return false;
      });
    };

    for (var i = 0; i < obj.answers.length; i++) {
      createAnswers(obj, i);
    }
    cardInnerEl.style.display = "";
  }

  waitMessage.style.display = "";
})(window.IVSPlayer);