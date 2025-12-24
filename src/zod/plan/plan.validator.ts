import { z } from "zod";

export const createPlanSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, "Title must be at least 2 characters")
      .max(100, "Title cannot exceed 100 characters")
      .optional(),

    destination: z
      .string()
      .trim()
      .min(2, "Destination must be at least 2 characters"),

    startDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid start date format",
      }),

    endDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid end date format",
      }),

     budgetMin: z
    .string()
    .refine((v) => !isNaN(Number(v)), "Minimum budget must be a valid number")
    .refine((v) => v === "" || Number(v) > 0, {
    message: "Minimum budget must be greater than 0",
  }),

  budgetMax: z
    .string()
    .refine((v) => !isNaN(Number(v)), "Maximum budget must be a valid number")
    .refine((v) => v === "" || Number(v) > 0, {
    message: "Maximum budget must be greater than 0",
  }),
    
      
      

    travelType: z.enum(["SOLO", "FAMILY", "FRIENDS", "COUPLE", "GROUP"], {
      message: "Invalid travel type",
    }),

    description: z
      .string()
      .trim()
      .max(500, "Description cannot exceed 500 characters")
      .optional(),

    visibility: z.enum(["PUBLIC", "PRIVATE"]).optional(),
  })
 .refine((data) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(data.startDate);
    start.setHours(0, 0, 0, 0);

    return start >= today;
  }, {
    message: "Start date cannot be in the past",
    path: ["startDate"],
  })

  .refine((data) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return end >= start;
  }, {
    message: "End date must be after or equal to start date",
    path: ["endDate"],
  })

  .refine((data) => {
    if (data.budgetMin != null && data.budgetMax != null) {
      return data.budgetMin <= data.budgetMax;
    }
    return true;
  }, {
    message: "Minimum budget cannot be greater than maximum budget",
    path: ["budgetMin"],
  });
 
  export const updatePlanSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, "Title must be at least 2 characters")
      .max(100, "Title cannot exceed 100 characters")
      .optional(),

    destination: z
      .string()
      .trim()
      .min(2, "Destination must be at least 2 characters"),

    startDate: z.string().refine((v) => !isNaN(Date.parse(v)), {
      message: "Invalid start date",
    }),

    endDate: z.string().refine((v) => !isNaN(Date.parse(v)), {
      message: "Invalid end date",
    }),

     budgetMin: z
    .string()
    .refine((v) => !isNaN(Number(v)), "Minimum budget must be a valid number")
    .refine((v) => v === "" || Number(v) > 0, {
    message: "Minimum budget must be greater than 0",
  }),

  budgetMax: z
    .string()
    .refine((v) => !isNaN(Number(v)), "Maximum budget must be a valid number")
    .refine((v) => v === "" || Number(v) > 0, {
    message: "Maximum budget must be greater than 0",
  }),

    travelType: z.enum(["SOLO", "FAMILY", "FRIENDS", "COUPLE", "GROUP"]),

    description: z.string().max(500).optional(),

    visibility: z.enum(["PUBLIC", "PRIVATE"]),
  })
  .refine(
    (data) =>
      data.budgetMin === "" ||
      data.budgetMax === "" ||
      Number(data.budgetMin) <= Number(data.budgetMax),
    {
      message: "Minimum budget cannot be greater than maximum budget",
      path: ["budgetMin"],
    }
  )
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end >= start;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );
export type PlanFormType = z.infer<typeof createPlanSchema>;
export type UpdatePlanFormType = z.infer<typeof updatePlanSchema>;
