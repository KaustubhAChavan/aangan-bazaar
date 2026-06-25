import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/auth";
import { uploadProductImage } from "@/lib/cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Admin sign in is required." }, { status: 401 });
  }

  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Admin access is required." }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Image file is required." }, { status: 400 });
  }

  try {
    const upload = await uploadProductImage(file);
    return NextResponse.json({
      url: upload.secure_url,
      cloudinaryPublicId: upload.public_id,
      width: upload.width,
      height: upload.height,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed." },
      { status: 400 },
    );
  }
}
