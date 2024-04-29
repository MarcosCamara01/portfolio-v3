"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useMemo, useState } from "react";
import Link from "next/link";
import { Suspense } from "react";
import useSWR from "swr";

type SortSetting = ["date" | "views", "desc" | "asc"];

const fetcher = (url: string) => fetch(url).then(res => res.json());


export function PostsTable({ posts: initialPosts }: any) {
    const [sort, setSort] = useState<SortSetting>(["date", "desc"]);
    const { data: posts } = useSWR("/api/posts", fetcher, {
        fallbackData: initialPosts,
        refreshInterval: 5000,
    });

    function sortDate() {
        setSort(sort => [
            "date",
            sort[0] !== "date" || sort[1] === "asc" ? "desc" : "asc",
        ]);
    }

    function sortViews() {
        setSort(sort => [
            sort[0] === "views" && sort[1] === "asc" ? "date" : "views",
            sort[0] !== "views" ? "desc" : sort[1] === "asc" ? "desc" : "asc",
        ]);
    }

    return (
        <Suspense fallback={null}>
            <Table className="font-mono text-sm">
                <TableHeader>
                    <TableRow className="border-foreground hover:bg-transparent">
                        <TableHead className="w-[56px] text-xs">
                            <button className={`w-12 h-9 text-left  ${sort[0] === "date" && sort[1] !== "desc"
                                ? "text-gray-700 dark:text-color-primary"
                                : ""
                                }`} onClick={sortDate}>
                                date
                                {sort[0] === "date" && sort[1] === "asc" && "↑"}
                            </button>
                        </TableHead>
                        <TableHead className="text-xs">title</TableHead>
                        <TableHead className="w-[56px] text-xs text-right">
                            <button
                                className={`
                                    h-9
                                    pl-4
                                    text-right
                                    ${sort[0] === "views"
                                        ? "text-gray-700 dark:text-color-primary"
                                        : ""
                                    }`}
                                onClick={sortViews}
                            >
                                {sort[0] === "views" ? (sort[1] === "asc" ? "↑" : "↓") : ""}
                                views
                            </button>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <List posts={posts} sort={sort} />
            </Table>
        </Suspense>
    )
}

function List({ posts, sort }: any) {
    const sortedPosts = useMemo(() => {
        const [sortKey, sortDirection] = sort;
        return [...posts].sort((a, b) => {
            if (sortKey === "date") {
                return sortDirection === "desc"
                    ? new Date(b.date).getTime() - new Date(a.date).getTime()
                    : new Date(a.date).getTime() - new Date(b.date).getTime();
            } else {
                return sortDirection === "desc" ? b.views - a.views : a.views - b.views;
            }
        });
    }, [posts, sort]);

    return (
        <TableBody>
            {sortedPosts.map((post, i: number) => {
                const year = getYear(post.date);

                return (
                    <TableRow key={post.id} className="rounded border-foreground overflow-hidden hover:bg-foreground" >
                        <TableCell className="text-gray-500 text-xs">
                            {year}
                        </TableCell>
                        <TableCell className="p-0">
                            <Link className="px-2 py-3 w-full block" href={`/${new Date(post.date).getFullYear()}/${post.id}`}>
                                {post.title}
                            </Link>
                        </TableCell>
                        <TableCell className="text-gray-500 text-xs text-right">
                            {post.viewsFormatted}
                        </TableCell>
                    </TableRow>
                )
            })}
        </TableBody>
    )
}

function getYear(date: string) {
    return new Date(date).getFullYear();
}

