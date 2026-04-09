import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxDividerProps {
  imageUrl: string;
  height?: string;
  overlayOpacity?: number;
  children?: React.ReactNode;
}

const ParallaxDivider = ({ imageUrl, height = '300px', overlayOpacity = 0.6, children }: ParallaxDividerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['-20%', '20%']);

  return (
    <div ref={ref} className="relative overflow-hidden" style={{ height }}>
      <motion.div
        style={{ y }}
        className="absolute inset-0 -top-[20%] -bottom-[20%]"
      >
        <img
          src={imageUrl}
          alt=""
          className="w-full h-[140%] object-cover"
          loading="lazy"
        />
      </motion.div>
      <div
        className="absolute inset-0 bg-primary"
        style={{ opacity: overlayOpacity }}
      />
      {children && (
        <div className="relative z-10 flex items-center justify-center h-full text-primary-foreground">
          {children}
        </div>
      )}
    </div>
  );
};

export default ParallaxDivider;
