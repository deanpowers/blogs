"use client"
import Image from "next/image";
import type { Post } from "../lib/posts";
import { useEffect, useState } from "react";
import axios from "axios"
export default function PostCard({ post }: { post: Post }) {
    const [postUrl, setPostUrl] = useState("");
    const [imageUrl, setImageUrl] = useState("")

    const getImageUrl = async () => {
        try {
            const res = await axios.get(`https://zojaxblogs.wpengine.com/wp-json/wp/v2/media/${post.acf.thumbnail}`)
            setImageUrl(res.data.guid.rendered)
        } catch (err) {
            setImageUrl("")
        }
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            setPostUrl(`${window.location.origin}/posts/${post.slug}`);
        }
    }, [post.slug]);

    useEffect(() => {
        getImageUrl()
    }, [])

    return (

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10 border-b border-gray-200 pb-6">
            {/* Thumbnail */}
            <div className="relative w-full h-40 sm:h-44 md:w-40 md:h-28 flex-shrink-0 sm:block hidden">
                {imageUrl && (
                    <Image
                        src={imageUrl}
                        alt="blog_image"
                        fill
                        className="object-cover rounded-lg"
                    />
                )}
            </div>

            {/* Date */}
            <div className="text-sm text-gray-600 md:w-[15%] text-nowrap sm:hidden block">
                {new Date(post.date).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })}
            </div>
            {/* Title */}
            <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-[#000000] hover:underline flex-shrink md:w-[20%]">
                {post.title}
            </h3>

            {/* Abstract (hidden on mobile) */}
            <p className="text-[#000000] text-base font-sans md:w-[35%] line-clamp-2">
                {post.acf.abstract_}
            </p>

            {/* Date */}
            <div className="text-sm text-gray-600 md:w-[15%] text-nowrap sm:block hidden">
                {new Date(post.date).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })}
            </div>

            {/* Read more */}
            <div className="text-blue-600 hover:text-blue-800 font-medium md:w-[10%] text-nowrap">
                Read more →
            </div>
        </div>




    );
}



