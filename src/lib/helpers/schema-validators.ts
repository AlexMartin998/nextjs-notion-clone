import { z } from 'zod';

const getFormSchema = () =>
  z.object({
    email: z.string().describe('Email').email({ message: 'Invalid Email' }),
    password: z.string().describe('Password').min(1, 'Password is required'),
  });

export const LoginSchema = getFormSchema();
