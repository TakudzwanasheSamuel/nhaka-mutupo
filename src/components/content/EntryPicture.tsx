"use client";

import { useContent } from '@/context/ContentContext';
import { Picture, answerPicture, pictureImage } from '@/lib/content';

/** The picture for a totem entry (or a given picture), with its description. */
export function EntryPicture({
  entryId,
  pictureId,
  size,
  className,
  decorative,
}: {
  entryId?: string;
  pictureId?: string;
  size: number;
  className?: string;
  /** Hide from screen readers when the name is already read out nearby. */
  decorative?: boolean;
}) {
  const { content } = useContent();
  let pic: Picture | undefined;
  if (pictureId) pic = content.pictures[pictureId];
  else if (entryId) {
    const entry = content.entries.find(e => e.id === entryId);
    pic = entry ? answerPicture(entry, content) : undefined;
  }
  const src = pictureImage(pic);
  if (!src || !pic) return <span className={className} style={{ width: size, height: size, display: 'block' }} aria-hidden="true" />;
  return (
    <img
      className={className}
      src={src}
      alt={decorative ? '' : pic.imageAlt}
      width={size}
      height={size}
      draggable={false}
      style={pic.imageData ? { borderRadius: '50%', objectFit: 'cover' } : undefined}
    />
  );
}
