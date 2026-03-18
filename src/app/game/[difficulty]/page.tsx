"use client";

import { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

interface GamePageProps {
  params: Promise<{ difficulty: string }>;
}

export default function GamePage({ params }: GamePageProps) {
  const { difficulty } = use(params);
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
