import React, { useState } from "react";
import SocialEmbed from "./SocialEmbed";

const SocialEmbedTester = () => {
  const [url, setUrl] = useState("");

  return (
    <div style={{ padding: 20, maxWidth: 400 }}>
      <h3>Paste a Social Media URL</h3>

      <input
        type="text"
        placeholder="Paste YouTube / TikTok / Instagram / Facebook URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{
          width: "100%",
          padding: 8,
          marginBottom: 10,
        }}
      />

      <SocialEmbed url={url} />
    </div>
  );
};

export default SocialEmbedTester;