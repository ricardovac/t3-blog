import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import PostListing from "../components/PostListing";
import React, { useState } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";

export type Post = {
  id: string;
  title: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: {
    name: string | null;
    image: string | null;
  };
};

const Home: NextPage = () => {
  const { status } = useSession();
  const { data } = trpc.post.allPost.useQuery(); // Using just to filter the posts.
  const [searchInput, setSearchInput] = useState("");
  const [filteredResults, setFilteredResults] = useState<Post[]>();

  const searchItems = (searchValue: React.SetStateAction<string>) => {
    setSearchInput(searchValue);
    if (searchInput !== "") {
      const filteredData = data?.filter((item) => {
        return Object.values(item)
          .join("")
          .toLowerCase()
          .includes(searchInput.toLowerCase());
      });
      setFilteredResults(filteredData);
    } else {
      setFilteredResults(data);
    }
  };

  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-900">
        <div className="text-white">
          You need to{" "}
          <button
            onClick={() => signIn()}
            className="text-blue-500 underline-offset-1 hover:text-blue-700"
          >
            login
          </button>{" "}
          to create a post
        </div>
        <PostListing />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>T3 Blog</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-900">
        <div className="flex w-2/4 justify-between gap-2 rounded text-white">
          <Link href="/posts/new">
            <h1 className="hover rounded border p-2 hover:bg-zinc-800">
              Create Post
            </h1>
          </Link>
          <input
            type="text"
            className="hover flex-grow rounded border bg-transparent p-2 hover:bg-zinc-800"
            placeholder="Search posts..."
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              searchItems(e.target.value)
            }
          />
          <button
            onClick={() => signOut()}
            className="hover rounded border p-2 hover:bg-zinc-800"
          >
            Logout
          </button>
        </div>
        {searchInput.length > 1 ? (
          <div className="mx-auto flex w-full flex-col items-center justify-center">
            {filteredResults?.map((posts: Post) => {
              return (
                <article
                  key={posts.id}
                  className="m-2 w-2/4 scale-100 overflow-hidden rounded-md border-4 border-zinc-500 p-4 shadow duration-500 ease-in hover:shadow-md hover:shadow-zinc-700"
                >
                  <div className="flex items-center justify-between">
                    <h1 className="text-4xl font-extrabold text-white">
                      {posts.title}
                    </h1>
                    <img
                      src={posts.user.image}
                      alt="Profile"
                      className="w-10 rounded-full"
                    />
                  </div>
                  <p className="max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap text-white opacity-25">
                    {posts.body}
                  </p>
                  <Link
                    href={`/posts/${posts.id}`}
                    className="flex items-center justify-between text-zinc-200"
                  >
                    <div className="flex items-center gap-1">
                      <span>Read post </span>
                      <AiOutlineArrowRight />
                    </div>
                    <p>{posts.user.name}</p>
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <PostListing />
        )}
      </main>
    </>
  );
};

export default Home;
