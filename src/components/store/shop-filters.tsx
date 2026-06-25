import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/form-controls";

export function ShopFilters({
  categories,
  q,
  category,
  sort,
}: {
  categories: Array<{ id: string; name: string; slug: string }>;
  q?: string;
  category?: string;
  sort?: string;
}) {
  return (
    <form className="grid gap-3 rounded-lg border border-[#e8d3b8] bg-white p-4 md:grid-cols-[1fr_220px_180px_auto]">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-[#94715e]" />
        <Input name="q" defaultValue={q} placeholder="Search products" className="pl-10" />
      </div>
      <Select name="category" defaultValue={category ?? ""} aria-label="Filter by category">
        <option value="">All categories</option>
        {categories.map((item) => (
          <option key={item.id} value={item.slug}>
            {item.name}
          </option>
        ))}
      </Select>
      <Select name="sort" defaultValue={sort ?? "newest"} aria-label="Sort products">
        <option value="newest">Newest</option>
        <option value="price-asc">Price: low to high</option>
        <option value="price-desc">Price: high to low</option>
      </Select>
      <Button type="submit">Apply</Button>
    </form>
  );
}
