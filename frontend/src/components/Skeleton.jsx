import React from 'react';

export const RecipeCardSkeleton = () => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
            <div className="h-56 bg-gray-200"></div>
            <div className="p-5">
                <div className="h-6 bg-gray-200 rounded-lg mb-3 w-3/4"></div>
                <div className="mt-auto pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                </div>
                <div className="mt-4 h-10 bg-gray-200 rounded-xl"></div>
            </div>
        </div>
    );
};

export const RecipeDetailSkeleton = () => {
    return (
        <div className="max-w-5xl mx-auto my-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="h-96 bg-gray-200 animate-pulse"></div>
                <div className="p-8">
                    <div className="grid md:grid-cols-3 gap-10">
                        <div className="md:col-span-1">
                            <div className="h-8 bg-gray-200 rounded-lg mb-6 w-1/2"></div>
                            <div className="space-y-3">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="h-12 bg-gray-200 rounded-lg"></div>
                                ))}
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <div className="h-8 bg-gray-200 rounded-lg mb-6 w-1/2"></div>
                            <div className="space-y-3">
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const HomeSkeleton = () => {
    return (
        <div className="space-y-10">
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-16">
                <div className="text-center">
                    <div className="h-16 w-16 bg-white/10 rounded-2xl mx-auto mb-6"></div>
                    <div className="h-12 bg-white/10 rounded-lg mb-4 w-1/2 mx-auto"></div>
                    <div className="h-6 bg-white/10 rounded-lg w-3/4 mx-auto mb-8"></div>
                    <div className="h-14 bg-white/10 rounded-2xl max-w-xl mx-auto"></div>
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div key={i} className="h-10 w-24 bg-gray-200 rounded-full"></div>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <RecipeCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
};
