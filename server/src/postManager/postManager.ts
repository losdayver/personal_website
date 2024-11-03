import { readFile } from "fs/promises";
import { viewsDir } from "../routes";
import { PostDescriptor } from "./postMeta";

const descriptorsPath = viewsDir + "/posts/meta/descriptors.json";

export class PostManager {
  static posts: PostDescriptor[];
  noCache = true;

  constructor() {}

  getAll = () => PostManager.posts;

  init = async () => {
    if (!this.noCache || !PostManager.posts) {
      const rawdata = (await readFile(descriptorsPath)).toString();
      PostManager.posts = JSON.parse(rawdata).posts;
    }
  };
}
