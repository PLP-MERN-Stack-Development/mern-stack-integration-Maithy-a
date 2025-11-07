import React, { useEffect, useState, useContext } from "react";
import { postService } from "../services/api";
import PostsList from "../components/PostsList";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0 });
  const [loading, setLoading] = useState(true);
  const { user, logout } = useContext(AuthContext);

  const fetchPosts = async (page = 1) => {
    setLoading(true);
    try {
      const data = await postService.getAllPosts(page, meta.limit);
      setPosts(data.data ?? []);
      setMeta(data.meta ?? { page: 1, limit: 10, total: 0 });
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


  const handlePage = (newPage) => {
    fetchPosts(newPage);
  };

  const handleDeleteOptimistic = async (postId) => {
    const previous = posts;
    setPosts((post) => post.filter((x) => x._id !== postId));
    try {
      await postService.deletePost(postId);
    } catch (err) {
      setPosts(previous);
      console.error("Delete failed, rolled back", err);
      alert("Failed to delete post");
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

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">Logout</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure you want to logout?</DialogTitle>
                <DialogDescription>
                  Confirm to logout from your account.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      logout();
                    }}
                  >
                    Confirm Logout
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main>
        {loading ? (
          <div>Loading posts...</div>
        ) : (
          <>
            <PostsList posts={posts} onDelete={handleDeleteOptimistic} />

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
              <div>
                Page {meta.page} of {Math.ceil(meta.total / meta.limit) || 1}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  disabled={meta.page <= 1}
                  onClick={() => handlePage(meta.page - 1)}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Prev
                </Button>
                <Button
                  variant="secondary"
                  disabled={meta.page >= Math.ceil(meta.total / meta.limit)}
                  onClick={() => handlePage(meta.page + 1)}
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
