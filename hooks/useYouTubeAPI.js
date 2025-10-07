import { useEffect } from "react";

export default function useYouTubeAPI(iframeRef, { onPlay, onPause, onEnd }) {
  useEffect(() => {
    if (!iframeRef.current) return;

    // Load YouTube IFrame API if not already loaded
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // Wait for API to be ready
    const onYouTubeIframeAPIReady = () => {
      if (!iframeRef.current) return;

      // Create a YouTube player instance
      const player = new window.YT.Player(iframeRef.current, {
        events: {
          onStateChange: (event) => {
            switch (event.data) {
              case window.YT.PlayerState.PLAYING:
                onPlay && onPlay();
                break;
              case window.YT.PlayerState.PAUSED:
                onPause && onPause();
                break;
              case window.YT.PlayerState.ENDED:
                onEnd && onEnd();
                break;
              default:
                break;
            }
          },
        },
      });

      // Cleanup function
      return () => {
        player.destroy();
      };
    };

    // If YT is ready, initialize immediately
    if (window.YT && window.YT.Player) {
      onYouTubeIframeAPIReady();
    } else {
      // Otherwise attach to global callback
      window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    }
  }, [iframeRef, onPlay, onPause, onEnd]);
}