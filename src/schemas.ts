import { z } from 'zod';

export const personInputSchema = z
  .object({
    firstName: z.string().min(1),
    middleNames: z.array(z.string().min(1)).default([]),
    lastName: z.string().min(1),
    dobYear: z.number().int().min(1900).max(2100),
    dobMonth: z.number().int().min(1).max(12),
    dobDay: z.number().int().min(1).max(31),
    nationalId: z.string().min(3),
  })
  .superRefine((val, ctx) => {
    const { dobYear, dobMonth, dobDay } = val;
    const daysInMonth = new Date(dobYear, dobMonth, 0).getDate();
    if (dobDay > daysInMonth) {
      ctx.addIssue({
        code: 'custom',
        path: ['dobDay'],
        message: `day must be 1..${daysInMonth} for ${dobMonth}/${dobYear}`,
      });
    }
  });

export type PersonInput = z.infer<typeof personInputSchema>;

export const personOutputSchema = z.object({
  id: z.number().int().positive(),
  firstName: z.string(),
  middleNames: z.array(z.string()),
  lastName: z.string(),
  dobYear: z.number().int(),
  dobMonth: z.number().int(),
  dobDay: z.number().int(),
  nationalId: z.string(),
});

export type Person = z.infer<typeof personOutputSchema>;
