import { ApiReferenceConfiguration } from "@scalar/hono-api-reference";
import {
  describeRoute,
  DescribeRouteOptions,
  OpenApiSpecsOptions,
} from "hono-openapi";
import { resolver } from "hono-openapi/zod";
import { z } from "zod";

const badRequestSchema = z.object({
  errors: z.array(
    z.object({
      message: z.string(),
      code: z.string(),
    })
  ),
});

interface SpecsOptions {
  title: string;
  version: string;
  description: string;
}
export const docSpecs = (opts: SpecsOptions): OpenApiSpecsOptions => {
  return {
    documentation: {
      info: {
        title: opts.title,
        version: opts.version,
        description: opts.description,
      },
      components: {
        securitySchemes: {
          "Basic Auth": {
            type: "http",
            scheme: "basic",
          },
          "Bearer Auth": {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [
        {
          "Basic Auth": [],
        },
        {
          "Bearer Auth": [],
        },
      ],
    },
  };
};

interface ApiReferenceOptions {
  pageTitle?: string;
  url: string;
}

export const apiRefOptions = (
  opts: ApiReferenceOptions
): Partial<ApiReferenceConfiguration> => {
  return {
    pageTitle: opts.pageTitle ?? "API Reference",
    url: opts.url,
    hideClientButton: true,
    hideDownloadButton: true,
    theme: "elysiajs",
  };
};

interface JsonResponseDocs {
  tags: string[];
  description: string;
  successSchema: Parameters<typeof resolver>[0];
}

export const jsonResponseDocs = (
  props: JsonResponseDocs
): DescribeRouteOptions => {
  return {
    tags: props.tags,
    description: props.description,
    responses: {
      200: {
        description: "Success Response",
        content: {
          "application/json": {
            schema: resolver(props.successSchema),
          },
        },
      },
      400: {
        description: "Bad Request",
        content: {
          "application/json": {
            schema: resolver(badRequestSchema),
          },
        },
      },
    },
    validateResponse: true,
  };
};

export const describeRouteJson = (props: JsonResponseDocs) => {
  return describeRoute(jsonResponseDocs(props));
};
