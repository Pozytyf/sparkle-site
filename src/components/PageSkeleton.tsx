import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

const PageSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen"
    >
      {/* Hero skeleton */}
      <div className="relative pt-32 pb-20 bg-primary">
        <div className="container-custom">
          <Skeleton className="h-6 w-48 bg-primary-foreground/10 mb-6 rounded-full" />
          <Skeleton className="h-12 w-3/4 bg-primary-foreground/10 mb-4" />
          <Skeleton className="h-6 w-1/2 bg-primary-foreground/10" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12">
            <Skeleton className="h-80 rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-12 w-40 mt-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Cards skeleton */}
      <div className="section-padding bg-muted">
        <div className="container-custom">
          <div className="text-center mb-12">
            <Skeleton className="h-4 w-32 mx-auto mb-4" />
            <Skeleton className="h-8 w-64 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl p-6 space-y-4">
                <Skeleton className="h-16 w-16 rounded-full mx-auto" />
                <Skeleton className="h-6 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PageSkeleton;
