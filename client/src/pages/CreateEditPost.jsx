import { useEffect, useState } from "react";
import { postService, categoryService } from "../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreateEditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    tags: "",
    isPublished: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadPost = async (postId) => {
    try {
      const res = await postService.getPost(postId);
      setForm({
        title: res.title || "",
        content: res.content || "",
        excerpt: res.excerpt || "",
        category: res.category?._id || "",
        tags: (res.tags || []).join(", "),
        isPublished: !!res.isPublished,
      });
    } catch (err) {
      console.error("Load post failed", err);
    }
  };

  useEffect(() => {
    if (id) loadPost(id);

    // Load categories
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getAllCategories();
        setCategories(res); // res is an array of category objects
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImage = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("content", form.content);
      fd.append("excerpt", form.excerpt);
      fd.append("category", form.category);
      fd.append("tags", form.tags);
      fd.append("isPublished", form.isPublished ? "true" : "false");
      if (imageFile) fd.append("featuredImage", imageFile);

      if (id) await postService.updatePost(id, fd);
      else await postService.createPost(fd);

      navigate("/dashboard");
    } catch (err) {
      console.error("Save failed", err);
      alert("Save failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-4">
          {id ? "Edit Post" : "Create Post"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="block text-sm font-medium mb-1">Title</Label>
            <Input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <Label className="block text-sm font-medium mb-1">Excerpt</Label>
            <Input
              name="excerpt"
              value={form.excerpt}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <Label className="block text-sm font-medium mb-1">Content</Label>
            <Textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows="6"
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="block text-sm font-medium mb-1">Category</Label>
              <Select
                value={form.category}
                onValueChange={(val) =>
                  setForm((f) => ({ ...f, category: val }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="block text-sm font-medium mb-1">
                Tags (comma separated)
              </Label>
              <Input
                name="tags"
                value={form.tags}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Featured Image
            </label>
            <input type="file" accept="image/*" onChange={handleImage} />
          </div>

          <div className="flex items-center gap-4">
            <Button type="submit" className="px-4 py-2 " disabled={loading}>
              {loading ? (
                <div className="flex items-center">
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </div>
              ) : (
                "Save Post"
              )}
            </Button>
            <Button
              variant="secondary"
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              id="isPublished"
              name="isPublished"
              checked={form.isPublished}
              onCheckedChange={(checked) =>
                setForm((f) => ({ ...f, isPublished: checked }))
              }
            />
            <Label htmlFor="isPublished">Published</Label>
          </div>
        </form>
      </div>
    </div>
  );
}
