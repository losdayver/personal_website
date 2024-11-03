import * as path from "path";

const projectRoot = path.resolve(__dirname + "/../..");

const res = (relPath: string) => projectRoot + relPath;

export const publicRoute = "/public";
export const publicDir = res("/public");

export const clientModulesRoute = "/modules";
export const clientModulesDir = res("/client/node_modules");

export const viewsRoute = "views";
export const viewsDir = res("/public/views");

export const stylesRoute = "styles";
export const stylesDir = res("/public/styles");

export const scriptsRoute = "scripts";
export const scriptsDir = res("/public/scripts");

export const mediaRoute = "media";
export const mediaDir = res("/public/media");

export const postsRoute = "posts";
export const postsDir = res("/public/views/posts");
