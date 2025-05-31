import { z } from 'zod';

export const userSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  position: z.string().min(2, 'Position must be at least 2 characters'),
  department: z.string().min(2, 'Department must be at least 2 characters'),
  salary: z.number().min(0, 'Salary must be a positive number'),
  hireDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  status: z.string().min(2, 'Status must be at least 2 characters'),
}); 