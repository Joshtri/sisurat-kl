import React from "react";
import { Card, Skeleton as HeroUISkeleton } from "@heroui/react";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  isLoaded?: boolean;
  children?: React.ReactNode;
}

interface SkeletonLineProps {
  className?: string;
  width?: string;
  height?: string;
  isLoaded?: boolean;
}

interface SkeletonGroupProps {
  className?: string;
  isLoaded?: boolean;
  lines?: number;
  children?: React.ReactNode;
}

// Basic Skeleton wrapper
const Skeleton: React.FC<SkeletonProps> = ({
  className,
  isLoaded = false,
  children,
  ...props
}) => {
  return (
    <HeroUISkeleton
      className={cn("rounded-lg", className)}
      isLoaded={isLoaded}
      {...props}
    >
      {children}
    </HeroUISkeleton>
  );
};

// Skeleton untuk single line
export const SkeletonLine: React.FC<SkeletonLineProps> = ({
  className,
  width = "100%",
  height = "0.75rem",
  isLoaded = false,
}) => {
  return (
    <HeroUISkeleton
      className={cn("rounded-lg", className)}
      isLoaded={isLoaded}
      style={{ width }}
    >
      <div className="bg-default-200 rounded-lg" style={{ width, height }} />
    </HeroUISkeleton>
  );
};

// Skeleton untuk multiple lines
export const SkeletonLines: React.FC<SkeletonGroupProps> = ({
  className,
  isLoaded = false,
  lines = 3,
}) => {
  const widths = ["w-3/5", "w-4/5", "w-2/5"];

  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <HeroUISkeleton
          key={index}
          className={cn("rounded-lg", widths[index % widths.length])}
          isLoaded={isLoaded}
        >
          <div
            className={cn(
              "h-3 rounded-lg bg-default-200",
              widths[index % widths.length],
            )}
          />
        </HeroUISkeleton>
      ))}
    </div>
  );
};

// Skeleton untuk Avatar
export const SkeletonAvatar: React.FC<{
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  isLoaded?: boolean;
}> = ({ size = "md", className, isLoaded = false }) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
  };

  return (
    <HeroUISkeleton
      className={cn("rounded-full", className)}
      isLoaded={isLoaded}
    >
      <div className={cn("rounded-full bg-default-300", sizes[size])} />
    </HeroUISkeleton>
  );
};

// Skeleton untuk Card (base dari contoh Hero UI)
export const SkeletonCard: React.FC<{
  className?: string;
  isLoaded?: boolean;
  showImage?: boolean;
  imageHeight?: string;
  width?: string;
}> = ({
  className,
  isLoaded = false,
  showImage = true,
  imageHeight = "6rem",
  width = "200px",
}) => {
  return (
    <Card
      className={cn("space-y-5 p-4", className)}
      radius="lg"
      style={{ width }}
    >
      {showImage && (
        <HeroUISkeleton className="rounded-lg" isLoaded={isLoaded}>
          <div
            className="rounded-lg bg-default-300"
            style={{ height: imageHeight }}
          />
        </HeroUISkeleton>
      )}
      <SkeletonLines isLoaded={isLoaded} lines={3} />
    </Card>
  );
};

// Skeleton untuk Post Card
export const SkeletonPostCard: React.FC<{
  className?: string;
  isLoaded?: boolean;
}> = ({ className, isLoaded = false }) => {
  return (
    <Card className={cn("w-full space-y-4 p-4", className)} radius="lg">
      {/* Header dengan avatar */}
      <div className="flex items-center space-x-3">
        <SkeletonAvatar isLoaded={isLoaded} size="md" />
        <div className="flex-1 space-y-2">
          <HeroUISkeleton className="w-1/3 rounded-lg" isLoaded={isLoaded}>
            <div className="h-4 w-1/3 rounded-lg bg-default-200" />
          </HeroUISkeleton>
          <HeroUISkeleton className="w-1/4 rounded-lg" isLoaded={isLoaded}>
            <div className="h-3 w-1/4 rounded-lg bg-default-200" />
          </HeroUISkeleton>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <HeroUISkeleton className="w-full rounded-lg" isLoaded={isLoaded}>
          <div className="h-3 w-full rounded-lg bg-default-200" />
        </HeroUISkeleton>
        <HeroUISkeleton className="w-4/5 rounded-lg" isLoaded={isLoaded}>
          <div className="h-3 w-4/5 rounded-lg bg-default-200" />
        </HeroUISkeleton>
      </div>

      {/* Image */}
      <HeroUISkeleton className="rounded-lg" isLoaded={isLoaded}>
        <div className="h-48 rounded-lg bg-default-300" />
      </HeroUISkeleton>
    </Card>
  );
};

