'use client';

import { useEffect, useRef } from 'react';
import { Video } from '@/types/product';
import { animateOnScroll } from '@/app/lib/gsapAnimations';

type Props = {
  videos: Video[];
};

export default function VideoSection({ videos }: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      animateOnScroll(sectionRef.current);
    }
  }, []);

  if (videos.length === 0) return null;

  return (
    <section ref={sectionRef} className="py-16 px-6">
      <h2 className="text-2xl font-bold mb-8 text-center">Videos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {videos.map((video) => (
          <div
            key={video.id}
            className="rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-300"
          >
            <video
              src={video.video_url}
              poster={video.thumbnail_url ?? undefined}
              controls
              className="w-full aspect-video object-cover"
            />
            <div className="p-4">
              <p className="font-semibold text-sm">{video.title}</p>
              {video.description && (
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  {video.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}