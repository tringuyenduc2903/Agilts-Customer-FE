'use client';

import { getCookies } from 'cookies-next';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);
  return (
    <html lang={getCookies()?.NEXT_LOCALE || 'vi'}>
      <body>
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-neutral-800 flex flex-col items-center gap-4'>
          <h2 className='text-2xl md:text-4xl font-bold'>
            Something went wrong!
          </h2>
          <button
            className='bg-neutral-800 text-white px-4 py-2 rounded-sm'
            onClick={() => reset()}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
