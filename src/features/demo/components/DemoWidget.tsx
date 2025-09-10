"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useHello } from "../hooks/useHello";
import {
  useCounterActions,
  useCounterError,
  useCounterLoading,
  useCounterValue,
} from "@/stores/counterStore";

export function DemoWidget() {
  const { data, isLoading, error, refetch, isRefetching } = useHello();
  const value = useCounterValue();
  const loading = useCounterLoading();
  const counterError = useCounterError();
  const { increment, decrement, reset, simulateAsyncIncrement } = useCounterActions();

  return (
    <Card className="max-w-md w-full">
      <CardHeader>
        <CardTitle>Demo – TanStack Query + Zustand</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-sm text-muted-foreground mb-2">Query result</div>
          {isLoading ? (
            <Skeleton className="h-5 w-64" />
          ) : error ? (
            <div className="text-red-600 text-sm">{String(error)}</div>
          ) : (
            <div className="text-sm">
              {data?.message} <span className="text-muted-foreground">@ {data?.time}</span>
            </div>
          )}
          <div className="mt-2 flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => refetch()} disabled={isRefetching}>
              {isRefetching ? "Refreshing..." : "Refetch"}
            </Button>
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="text-sm text-muted-foreground mb-2">Zustand counter</div>
          <div className="flex items-center gap-3">
            <div className="text-lg font-medium tabular-nums min-w-10 text-center">{value}</div>
            <Button size="sm" onClick={decrement} variant="outline">-</Button>
            <Button size="sm" onClick={increment} variant="outline">+</Button>
            <Button size="sm" onClick={reset} variant="secondary">Reset</Button>
            <Button size="sm" onClick={simulateAsyncIncrement} disabled={loading}>
              {loading ? "Adding..." : "Async +1"}
            </Button>
          </div>
          {counterError && <div className="text-red-600 text-xs mt-2">{counterError}</div>}
        </div>
      </CardContent>
    </Card>
  );
}


