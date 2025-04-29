import { YouTubeVideoKeystatic } from "@/components/molecules/YouTubeVideo";
import { ContentComponent } from "@keystatic/core/content-components";
import { Schema } from "@markdoc/markdoc";

const componentList = [
  YouTubeVideoKeystatic,
  // Add more components here as needed
];

export const keystaticComponents = componentList.reduce((acc, val) => {
  acc[val.name] = val.component;
  return acc;
}, {} as Record<string, ContentComponent>);

export const keystaticTags = componentList.reduce((acc, val) => {
  acc[val.name] = val.tag;
  return acc;
}, {} as Record<string, Schema>);
