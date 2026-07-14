import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['user', 'admin']).default('user'),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  phone: z.string().optional(),
  skills: z.array(z.string()).optional(),
  education: z.array(
    z.object({
      degree: z.string().min(1, 'Degree is required'),
      school: z.string().min(1, 'School is required'),
      startYear: z.string().optional(),
      endYear: z.string().optional(),
    })
  ).optional(),
  experience: z.array(
    z.object({
      title: z.string().min(1, 'Title is required'),
      company: z.string().min(1, 'Company is required'),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      description: z.string().optional(),
    })
  ).optional(),
});

export const jobSchema = z.object({
  title: z.string().min(2, 'Job title is required'),
  company: z.string().min(2, 'Company name is required'),
  location: z.string().min(2, 'Location is required'),
  salaryMin: z.number().nonnegative('Minimum salary must be positive'),
  salaryMax: z.number().nonnegative('Maximum salary must be positive'),
  experience: z.string().min(1, 'Experience level is required'),
  category: z.string().min(1, 'Category is required'),
  jobType: z.enum(['Full Time', 'Part Time', 'Contract', 'Internship', 'Remote']),
  vacancy: z.number().int().positive('Vacancy count must be positive'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  requirements: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  deadline: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid deadline date format',
  }),
});
