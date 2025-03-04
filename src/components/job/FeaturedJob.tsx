import React from 'react';
import Link from 'next/link';

interface Job {
    id: number;
    title: string;
    description: string;
    budget: string;
    deadline: string;
    skills: string[];
    clientName: string;
    clientRating: number;
}

interface FeaturedJobProps {
    job: Job;
}

export const FeaturedJob = ({ job }: FeaturedJobProps) => {
    return (
        <div className="card hover:shadow-md transition-shadow duration-300">
            <Link href={`/job/${job.id}`} className="block">
                <h3 className="text-xl font-semibold text-gray-800 mb-2 hover:text-primary transition">
                    {job.title}
                </h3>
            </Link>
            <p className="text-gray-600 mb-4 text-sm line-clamp-2">{job.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
                {job.skills.map((skill, index) => (
                    <span
                        key={index}
                        className="inline-block bg-pastel-blue/20 text-primary px-2 py-1 rounded-md text-xs"
                    >
                        {skill}
                    </span>
                ))}
            </div>

            <div className="flex justify-between items-center mb-4">
                <div className="text-sm">
                    <span className="font-medium">Bütçe:</span> <span className="text-gray-600">{job.budget}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium">Süre:</span> <span className="text-gray-600">{job.deadline}</span>
                </div>
            </div>

            <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                <div>
                    <div className="font-medium text-sm">{job.clientName}</div>
                    <div className="flex items-center">
                        <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <svg
                                    key={i}
                                    className={`w-4 h-4 ${i < Math.floor(job.clientRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-1">{job.clientRating.toFixed(1)}</span>
                    </div>
                </div>
                <Link
                    href={`/job/${job.id}`}
                    className="bg-secondary text-white text-sm px-4 py-2 rounded-md hover:opacity-90 transition"
                >
                    Teklif Ver
                </Link>
            </div>
        </div>
    );
}; 