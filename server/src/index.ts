import express from "express";
import { config } from "./config/app.config";
import { makeCall } from "./api/remote/remote";
import {
  clientModulesRoute,
  publicDir,
  viewsDir,
  mediaDir,
  mediaRoute,
  scriptsRoute,
  scriptsDir,
  stylesDir,
  stylesRoute,
  viewsRoute,
  clientModulesDir,
  postsDir
} from "./routes";
import { PostManager } from "./postManager/postManager";
import { EjsRenderMeta, EjsRenderPostPageMeta } from "./types";

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static(publicDir));
app.use(clientModulesRoute, express.static(clientModulesDir));

app.set(viewsRoute, viewsDir);
app.set(stylesRoute, stylesDir);
app.set(scriptsRoute, scriptsDir);
app.set(mediaRoute, mediaDir);

app.get("/", (_, res) => {
  res.redirect("/home");
});

const postManager = new PostManager();
postManager.init();

app.get("/posts", async (_, res) =>
  res.render("index", {
    navHighlight: "posts",
    contentsPage: "postspage",
    posts: postManager.getAll(),
    postsPath: postsDir
  } satisfies EjsRenderPostPageMeta)
);

app.get("/remote_testing", (_, res) => {
  res.render("testing/remote");
});

app.get("/home", (_, res) => {
  res.render("index", {
    navHighlight: "home",
    contentsPage: "homepage"
  } satisfies EjsRenderMeta);
});

app.post("/api/remote", async (req, res) => {
  const response = await makeCall(req.body);
  res.send(JSON.stringify(response));
});

app.listen(config.port, () => {
  console.log(`Listening on port ${config.port}!`);
});
