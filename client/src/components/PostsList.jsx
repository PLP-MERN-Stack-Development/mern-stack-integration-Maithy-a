import React from "react";
import PostCard from "./PostCard";

export default function PostsList({ posts = [], onDelete = () => {} }) {
  if (!posts.length) {
    return <div className="text-gray-600">No posts found.</div>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          onDelete={() => onDelete(post._id)}
        />
      ))}
    </div>
  );
}
