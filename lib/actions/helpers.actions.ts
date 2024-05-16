'use server';
import { revalidatePath } from 'next/cache';

export async function revalidatePathFromServer(path: string) {
  revalidatePath(path);
}
