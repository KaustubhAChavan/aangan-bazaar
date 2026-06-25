import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/form-controls";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { categorySchema } from "@/lib/validations/schemas";

export const dynamic = "force-dynamic";

function parseCategory(formData: FormData) {
  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    imageUrl: formData.get("imageUrl"),
    isActive: formData.get("isActive") === "true",
  });
  if (!parsed.success) {
    throw new Error("Invalid category.");
  }
  return {
    ...parsed.data,
    slug: slugify(parsed.data.slug || parsed.data.name),
    imageUrl: parsed.data.imageUrl || null,
  };
}

async function createCategory(formData: FormData) {
  "use server";
  await prisma.category.create({ data: parseCategory(formData) });
  revalidatePath("/admin/categories");
}

async function updateCategory(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  await prisma.category.update({ where: { id }, data: parseCategory(formData) });
  revalidatePath("/admin/categories");
}

async function deleteCategory(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count === 0) {
    await prisma.category.delete({ where: { id } });
  } else {
    await prisma.category.update({ where: { id }, data: { isActive: false } });
  }
  revalidatePath("/admin/categories");
}

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <p className="text-sm font-bold uppercase text-[#d94a2b]">Categories</p>
      <h1 className="mt-2 text-4xl font-black text-[#2b1b12]">Manage categories</h1>
      <Card className="mt-6 p-5">
        <h2 className="text-xl font-bold text-[#2b1b12]">Add category</h2>
        <CategoryForm action={createCategory} submitLabel="Add category" />
      </Card>

      <div className="mt-5 grid gap-5">
        {categories.map((category) => (
          <Card key={category.id} className="p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-[#2b1b12]">{category.name}</h2>
                <p className="text-sm text-[#76513d]">{category._count.products} products</p>
              </div>
              <Badge variant={category.isActive ? "success" : "muted"}>
                {category.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <CategoryForm
              action={updateCategory}
              submitLabel="Save category"
              hiddenId={category.id}
              initialValues={category}
            />
            <form action={deleteCategory} className="mt-4">
              <input type="hidden" name="id" value={category.id} />
              <Button type="submit" variant="destructive">
                {category._count.products > 0 ? "Deactivate" : "Delete"}
              </Button>
            </form>
          </Card>
        ))}
      </div>
    </div>
  );
}

function CategoryForm({
  action,
  submitLabel,
  hiddenId,
  initialValues,
}: {
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
  hiddenId?: string;
  initialValues?: {
    name: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
    isActive: boolean;
  };
}) {
  return (
    <form action={action} className="mt-5 grid gap-4 md:grid-cols-2">
      {hiddenId ? <input type="hidden" name="id" value={hiddenId} /> : null}
      <Field label="Name">
        <Input name="name" defaultValue={initialValues?.name} required />
      </Field>
      <Field label="Slug">
        <Input name="slug" defaultValue={initialValues?.slug} placeholder="Auto-generated if blank" />
      </Field>
      <Field label="Image URL">
        <Input name="imageUrl" defaultValue={initialValues?.imageUrl ?? ""} />
      </Field>
      <label className="flex items-center gap-2 self-end text-sm font-semibold text-[#4b3428]">
        <input type="checkbox" name="isActive" value="true" defaultChecked={initialValues?.isActive ?? true} />
        Active
      </label>
      <div className="md:col-span-2">
        <Field label="Description">
          <Textarea name="description" defaultValue={initialValues?.description ?? ""} />
        </Field>
      </div>
      <div className="md:col-span-2">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
