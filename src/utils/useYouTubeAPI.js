import { useState, useEffect } from "react";

export default function useYouTubeAPI(iframeRef, { onPlay, onPause, onEnd } = {}) {
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    // Load YouTube API if not loaded
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);

      window.onYouTubeIframeAPIReady = createPlayer;
    } else {
      createPlayer();
    }

    function createPlayer() {
      if (!iframeRef.current) return;

      const ytPlayer = new window.YT.Player(iframeRef.current, {
        events: {
          onReady: () => setPlayer(ytPlayer),
          onStateChange: (event) => {
            const YTState = window.YT.PlayerState;
            if (event.data === YTState.PLAYING) onPlay?.();
            if (event.data === YTState.PAUSED) onPause?.();
            if (event.data === YTState.ENDED) onEnd?.();
          },
        },
      });
    }
  }, [iframeRef]);

  const getDuration = () => (player?.getDuration ? player.getDuration() : 0);
  const getCurrentTime = () => (player?.getCurrentTime ? player.getCurrentTime() : 0);
  const playVideo = () => player?.playVideo();
  const pauseVideo = () => player?.pauseVideo();
  const stopVideo = () => player?.stopVideo();

  return { player, getDuration, getCurrentTime, playVideo, pauseVideo, stopVideo };
}