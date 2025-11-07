import React, { useEffect, useState, useContext } from "react";
import { postService } from "../services/api";
import PostsList from "../components/PostsList";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";

import { CustomDialog } from "@/components/CustomDialog";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0 });
  const [loading, setLoading] = useState(true);
  const { user, logout } = useContext(AuthContext);

  const fetchPosts = async (page = 1) => {
    setLoading(true);
    try {
      const response = await postService.getAllPosts(page, meta.limit);
      // console.log("Fetched posts response:", response);
      setPosts(response.data || []);
      setMeta(response.meta || { page: 1, limit: 10, total: 0 });
    } catch (err) {
      console.error("Failed to fetch posts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(meta.page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.page]);

  const handlePageChange = (newPage) => {
    fetchPosts(newPage);
  };

  const handleDeleteOptimistic = async (postId) => {
    const previousPosts = posts;
    setPosts((prev) => prev.filter((p) => p._id !== postId));

    try {
      await postService.deletePost(postId);
    } catch (err) {
      console.error("Delete failed, rolling back", err);
      setPosts(previousPosts);
      toast.error("Failed to delete post");
    }
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto p-6">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {user ? `Welcome, ${user.name || user.email}` : "Welcome"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild>
            <Link to="/posts/new">New Post</Link>
          </Button>

          <CustomDialog
            title="Confirm Logout"
            confirmText="Confirm Logout"
            description="Are you sure you want to logout?"
            alertMessage="You will need to login again to access your dashboard."
            triggerText="Logout"
            variant="destructive"
            onConfirmFn={() => { logout(); }}
          />
        </div>
      </header>

      <main>
        {loading ? (
          <div className="flex items-center justify-center gap-3 text-gray-600 py-10">
            <Loader className="w-5 h-5 animate-spin text-gray-500" />
            <span className="text-base font-medium">Loading posts...</span>
          </div>

        ) : posts.length === 0 ? (
          <div className="text-gray-500 text-center py-10">No posts found.</div>
        ) : (
          <>
            <PostsList posts={posts} onDelete={handleDeleteOptimistic} />
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Page {meta.page} of {Math.ceil(meta.total / meta.limit) || 1}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  disabled={meta.page <= 1}
                  onClick={() => handlePageChange(meta.page - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </Button>
                <Button
                  variant="secondary"
                  disabled={meta.page >= Math.ceil(meta.total / meta.limit)}
                  onClick={() => handlePageChange(meta.page + 1)}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
