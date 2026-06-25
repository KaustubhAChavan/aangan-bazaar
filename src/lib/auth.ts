import { auth, currentUser } from "@clerk/nextjs/server";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

type ClerkRoleClaims = {
  metadata?: { role?: string };
  publicMetadata?: { role?: string };
  privateMetadata?: { role?: string };
  unsafeMetadata?: { role?: string };
};

const allowFrontendAdminRole = process.env.NODE_ENV !== "production";

function normalizeRole(role: unknown): UserRole {
  return String(role).toUpperCase() === "ADMIN" ? UserRole.ADMIN : UserRole.CUSTOMER;
}

export async function getCurrentUserRole() {
  const { sessionClaims, userId } = await auth();
  const claims = sessionClaims as ClerkRoleClaims | null;
  const claimRole =
    claims?.metadata?.role ??
      claims?.publicMetadata?.role ??
      claims?.privateMetadata?.role ??
      (allowFrontendAdminRole ? claims?.unsafeMetadata?.role : undefined);

  if (claimRole) {
    return normalizeRole(claimRole);
  }

  if (!userId) {
    return UserRole.CUSTOMER;
  }

  const user = await currentUser();
  return normalizeRole(
    user?.publicMetadata?.role ??
      user?.privateMetadata?.role ??
      (allowFrontendAdminRole ? user?.unsafeMetadata?.role : undefined),
  );
}

export async function isAdmin() {
  return (await getCurrentUserRole()) === UserRole.ADMIN;
}

export async function requireAdmin() {
  if (!(await isAdmin())) {
    redirect("/admin/unauthorized");
  }
}

export async function getCurrentUserProfile() {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  return prisma.userProfile.findUnique({
    where: { clerkUserId: userId },
  });
}

export async function getOrCreateUserProfile() {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  const user = await currentUser();
  if (!user) {
    return null;
  }

  const email =
    user.primaryEmailAddress?.emailAddress ??
    user.emailAddresses.at(0)?.emailAddress ??
    "";
  const phone = user.primaryPhoneNumber?.phoneNumber ?? null;
  const name =
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.username ||
    email;
  const role = await getCurrentUserRole();

  return prisma.userProfile.upsert({
    where: { clerkUserId: user.id },
    update: {
      email,
      name,
      phone,
      role,
    },
    create: {
      clerkUserId: user.id,
      email,
      name,
      phone,
      role,
    },
  });
}
