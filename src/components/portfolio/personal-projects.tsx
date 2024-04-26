"use client"

import Image from 'next/image'
import React, { useState } from 'react'
import projectsData from "@/projects.json";
import Link from 'next/link';

interface Project {
    id: string;
    link: string;
    title: string;
    description: string;
    stack: string[];
    image: string;
}

const PersonalProjects = () => {
    const [hoveredProject, setHoveredProject] = useState<string | null>(null);

    return (
        <div className='flex flex-col gap-5'>
            {
                projectsData.personalProjects.map((project: Project) => (
                    <Link
                        href={project.link}
                        key={project.id}
                        target='_blank'
                        className='transition-colors hover:bg-foreground border-2 border-foreground p-4 flex-col-reverse md:flex-row flex gap-3 rounded'
                        onMouseEnter={() => setHoveredProject(project.id)}
                        onMouseLeave={() => setHoveredProject(null)}
                    >
                        <Image
                            src={project.image}
                            alt={`${project.title} Screenshot`}
                            width={200}
                            height={100}
                            className='w-[200px] h-[116px] rounded border-2 border-background'
                        />

                        <div className='flex flex-col gap-4'>
                            <h1 className='font-bold text-lg flex items-center gap-2'>
                                {project.title}
                                <DiagonalArrowIcon
                                    className={hoveredProject === project.id
                                        ? "transition translate-y-[-5px] translate-x-[5px]"
                                        : ""}
                                />
                            </h1>
                            <p className='text-sm text-gray-800 dark:text-gray-300 text-balance'>
                                {project.description}
                            </p>
                            <div className='flex items-center gap-2 flex-wrap'>
                                {
                                    project.stack.map(tech => (
                                        <span key={tech} className='text-xs font-medium bg-color-secondary py-1 px-3 rounded-full'>
                                            {tech}
                                        </span>
                                    ))
                                }
                            </div>
                        </div>
                    </Link>
                ))
            }
        </div>
    );
}

const DiagonalArrowIcon = (props: any) => (
    <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        height="16"
        width="16"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path fill="none" d="M0 0h24v24H0z"></path>
        <path d="M6 6v2h8.59L5 17.59 6.41 19 16 9.41V18h2V6z"></path>
    </svg>
);

export default PersonalProjects;