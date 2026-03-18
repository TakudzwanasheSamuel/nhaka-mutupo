"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GamePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[50vh] text-white/50 text-sm">
      Redirecting to game...
    </div>
  );
}
