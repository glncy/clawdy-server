import { ApiReferenceConfiguration } from "@scalar/hono-api-reference";
import {
  describeRoute,
  DescribeRouteOptions,
  OpenApiSpecsOptions,
} from "hono-openapi";
import { resolver } from "hono-openapi/zod";
import {
  badRequestSchema,
  forbiddenSchema,
  internalServerErrorSchema,
  unauthorizedSchema,
} from "./templateResponses";
import { getZodDefaults } from "@/utils/zodUtils";
import { AnyZodObject } from "zod";

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

const errorTemplates = [
  {
    code: 400,
    schema: badRequestSchema,
  },
  {
    code: 401,
    schema: unauthorizedSchema,
  },
  {
    code: 403,
    schema: forbiddenSchema,
  },
  {
    code: 500,
    schema: internalServerErrorSchema,
  }
];

const createErrorResponse = (schema: AnyZodObject) => ({
  description: getZodDefaults(schema).message,
  content: {
    "application/json": {
      schema: resolver(schema),
    },
  },
});

export const errorResponseDocs = Object.fromEntries(
  errorTemplates.map(({ code, schema }) => [
    code,
    createErrorResponse(schema),
  ])
);

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
      // Map error templates to response objects
      ...errorResponseDocs,
    },
    validateResponse: true,
  };
};

export const describeRouteJson = (props: JsonResponseDocs) => {
  return describeRoute(jsonResponseDocs(props));
};
