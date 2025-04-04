import { Hono } from "hono";
import { v1Llms } from "./v1/llms";
import { v1Auth } from "./v1/auth";

const v1 = new Hono();

v1.route("/llms", v1Llms);
v1.route("/auth", v1Auth);

export const v1ApiRoutes = v1;
