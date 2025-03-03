import React from 'react';
import Link from 'next/link';

interface Category {
    id: number;
    name: string;
    icon: string;
    count: number;
}

interface PopularCategoryProps {
    category: Category;
}

export const PopularCategory = ({ category }: PopularCategoryProps) => {
    return (
        <Link href={`/category/${category.id}`}>
            <div className="bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition duration-300 p-6 flex items-center gap-4">
                <div className="text-4xl">{category.icon}</div>
                <div>
                    <h3 className="font-medium text-gray-800">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.count} açık iş ilanı</p>
                </div>
            </div>
        </Link>
    );
}; 