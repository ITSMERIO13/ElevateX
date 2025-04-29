const SkeletonBox = ({ className }) => (
    <div className={`animate-pulse bg-gray-300 rounded ${className}`}></div>
  );
  
  const ProjectSkeleton = () => {
    return (
      <div className="max-w-4xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-md space-y-4">
        <SkeletonBox className="w-full h-64 mb-6" />
        <SkeletonBox className="h-8 w-2/3" />
        <SkeletonBox className="h-5 w-1/2" />
        <SkeletonBox className="h-5 w-40 mt-2" />
        <SkeletonBox className="h-5 w-3/4 mt-4" />
        <SkeletonBox className="h-5 w-1/3" />
        <SkeletonBox className="h-5 w-2/3" />
        <SkeletonBox className="h-5 w-1/2" />
      </div>
    );
  };
  
  export default ProjectSkeleton;
  