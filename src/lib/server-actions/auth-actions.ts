'use server'; // explicit 'cause this file is imported by 'use client'

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { LoginSchema } from '../helpers';

export async function actionLoginUser({
  email,
  password,
}: z.infer<typeof LoginSchema>) {
  const supabase = createRouteHandlerClient({ cookies });

  const response = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return response;
}
