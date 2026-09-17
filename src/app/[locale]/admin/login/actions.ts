"use server";

import { loginSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const locale = await getLocale();

  if (!email || !password) {
    return { error: 'Email dan password wajib diisi' };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      return { error: 'Kredensial tidak valid' };
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return { error: 'Kredensial tidak valid' };
    }
    
    await loginSession({ id: user.id, email: user.email, name: user.name || 'Admin' });
  } catch (error) {
    // Handle redirect properly since it throws an error in next.js
    if ((error as any).message === 'NEXT_REDIRECT') {
        throw error;
    }
    return { error: 'Terjadi kesalahan sistem' };
  }
  
  redirect(`/${locale}/admin/dashboard`);
}
