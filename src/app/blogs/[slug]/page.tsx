// src/app/blogs/[slug]/page.tsx
import { createReader } from "@keystatic/core/reader";
import React from "react";
import Markdoc from "@markdoc/markdoc";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import keystaticConfig from "../../../../keystatic.config";
import { keystaticTags } from "@/keystatic/components";
import YouTubeVideo from "@/components/molecules/YouTubeVideo";

const reader = createReader(process.cwd(), keystaticConfig);

// Define the correct types for params
export interface BlogParams {
  params: {
    slug: string;
  };
}

export default async function Page({ params }: BlogParams) {
  const post = await reader.collections.blogs.read(params.slug);
  
  if (!post) {
    notFound();
  }
  
  const { node } = await post.content();
  const errors = Markdoc.validate(node, {
    tags: keystaticTags,
  });
  
  if (errors.length) {
    console.error(errors);
    throw new Error("Invalid content");
  }
  
  const renderable = Markdoc.transform(node, {
    tags: keystaticTags,
  });
  
  return (
    <div className="container mx-auto px-4 py-8 md:py-10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4">
          <Button variant="ghost" asChild size="sm" className="mb-6 pl-0">
            <Link href="/blogs" className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Blogs
            </Link>
          </Button>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
            {post.publishDate && (
              <div className="flex items-center">
                <CalendarIcon className="w-4 h-4 mr-2" />
                <time dateTime={post.publishDate}>
                  {new Date(post.publishDate).toLocaleDateString('en-US', { 
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
            )}
            {post.publishDate && post.author && (
              <span className="mx-2 text-lg font-bold text-muted-foreground">·</span>
            )}
            {post.author && (
              <div className="flex items-center">
                <span>{post.author}</span>
              </div>
            )}
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string, idx: number) => (
                <Badge key={idx} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        {/* Description */}
        {post.description && (
          <p className="mb-4 text-lg text-muted-foreground">{post.description}</p>
        )}
        {/* Featured Image */}
        {post.featuredImage && (
          <div className="mb-4 rounded-xl overflow-hidden shadow-lg">
            <div className="relative aspect-[2/1]">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}
        {/* Content */}
        <article className="prose prose-neutral dark:prose-invert max-w-none prose-headings:bg-gradient-to-r prose-headings:from-purple-600 prose-headings:to-blue-500 prose-headings:bg-clip-text prose-headings:text-transparent prose-a:text-purple-600 dark:prose-a:text-purple-400 prose-img:rounded-xl prose-img:shadow-md">
          {Markdoc.renderers.react(renderable, React, { components: { YouTubeVideo } })}
        </article>
      </div>
    </div>
  );
}
