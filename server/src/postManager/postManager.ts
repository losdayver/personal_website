import { readFile } from "fs/promises";
import { viewsDir } from "../routes";
import { PostDescriptor } from "./postMeta";

const descriptorsPath = viewsDir + "/posts/meta/descriptors.json";

export class PostManager {
  static posts: PostDescriptor[];

  constructor() {}

  getAll = () => PostManager.posts;

  init = async () => {
    if (PostManager.posts) return;
    const rawdata = (await readFile(descriptorsPath)).toString();
    PostManager.posts = JSON.parse(rawdata).posts;
  };
}
