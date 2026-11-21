import { useState } from 'react';
import { Compass } from 'lucide-react';

interface Props {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  aspectClass?: string;
}

export function EditorialImage({ src, alt, caption, className = '', aspectClass = 'aspect-[4/3]' }: Props) {
  const [failed, setFailed] = useState(false);

  return (
    <figure className={`w-full ${className}`}>
      <div className={`w-full overflow-hidden border border-[#D9CFC0] bg-[#E9E2D5] ${aspectClass}`}>
        {!failed ? (
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            onError={() => setFailed(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#F7F4EC] to-[#E9E2D5]">
            <Compass className="w-8 h-8 text-[#34483D] mb-3" />
            <p className="font-serif text-base text-[#34483D]">{alt}</p>
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="mt-2 text-xs font-serif italic text-[#5C625A]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
