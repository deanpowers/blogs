import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/app/lib/posts";
import PostCard from "@/app/components/PostCard";
import ZojaxLogo from "@/assets/main-image.png"
export default async function Home() {
  const posts = await getAllPosts();
  return (
    <div className="py-4 px-4 sm:px-20 font-[family-name:var(--font-geist-sans)] bg-white">
      <div className="">
        <Image src={ZojaxLogo} className="w-28 mb-4" alt="logo" />
      </div>
      <h3 className="text-xl mb-4 text-center md:text-2xl lg:text-3xl font-semibold text-[#000000] hover:underline flex-shrink md:w-[20%]">
        Our Blog Posts
      </h3>
      <div className="flex lg:flex-row flex-col items-center justify-between">
        {/* <h1 className="text-4xl lg:text-8xl font-extrabold text-black">Blog</h1>
          <p className="text-muted-foreground mt-2 text-gray-400">A statically generated blog example using Next.js and WordPress.</p> */}
      </div>

      <section className="grid gap-6">
        <div className="overflow-x-auto md:overflow-visible">
          {posts.map((post) => (

            <Link key={post.id} href={`/posts/${post.slug}`} className="no-underline">
              <PostCard post={post} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
