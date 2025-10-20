"use client"

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React, { useEffect, useState } from "react";
import ZojaxLogo from "@/assets/main-image.png"
import { getPostBySlug } from "@/app/lib/posts";
import axios from "axios";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Link as LinkIcon,
} from "lucide-react";

type Props = {
  params: {
    slug: string,
    id: number
  };
};
type ContentsType = {
  title: string;
  content: string;
  excerpt: string;
  acf: {
    abstract_: string;
    thumbnail: number;
  };
  author_info: {
    display_name: string;
    author_link: string;
  };
}
export default function PostPage({ params }: Props) {
  const BACKEND_URL = "https://zojaxblogs.wpengine.com"
  const [content, setContent] = useState<ContentsType | null>(null);
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<string>("");
  const testShare = "Test Share"
  useEffect(() => {
    const getAllPosts = async () => {
      const allPosts = (await axios.get(`${BACKEND_URL}/wp-json/wp/v2/posts`)).data;
      const filtered = allPosts.find((item: any) => item.slug === params.slug);
      const thumbnailRes = await axios.get(
        `${BACKEND_URL}/wp-json/wp/v2/media/${filtered.acf.thumbnail}`
      );
      setThumbnailImageUrl(thumbnailRes.data.guid?.rendered);

      const _data = {
        title: filtered.title.rendered,
        content: filtered.content.rendered,
        excerpt: filtered.excerpt.rendered,
        acf: {
          abstract_: filtered.acf.abstract_,
          thumbnail: filtered.acf.thumbnail,
        },
        author_info: {
          display_name: filtered.author_info.display_name,
          author_link: filtered.author_info.author_link,
        },
      }
      setContent(_data);
    };

    getAllPosts();
  }, [params.slug]);

  if (!content)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 text-lg font-medium">Loading blog post...</p>
      </div>
    );

  return (
    <div className="min-h-screen py-4 px-4 sm:px-20">
      <Image src={ZojaxLogo} className="w-28 mb-12" alt="logo" />
      {/* Post Title */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 text-gray-900 leading-snug">
        {content.title}
      </h1>

      {/* Author & Date */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-gray-500 mb-6 text-sm sm:text-base">
        <div>
          By{" "}
          <Link
            href={content.author_info.author_link}
            className="text-blue-600 hover:underline font-medium"
          >
            {content.author_info.display_name}
          </Link>
        </div>
        <div>
          {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Abstract */}
      {content.acf.abstract_ && (
        <p className="text-gray-700 italic mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed">
          {content.acf.abstract_}
        </p>
      )}


      {/* Main Content */}
      <div
        className="prose prose-lg sm:prose-xl max-w-none text-gray-800 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: content.content }}
      />


      {/* Social Share Section */}
      {/* Social Share Section */}
      <div className="mt-10 border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Share this post
        </h3>
        <div className="flex flex-wrap gap-3">
          {/* Facebook */}
          <Link
            href={`https://www.facebook.com/sharer/sharer.php?u=${testShare}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            <Facebook className="w-5 h-5" />
          </Link>

          {/* Twitter */}
          <Link
            href={`https://twitter.com/intent/tweet?url=${testShare}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-sky-500 text-white hover:bg-sky-600 transition"
          >
            <Twitter className="w-5 h-5" />
          </Link>

          {/* LinkedIn */}
          <Link
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${testShare}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-700 text-white hover:bg-blue-800 transition"
          >
            <Linkedin className="w-5 h-5" />
          </Link>

          <Link
            href="https://www.instagram.com/yourusername" // <-- replace with your actual Instagram
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 text-white hover:opacity-90 transition"
          >
            <Instagram className="w-5 h-5" />
          </Link>
        </div>
      </div>


      {/* Back Link */}
      <div className="mt-12">
        <Link href="/" className="text-blue-600 hover:underline font-medium">
          ← Return to Blog Lists
        </Link>
      </div>
    </div>
  );
}


//git
