import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";

const app = new Hono();

let testPosts = [
  { id: "1", title: "Post 1", content: "This is post 1" },
  { id: "2", title: "Post 2", content: "This is post 2" },
  { id: "3", title: "Post 3", content: "This is post 3" },
];
app.use("*", prettyJSON());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/get", (c) => c.json({ posts: testPosts }));

app.get("/posts/:id", (c) => {
  const id = c.req.param("id");
  const post = testPosts.find((p) => p.id === id);

  if (post) {
    return c.json(post);
  } else {
    return c.json({ message: "not found" }, 404);
  }
});

app.post("/posts", async (c) => {
  const { title, content } = await c.req.json<{
    title: string;
    content: string;
  }>();
  const newPost = { id: String(testPosts.length + 1), title, content };

  testPosts = [...testPosts, newPost];
  return c.json(newPost, 201);
});

app.put("/posts/:id", async (c) => {
  const id = c.req.param("id");
  const index = testPosts.findIndex((p) => p.id === id);

  if (index === -1) {
    return c.json({ message: "not found" }, 404);
  }

  const { title, content } = await c.req.json();
  testPosts[index] = { ...testPosts[index], title, content };

  return c.json(testPosts[index]);
});

app.delete("/posts/:id", async (c) => {
  const id = c.req.param("id");
  const index = testPosts.findIndex((p) => p.id === id);

  if (index === -1) {
    return c.json({ message: "not found" }, 404);
  }

  testPosts = testPosts.filter((p) => p.id !== id);

  return c.json({ message: "投稿を削除しました" });
});

export default app;