// Skeleton untuk Table
export const SkeletonTable: React.FC<{
  rows?: number;
  columns?: number;
  className?: string;
  isLoaded?: boolean;
}> = ({ rows = 5, columns = 4, className, isLoaded = false }) => {
  return (
    <Card className={cn("p-4", className)} radius="lg">
      <div className="space-y-4">
        {/* Header */}
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, index) => (
            <HeroUISkeleton
              key={`header-${index}`}
              className="rounded-lg"
              isLoaded={isLoaded}
            >
              <div className="h-5 rounded-lg bg-default-300" />
            </HeroUISkeleton>
          ))}
        </div>

        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <HeroUISkeleton
                key={`cell-${rowIndex}-${colIndex}`}
                className="rounded-lg"
                isLoaded={isLoaded}
              >
                <div className="h-4 rounded-lg bg-default-200" />
              </HeroUISkeleton>
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
};

// Skeleton untuk List Item
export const SkeletonListItem: React.FC<{
  className?: string;
  isLoaded?: boolean;
  showAvatar?: boolean;
  showSecondary?: boolean;
}> = ({
  className,
  isLoaded = false,
  showAvatar = false,
  showSecondary = true,
}) => {
  return (
    <div className={cn("flex items-center space-x-3 p-3", className)}>
      {showAvatar && <SkeletonAvatar isLoaded={isLoaded} size="md" />}
      <div className="flex-1 space-y-2">
        <HeroUISkeleton className="w-3/4 rounded-lg" isLoaded={isLoaded}>
          <div className="h-4 w-3/4 rounded-lg bg-default-200" />
        </HeroUISkeleton>
        {showSecondary && (
          <HeroUISkeleton className="w-1/2 rounded-lg" isLoaded={isLoaded}>
            <div className="h-3 w-1/2 rounded-lg bg-default-200" />
          </HeroUISkeleton>
        )}
      </div>
    </div>
  );
};

// Skeleton untuk List
export const SkeletonList: React.FC<{
  items?: number;
  className?: string;
  isLoaded?: boolean;
  showAvatar?: boolean;
  showSecondary?: boolean;
}> = ({
  items = 3,
  className,
  isLoaded = false,
  showAvatar = false,
  showSecondary = true,
}) => {
  return (
    <Card className={cn("p-2", className)} radius="lg">
      <div className="space-y-1">
        {Array.from({ length: items }).map((_, index) => (
          <SkeletonListItem
            key={index}
            isLoaded={isLoaded}
            showAvatar={showAvatar}
            showSecondary={showSecondary}
          />
        ))}
      </div>
    </Card>
  );
};

// Skeleton untuk Button
export const SkeletonButton: React.FC<{
  className?: string;
  isLoaded?: boolean;
  size?: "sm" | "md" | "lg";
}> = ({ className, isLoaded = false, size = "md" }) => {
  const sizes = {
    sm: "h-8 w-20",
    md: "h-10 w-24",
    lg: "h-12 w-28",
  };

  return (
    <HeroUISkeleton className={cn("rounded-lg", className)} isLoaded={isLoaded}>
      <div className={cn("rounded-lg bg-default-300", sizes[size])} />
    </HeroUISkeleton>
  );
};

// Skeleton untuk Input
export const SkeletonInput: React.FC<{
  className?: string;
  isLoaded?: boolean;
  width?: string;
}> = ({ className, isLoaded = false, width = "100%" }) => {
  return (
    <HeroUISkeleton
      className={cn("rounded-lg", className)}
      isLoaded={isLoaded}
      style={{ width }}
    >
      <div className="h-10 rounded-lg bg-default-200" style={{ width }} />
    </HeroUISkeleton>
  );
};

// Skeleton untuk Form
export const SkeletonForm: React.FC<{
  className?: string;
  isLoaded?: boolean;
  fields?: number;
}> = ({ className, isLoaded = false, fields = 4 }) => {
  return (
    <Card className={cn("p-6 space-y-4", className)} radius="lg">
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className="space-y-2">
          <HeroUISkeleton className="w-1/4 rounded-lg" isLoaded={isLoaded}>
            <div className="h-4 w-1/4 rounded-lg bg-default-200" />
          </HeroUISkeleton>
          <SkeletonInput isLoaded={isLoaded} />
        </div>
      ))}
      <div className="flex gap-3 pt-4">
        <SkeletonButton isLoaded={isLoaded} size="md" />
        <SkeletonButton isLoaded={isLoaded} size="md" />
      </div>
    </Card>
  );
};

export default Skeleton;
