import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="flex items-center justify-center min-h-[200px]">
        <Spinner />
      </div>
    </div>
  );
}
