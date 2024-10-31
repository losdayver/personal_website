import express from "express";
import * as path from "path";
import { readFile } from "fs/promises";
import { config } from "./config/app.config";
import { IPostDescriptor } from "./types";
import { makeCall } from "./api/remote/remote";

let app = express();

app.use(express.json());
app.use(express.static("../public"));

app.use("/public", express.static(__dirname + "/public"));
app.use("/modules", express.static(__dirname + "/../../client/node_modules"));

app.set("view engine", "ejs");
app.set("views", "../public/views");
app.set("styles", "../public/styles");
app.set("scripts", "../public/scripts");
app.set("media", "../public/media");

app.get("/", (_, res) => {
  res.redirect("/home");
});
app.get("/posts", async (req, res) => {
  const posts_descriptors_path = "../public/views/posts/meta/descriptors.json";
  const posts_path = "posts/";
  const rawdata = (await readFile(posts_descriptors_path)).toString();
  let posts: IPostDescriptor[] = JSON.parse(rawdata).posts;
  let posts_sorted = [];

  if (req.query.substring || req.query.tags) {
    for (const post of posts) {
      let substring_check = true;
      let tags_check = false;
      if (
        req.query.substring &&
        !post.title
          .toLowerCase()
          .includes((req.query.substring as string).toLowerCase()) // todo add REAL search
      ) {
        substring_check = false;
      }
      if (req.query.tags) {
        const tags = (req.query.tags as string).split(" ");
        for (let tag of tags) {
          if (post.tags.includes(tag)) {
            tags_check = true;
            break;
          }
        }
      } else {
        tags_check = true;
      }
      if (substring_check && tags_check) {
        posts_sorted.push(post);
      }
    }
  } else {
    posts_sorted = posts;
  }
  res.render("index", {
    nav_highlight: "Posts",
    container_contents: "postspage",
    posts: posts_sorted,
    posts_path: posts_path
  });
});

app.get("/remote_testing", (_, res) => {
  res.render("testing/remote");
});

app.get("/home", (_, res) => {
  res.render("index", {
    nav_highlight: "Home",
    container_contents: "homepage"
  });
});

app.post("/api/remote", async (req, res) => {
  const response = await makeCall(req.body);
  res.send(JSON.stringify(response));
});

app.listen(config.port, () => {
  console.log(`Listening on port ${config.port}!`);
});
