import { SkeletonBlock } from "../ui/skeleton/SkeletonBlock";

function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Skeleton untuk UserProfileSection */}
      <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <SkeletonBlock width="w-32" height="h-6" />
          <SkeletonBlock width="w-10" height="h-6" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SkeletonBlock height="h-10" />
          <SkeletonBlock height="h-10" />
          <SkeletonBlock height="h-10" />
          <SkeletonBlock height="h-10" />
          <SkeletonBlock height="h-10" />
        </div>
      </div>

      {/* Skeleton untuk WargaProfileSection */}
      <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <SkeletonBlock width="w-40" height="h-6" />
          <SkeletonBlock width="w-10" height="h-6" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(10)].map((_, i) => (
            <SkeletonBlock key={i} height="h-10" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProfileSkeleton;
