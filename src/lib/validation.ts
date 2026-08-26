import { z } from "zod";

const INDIAN_MOBILE = /^[6-9]\d{9}$/;

export const customerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: "Please enter your full name." })
    .max(80, { message: "Name must be under 80 characters." }),
  mobile: z
    .string()
    .trim()
    .transform((value) => value.replace(/[\s-]/g, "").replace(/^(\+?91)/, ""))
    .refine((value) => INDIAN_MOBILE.test(value), {
      message: "Enter a valid 10-digit Indian mobile number.",
    }),
  address: z
    .string()
    .trim()
    .min(8, { message: "Please enter your delivery address." })
    .max(400, { message: "Address must be under 400 characters." }),
  city: z
    .string()
    .trim()
    .min(2, { message: "Please enter your city." })
    .max(60, { message: "City must be under 60 characters." }),
  state: z.string().trim().max(60, { message: "State must be under 60 characters." }),
  pincode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, { message: "Enter a valid 6-digit pincode." }),
  deliveryTime: z.string().trim().max(80, { message: "Keep this under 80 characters." }),
  notes: z.string().trim().max(600, { message: "Order note must be under 600 characters." }),
});

export type CustomerInput = z.input<typeof customerSchema>;
