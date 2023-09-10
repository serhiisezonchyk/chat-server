import { z } from 'zod';
export const registerValidation = z
  .object({
    email: z
      .string({ required_error: 'Email is required.' })
      .email('Invalid email.'),
    login: z.string().min(6, 'Login is shorter of 6 s.'),
    password: z.string().min(6, 'Password is shorter of 6 s.'),
    check_password: z.string(),
    name: z.string().min(2, ' '),
  })
  .refine((data) => data.password === data.check_password, {
    path: ['check_password'],
    message: 'Passwords are diff',
  });
