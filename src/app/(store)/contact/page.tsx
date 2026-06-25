import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/form-controls";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations/schemas";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Aangan Foods for menu, order, delivery, or support questions.",
};

async function submitContact(formData: FormData) {
  "use server";

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    redirect("/contact?error=1");
  }

  await prisma.contactMessage.create({
    data: parsed.data,
  });

  redirect("/contact?sent=1");
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
      <div>
        <p className="text-sm font-bold uppercase text-[#d94a2b]">Contact</p>
        <h1 className="mt-2 text-4xl font-black text-[#2b1b12]">We are here for menu and order questions</h1>
        <p className="mt-4 leading-7 text-[#76513d]">
          Messages are stored in the admin dashboard so the store owner can track,
          mark, and close support conversations.
        </p>
        <div className="mt-6 rounded-lg border border-[#e8d3b8] bg-white p-5 text-sm leading-6 text-[#654332]">
          <strong>Email:</strong> support@aanganfoods.example
          <br />
          <strong>Hours:</strong> Monday to Saturday, 10 AM to 6 PM IST
        </div>
      </div>
      <Card className="p-5">
        {params.sent ? (
          <div className="mb-5 rounded-md bg-green-50 p-3 text-sm font-semibold text-green-800">
            Your message has been sent.
          </div>
        ) : null}
        {params.error ? (
          <div className="mb-5 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-800">
            Please check the form details and try again.
          </div>
        ) : null}
        <form action={submitContact} className="grid gap-4">
          <Field label="Name">
            <Input name="name" required />
          </Field>
          <Field label="Email">
            <Input name="email" type="email" required />
          </Field>
          <Field label="Phone">
            <Input name="phone" />
          </Field>
          <Field label="Message">
            <Textarea name="message" required />
          </Field>
          <Button type="submit">Send message</Button>
        </form>
      </Card>
    </div>
  );
}
