import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CustomDialog } from "./CustomDialog";

export default function PostCard({ post, onDelete = () => { } }) {
  const navigate = useNavigate();
  const excerpt = post.excerpt || (post.content ? post.content.slice(0, 120) + "..." : "");

  return (
    <article className="relative border rounded-3xl space-y-4 p-4 bg-white dark:bg-gray-800 border-gray-200">
      {post.featuredImage && (
        <div className="mb-3 h-45 overflow-hidden rounded-xl">
          <img
            src={`${import.meta.env.VITE_SERVER_URL}/${post.featuredImage.replace(/\\/g, "/")}`}
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
          <Button
            variant="ghost"
            className="text-sm text-blue-600 underline"
            onClick={() => navigate(`/posts/${post._id}`)}>
            View
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate(`/posts/${post._id}/edit`)}
          >
            Edit
          </Button>

          <CustomDialog
            title="Confirm Post deletion"
            confirmText="Confirm Delete"
            description="Are you sure you want to delete this post?"
            alertMessage="This action cannot be undone."
            triggerText="Delete"
            variant="destructive"
            onConfirmFn={() => {
              onDelete();
            }}
          />

        </div>
      </div>
    </article>
  );
}
