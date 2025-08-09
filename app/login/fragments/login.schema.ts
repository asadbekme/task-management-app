import { z } from "zod";

export const loginFormSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .max(25, "Username must be less than 25 characters"),
});

export type LoginFormType = z.infer<typeof loginFormSchema>;
