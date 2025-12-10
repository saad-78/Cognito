'use server'

import { db } from '@/db';
import { studySets, users } from '@/db/schema';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { eq } from 'drizzle-orm';

const CreateSetSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().optional(),
});

export async function createStudySet(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return { message: "Unauthorized" };
  }

  const validated = CreateSetSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
  });

  if (!validated.success) {
    return { message: "Invalid input" };
  }

  try {
    // 1. Determine the CORRECT User ID to use
    let targetUserId = session.user.id;

    // Check by ID first
    const existingUserById = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    if (!existingUserById) {
      // Check by Email
      const existingUserByEmail = await db.query.users.findFirst({
        where: eq(users.email, session.user.email),
      });

      if (existingUserByEmail) {
        // User exists but under a different ID (or we just missed the ID match)
        // USE THE EXISTING ID
        console.log("Found user by email. Switching ID from", session.user.id, "to", existingUserByEmail.id);
        targetUserId = existingUserByEmail.id;
      } else {
        // User truly doesn't exist. Create them.
        console.log("Creating new user...");
        await db.insert(users).values({
          id: session.user.id,
          email: session.user.email,
          name: session.user.name || "Anonymous",
          image: session.user.image,
        });
      }
    }

    // 2. Insert Study Set using the targetUserId
    const [newSet] = await db.insert(studySets).values({
      userId: targetUserId, // <--- USE THE RESOLVED ID
      title: validated.data.title,
      description: validated.data.description,
    }).returning();

    revalidatePath('/dashboard');
    return { message: "Success", newSetId: newSet.id };

  } catch (error) {
    console.error("DATABASE ERROR:", error); 
    return { message: "Database Error" };
  }
}

export async function deleteStudySet(id: string) {
  // ... keep existing delete logic
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  await db.delete(studySets).where(eq(studySets.id, id));
  revalidatePath('/dashboard');
}
