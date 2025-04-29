import { blogsCollection } from "@/keystatic/collections";
import { config } from "@keystatic/core";

const isProduction = process.env.NODE_ENV === "production";

export default config({
  storage: {
    kind: isProduction ? "github" : "local",
    repo: "glncy/clawdy-server",
    branchPrefix: "keystatic-cms/",
  },
  collections: {
    blogs: blogsCollection,
  },
});
