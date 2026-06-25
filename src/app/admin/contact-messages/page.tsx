import { ContactStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/form-controls";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function updateMessageStatus(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status")) as ContactStatus;
  if (!Object.values(ContactStatus).includes(status)) {
    return;
  }

  await prisma.contactMessage.update({
    where: { id },
    data: { status },
  });
  revalidatePath("/admin/contact-messages");
}

export default async function AdminContactMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <p className="text-sm font-bold uppercase text-[#d94a2b]">Messages</p>
      <h1 className="mt-2 text-4xl font-black text-[#2b1b12]">Contact messages</h1>
      <div className="mt-6 grid gap-4">
        {messages.length ? (
          messages.map((message) => (
            <Card key={message.id} className="p-5">
              <div className="grid gap-4 md:grid-cols-[1fr_220px]">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-bold text-[#2b1b12]">{message.name}</h2>
                    <Badge
                      variant={
                        message.status === "NEW"
                          ? "warning"
                          : message.status === "CLOSED"
                            ? "muted"
                            : "default"
                      }
                    >
                      {message.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-[#76513d]">{message.email}</p>
                  {message.phone ? <p className="text-sm text-[#76513d]">{message.phone}</p> : null}
                  <p className="mt-4 whitespace-pre-line leading-7 text-[#4a3124]">{message.message}</p>
                </div>
                <form action={updateMessageStatus} className="grid h-fit gap-3">
                  <input type="hidden" name="id" value={message.id} />
                  <Select name="status" defaultValue={message.status}>
                    {Object.values(ContactStatus).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </Select>
                  <Button type="submit">Update</Button>
                </form>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-8 text-center">
            <h2 className="text-xl font-bold">No messages</h2>
            <p className="mt-2 text-[#76513d]">New contact form submissions will appear here.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
