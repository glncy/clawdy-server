import { fields } from "@keystatic/core";
import { block } from "@keystatic/core/content-components";

interface YouTubeVideoProps {
  link: string;
}

export const YouTubeVideoKeystatic = {
  name: "YouTubeVideo",
  component: block({
    label: "YouTube",
    schema: {
      link: fields.text({
        label: "Link",
        description: "YouTube link",
      }),
    },
  }),
  tag: {
    render: "YouTubeVideo",
    attributes: {
      link: { type: String },
    },
  },
};

const YouTubeVideo = (props: YouTubeVideoProps) => {
  return <div></div>;
};

export default YouTubeVideo;
