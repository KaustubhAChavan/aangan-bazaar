import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Pagination({
  page,
  totalPages,
  basePath,
  params,
}: {
  page: number;
  totalPages: number;
  basePath: string;
  params: Record<string, string | undefined>;
}) {
  const createHref = (nextPage: number) => {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value) {
        search.set(key, value);
      }
    }
    search.set("page", String(nextPage));
    return `${basePath}?${search.toString()}`;
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <Button asChild variant="outline" disabled={page <= 1}>
        <Link href={createHref(Math.max(1, page - 1))}>Previous</Link>
      </Button>
      <span className="text-sm font-semibold text-[#654332]">
        Page {page} of {totalPages}
      </span>
      <Button asChild variant="outline" disabled={page >= totalPages}>
        <Link href={createHref(Math.min(totalPages, page + 1))}>Next</Link>
      </Button>
    </div>
  );
}
