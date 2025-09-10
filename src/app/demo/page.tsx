import { createSupabaseServerClient } from '@/lib/supabase';
import { DemoWidget } from "@/features/demo/components/DemoWidget";

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error(error);
  }
  return (
    <main className="min-h-screen w-full flex items-center justify-center p-6">
      <DemoWidget />
      <div>
        <p>Session: {JSON.stringify({ user: data?.session?.user }, null, 2)}</p>
      </div>
    </main>
  );
}
