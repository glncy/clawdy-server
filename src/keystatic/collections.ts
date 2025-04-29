import { collection, fields } from "@keystatic/core";
import { keystaticComponents } from "./components";

const contentDoc = fields.markdoc({
  label: "Content",
  components: keystaticComponents,
});

export const blogsCollection = collection({
  label: "Blogs",
  slugField: "title",
  path: "src/keystatic/contents/docs/blogs/*",
  entryLayout: "content",
  format: { contentField: "content" },
  schema: {
    title: fields.slug({ name: { label: "Title" } }),
    description: fields.text({
      label: "Description",
      description: "A brief description of the blog post",
      multiline: true,
    }),
    author: fields.text({
      label: "Author",
      description: "The author of the blog post",
    }),
    publishDate: fields.date({
      label: "Publish Date",
      description: "When the blog post was published",
    }),
    featuredImage: fields.image({
      label: "Featured Image",
      description: "The main image for the blog post",
      directory: "public/images/blogs",
      publicPath: "/images/blogs/",
    }),
    tags: fields.array(
      fields.text({
        label: "Tag",
        description: "A tag for categorizing the blog post",
      }),
      {
        label: "Tags",
        description: "Tags for categorizing the blog post",
        itemLabel: (props) => props.value,
      }
    ),
    content: contentDoc,
  },
});
