import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function PostCard({ post, onDelete = () => { } }) {
  const navigate = useNavigate();
  const excerpt =
    post.excerpt || (post.content ? post.content.slice(0, 120) + "..." : "");

  return (
    <article className="border rounded-md p-4 bg-white dark:bg-gray-800 shadow">
      {post.featuredImage && (
        <div className="mb-3 h-40 overflow-hidden rounded">
          <img
            src={`/${post.featuredImage}`}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <h3 className="text-lg font-semibold mb-1">{post.title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">{excerpt}</p>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-xs text-gray-500">
          {post.author?.name || post.author?.email || "Unknown"} •{" "}
          {new Date(post.createdAt).toLocaleDateString()}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" className="text-sm text-blue-600 underline">
            <Link to={`/posts/${post._id}`}>View</Link>
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/posts/${post._id}/edit`)}
            className="text-sm px-2 py-1 border rounded"
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (confirm("Delete this post?")) onDelete();
            }}
          >
            Delete
          </Button>
        </div>
      </div>
    </article>
  );
}
