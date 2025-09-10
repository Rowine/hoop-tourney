'use client';

import { useQuery } from '@tanstack/react-query';

const helloKeys = {
  all: ['hello'] as const,
};

async function fetchHello(): Promise<{ message: string; time: string }> {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 400));
  return { message: 'Hello from TanStack Query!', time: new Date().toISOString() };
}

export function useHello() {
  return useQuery({ queryKey: helloKeys.all, queryFn: fetchHello, staleTime: 10_000 });
}

export { helloKeys };
