import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { postService } from "../services/api";

export default function PostView() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await postService.getPost(id);
        setPost(res);
      } catch (err) {
        console.error(err);
        alert("Failed to load post");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link to="/dashboard" className="text-blue-600 underline">
        ← Back
      </Link>
      <h1 className="text-2xl font-bold mt-4">{post.title}</h1>
      <div className="text-sm text-gray-500 mb-4">
        By {post.author?.name || post.author?.email} •{" "}
        {new Date(post.createdAt).toLocaleString()}
      </div>
      {post.featuredImage && (
        <div className="mb-4">
          <img
            src={`/${post.featuredImage}`}
            alt={post.title}
            className="w-full rounded"
          />
        </div>
      )}
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
}
