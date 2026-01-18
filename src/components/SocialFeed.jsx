import React, { useEffect, useState } from "react";
import PostItem from "./PostItem";
import { createPost, fetchPosts } from "../api/api";

// ------------------------------
// URL Validation
// ------------------------------
const isValidUrl = (url) => {
  return (
    url.includes("youtube.com") ||
    url.includes("youtu.be") ||
    url.includes("tiktok.com") ||
    url.includes("instagram.com") ||
    url.includes("facebook.com")
  );
};

const SocialFeed = () => {
  const [inputUrl, setInputUrl] = useState("");
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ------------------------------
  // FETCH POSTS ON PAGE LOAD
  // ------------------------------
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const res = await fetchPosts();
      setPosts(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load posts");
    }
  };

  // ------------------------------
  // ADD POST
  // ------------------------------
  const handleAddPost = async () => {
    setError("");

    if (!inputUrl) {
      setError("Please paste a URL");
      return;
    }

    if (!isValidUrl(inputUrl)) {
      setError("Unsupported social media link");
      return;
    }

    try {
      setLoading(true);

      const res = await createPost({ url: inputUrl });

      // Add new post to the top
      setPosts((prev) => [res.data, ...prev]);
      setInputUrl("");
    } catch (err) {
      console.error(err);
      setError("Failed to add post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 420 }}>
      <h3>Social Feed</h3>

      <input
        type="text"
        placeholder="Paste social media URL"
        value={inputUrl}
        onChange={(e) => setInputUrl(e.target.value)}
        style={{ width: "100%", padding: 8 }}
      />

      <button
        onClick={handleAddPost}
        disabled={loading}
        style={{
          width: "100%",
          marginTop: 10,
          padding: 10,
          cursor: "pointer",
        }}
      >
        {loading ? "Adding..." : "Add Post"}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: 8 }}>{error}</p>
      )}

      <hr />

      {/* POSTS */}
      {posts.map((post) => (
        <PostItem key={post._id} post={post} />
      ))}
    </div>
  );
};

export default SocialFeed;