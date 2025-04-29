import { createReader } from "../../lib/reader";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { BookDashed } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BlogPost {
  slug: string;
  entry: {
    title: string;
    description: string;
    author: string;
    publishDate: string | null;
    featuredImage: string | null;
    tags: readonly string[];
    content: () => Promise<{ node: any }>;
  } | null;
}

export default async function BlogsPage() {
  const reader = await createReader();
  const posts = await reader.collections.blogs.list();
  const blogPosts: BlogPost[] = await Promise.all(
    posts.map(async (slug: string) => ({
      slug,
      entry: await reader.collections.blogs.read(slug),
    }))
  );

  // Filter out null entries and sort by publish date
  const validBlogPosts = blogPosts
    .filter(
      (blog): blog is BlogPost & { entry: NonNullable<BlogPost["entry"]> } =>
        blog.entry !== null
    )
    .sort((a, b) => {
      const dateA = a.entry.publishDate
        ? new Date(a.entry.publishDate).getTime()
        : 0;
      const dateB = b.entry.publishDate
        ? new Date(b.entry.publishDate).getTime()
        : 0;
      return dateB - dateA;
    });

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          Clawdy Insights
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover the latest tips, tricks, and success stories from the Clawdy
          community. From product updates to customer success stories, explore
          how Clawdy is transforming digital experiences.
        </p>
      </div>

      {validBlogPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <BookDashed size={180} className="mb-10 text-muted-foreground" />
          <p className="text-2xl text-center text-muted-foreground">No blog posts have been published yet. Please check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {validBlogPosts.map((post) => (
            <Card key={post.slug} className="flex flex-col h-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div />
                </div>
                <CardTitle>{post.entry.title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                  By {post.entry.author}
                  {post.entry.publishDate && (
                    <>
                      <span className="mx-1">·</span>
                      <span className="flex items-center">
                        <CalendarIcon className="mr-1 h-3 w-3" />
                        {new Date(post.entry.publishDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                {post.entry.featuredImage && (
                  <div className="mb-4 rounded-xl overflow-hidden shadow-lg">
                    <div className="relative aspect-[2/1]">
                      <Image
                        src={post.entry.featuredImage}
                        alt={post.entry.title}
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>
                )}
                {post.entry.tags && post.entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.entry.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="mb-0">{post.entry.description}</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/blogs/${post.slug}`}>Read More</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
