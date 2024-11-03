import { PostDescriptor } from "./postManager/postMeta";

export interface EjsRenderMeta {
  navHighlight: "home" | "posts";
  contentsPage: string; // name of the page to be rendered in contents section
}

export interface EjsRenderPostPageMeta extends EjsRenderMeta {
  posts: PostDescriptor[];
  postsPath: string;
}
