// Playback configuration
const playbackUrl = 'https://760b256a3da8.us-east-1.playback.live-video.net/api/video/v1/us-east-1.049054135175.channel.6tM2Z9kY16nH.m3u8';
let timer;
let canvas;
let ctx;
let isSafari = false;
let safari = document.getElementById('safari');

// Safari unsupported message
if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
  isSafari = true;
  safari.style.display = 'flex';
}

if(!isSafari) {
  if (IVSPlayer.isPlayerSupported) {
    const player = IVSPlayer.create();
    const videoEl = document.createElement('video');
    const PlayerState = IVSPlayer.PlayerState;
  
    document.body.appendChild(videoEl);
    player.attachHTMLVideoElement(videoEl);
    player.load(playbackUrl);
    player.play();
    player.setVolume(0);
    
    // Video to canvas
    canvas = document.getElementById('ambiance');
    ctx = canvas.getContext('2d');
  
    player.addEventListener(PlayerState.PLAYING, function () {
      function can(){
        ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
        requestAnimationFrame(can);
      }
      requestAnimationFrame(can);
    });
  }  
}
