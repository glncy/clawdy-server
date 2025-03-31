import { Hono } from "hono";
import { v1Llms } from "./v1/llms";

const v1 = new Hono();

v1.route("/llms", v1Llms);

export const v1ApiRoutes = v1;
