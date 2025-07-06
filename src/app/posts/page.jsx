"use client";

import { useState, useEffect } from "react";
import { Instagram } from "lucide-react";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInstagramPosts();
  }, []);

  const fetchInstagramPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/instagram');
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      const data = await response.json();
      setPosts(data.posts);
      setLoading(false);
    } catch (err) {
      setError("게시물을 불러오는데 실패했습니다.");
      setLoading(false);
    }
  };

  const handlePostClick = (permalink) => {
    window.open(permalink, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-700"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 overflow-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Instagram className="w-8 h-8 text-orange-700 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Posts</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Hollywood Store의 최신 소식을 확인해보세요
          </p>
        </div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => handlePostClick(post.permalink)}
            >
              <img
                src={post.media_url}
                alt="Instagram post"
                className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-end">
                <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-sm overflow-hidden" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {post.caption}
                  </p>
                  <div className="flex items-center mt-2">
                    <Instagram className="w-4 h-4 mr-2" />
                    <span className="text-xs">Instagram에서 보기</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Instagram Follow Button */}
        <div className="text-center mt-12">
          <a
            href="https://www.instagram.com/hollywoodstore0_0/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Instagram className="w-5 h-5 mr-2" />
            Instagram 팔로우하기
          </a>
        </div>
      </div>
    </div>
  );
} 