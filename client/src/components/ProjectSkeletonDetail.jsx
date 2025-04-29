import React from "react";

const SkeletonBox = ({ className }) => (
  <div className={`bg-zinc-800 animate-pulse rounded-md ${className}`} />
);

const ProjectSkeleton = () => {
  return (
    <div className="min-h-screen bg-black text-white pb-16">
      <header className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto p-6">
          <SkeletonBox className="w-48 h-10" />
        </div>
      </header>

      <main className="max-w-6xl mx-auto mt-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left column */}
          <div className="lg:col-span-2">
            {/* Image Skeleton */}
            <div className="relative mb-8 rounded-lg overflow-hidden">
              <SkeletonBox className="w-full h-80 rounded-lg" />
            </div>

            {/* Title */}
            <SkeletonBox className="w-2/3 h-10 mb-6" />

            {/* Description */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 mb-8">
              <SkeletonBox className="w-1/3 h-6 mb-4" />
              <SkeletonBox className="w-full h-24" />
            </div>

            {/* SDGs */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 mb-8">
              <SkeletonBox className="w-1/2 h-6 mb-6" />
              <div className="flex flex-wrap gap-3">
                {Array(4).fill(0).map((_, i) => (
                  <SkeletonBox key={i} className="w-32 h-10" />
                ))}
              </div>
            </div>

            {/* Comments */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8">
              <SkeletonBox className="w-1/3 h-6 mb-4" />
              <SkeletonBox className="w-full h-24" />
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-8 sticky top-6">
              <SkeletonBox className="w-full h-12 mb-8" />

              <SkeletonBox className="w-1/2 h-6 mb-4" />
              <SkeletonBox className="w-2/3 h-6 mb-2" />
              <SkeletonBox className="w-full h-16 mb-4" />

              {/* Team Lead */}
              <SkeletonBox className="w-1/3 h-4 mb-2" />
              <div className="flex items-center gap-3 mb-4">
                <SkeletonBox className="w-8 h-8 rounded-full" />
                <SkeletonBox className="w-1/2 h-4" />
              </div>

              {/* Mentor */}
              <SkeletonBox className="w-1/3 h-4 mb-2" />
              <div className="flex items-center gap-3 mb-4">
                <SkeletonBox className="w-8 h-8 rounded-full" />
                <div className="flex flex-col gap-2">
                  <SkeletonBox className="w-32 h-4" />
                  <SkeletonBox className="w-40 h-4" />
                </div>
              </div>

              {/* Members */}
              <SkeletonBox className="w-1/3 h-4 mb-2" />
              <div className="space-y-2">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <SkeletonBox className="w-8 h-8 rounded-full" />
                    <SkeletonBox className="w-1/2 h-4" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectSkeleton;
