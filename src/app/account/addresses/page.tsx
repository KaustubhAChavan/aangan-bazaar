import { revalidatePath } from "next/cache";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form-controls";
import { getOrCreateUserProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { addressSchema } from "@/lib/validations/schemas";

export const dynamic = "force-dynamic";

async function createAddress(formData: FormData) {
  "use server";
  const profile = await getOrCreateUserProfile();
  if (!profile) {
    return;
  }

  const parsed = addressSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return;
  }

  if (parsed.data.isDefault) {
    await prisma.address.updateMany({
      where: { userProfileId: profile.id },
      data: { isDefault: false },
    });
  }

  await prisma.address.create({
    data: { ...parsed.data, userProfileId: profile.id },
  });
  revalidatePath("/account/addresses");
}

async function updateAddress(formData: FormData) {
  "use server";
  const profile = await getOrCreateUserProfile();
  const id = String(formData.get("id") ?? "");
  if (!profile || !id) {
    return;
  }

  const parsed = addressSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return;
  }

  if (parsed.data.isDefault) {
    await prisma.address.updateMany({
      where: { userProfileId: profile.id },
      data: { isDefault: false },
    });
  }

  await prisma.address.updateMany({
    where: { id, userProfileId: profile.id },
    data: parsed.data,
  });
  revalidatePath("/account/addresses");
}

async function deleteAddress(formData: FormData) {
  "use server";
  const profile = await getOrCreateUserProfile();
  const id = String(formData.get("id") ?? "");
  if (!profile || !id) {
    return;
  }

  await prisma.address.deleteMany({ where: { id, userProfileId: profile.id } });
  revalidatePath("/account/addresses");
}

async function setDefaultAddress(formData: FormData) {
  "use server";
  const profile = await getOrCreateUserProfile();
  const id = String(formData.get("id") ?? "");
  if (!profile || !id) {
    return;
  }

  await prisma.$transaction([
    prisma.address.updateMany({
      where: { userProfileId: profile.id },
      data: { isDefault: false },
    }),
    prisma.address.updateMany({
      where: { id, userProfileId: profile.id },
      data: { isDefault: true },
    }),
  ]);
  revalidatePath("/account/addresses");
}

export default async function AccountAddressesPage() {
  const profile = await getOrCreateUserProfile();
  if (!profile) {
    return null;
  }

  const addresses = await prisma.address.findMany({
    where: { userProfileId: profile.id },
    orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
  });

  return (
    <div>
      <p className="text-sm font-bold uppercase text-[#d94a2b]">Addresses</p>
      <h1 className="mt-2 text-4xl font-black text-[#2b1b12]">Manage addresses</h1>

      <Card className="mt-6 p-5">
        <h2 className="text-xl font-bold text-[#2b1b12]">Add address</h2>
        <AddressForm action={createAddress} submitLabel="Add address" />
      </Card>

      <div className="mt-5 grid gap-5">
        {addresses.map((address) => (
          <Card key={address.id} className="p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-[#2b1b12]">{address.fullName}</h2>
              {address.isDefault ? (
                <span className="rounded-full bg-[#2f7d4f] px-3 py-1 text-xs font-bold text-white">Default</span>
              ) : null}
            </div>
            <AddressForm
              action={updateAddress}
              submitLabel="Save changes"
              initialValues={address}
              hiddenId={address.id}
            />
            <div className="mt-4 flex flex-wrap gap-3">
              <form action={setDefaultAddress}>
                <input type="hidden" name="id" value={address.id} />
                <Button type="submit" variant="outline" disabled={address.isDefault}>
                  Set default
                </Button>
              </form>
              <form action={deleteAddress}>
                <input type="hidden" name="id" value={address.id} />
                <Button type="submit" variant="destructive">
                  Delete
                </Button>
              </form>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AddressForm({
  action,
  submitLabel,
  initialValues,
  hiddenId,
}: {
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
  hiddenId?: string;
  initialValues?: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    state: string;
    pincode: string;
    country: string;
    isDefault: boolean;
  };
}) {
  return (
    <form action={action} className="mt-5 grid gap-4 md:grid-cols-2">
      {hiddenId ? <input type="hidden" name="id" value={hiddenId} /> : null}
      <Field label="Full name">
        <Input name="fullName" defaultValue={initialValues?.fullName} required />
      </Field>
      <Field label="Phone">
        <Input name="phone" defaultValue={initialValues?.phone} required />
      </Field>
      <Field label="Address line 1">
        <Input name="addressLine1" defaultValue={initialValues?.addressLine1} required />
      </Field>
      <Field label="Address line 2">
        <Input name="addressLine2" defaultValue={initialValues?.addressLine2 ?? ""} />
      </Field>
      <Field label="City">
        <Input name="city" defaultValue={initialValues?.city} required />
      </Field>
      <Field label="State">
        <Input name="state" defaultValue={initialValues?.state} required />
      </Field>
      <Field label="Pincode">
        <Input name="pincode" defaultValue={initialValues?.pincode} required />
      </Field>
      <Field label="Country">
        <Input name="country" defaultValue={initialValues?.country ?? "India"} required />
      </Field>
      <label className="flex items-center gap-2 text-sm font-semibold text-[#4b3428]">
        <input
          type="checkbox"
          name="isDefault"
          value="true"
          defaultChecked={initialValues?.isDefault}
        />
        Make default
      </label>
      <div className="md:col-span-2">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
