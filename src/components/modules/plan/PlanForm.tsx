"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPlanSchema, PlanFormType } from "@/zod/plan/plan.validator";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export default function PlanForm({
  defaultValues,
  onSubmit,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValues?: any;
  onSubmit: (d: PlanFormType) => Promise<void>;
}) {
  const form = useForm<PlanFormType>({
    resolver: zodResolver(createPlanSchema),
    // Fix: Provide explicit empty strings to prevent "uncontrolled to controlled" error
    defaultValues: {
      title: "",
      destination: "",
      startDate: "",
      endDate: "",
      description: "",
      travelType: "SOLO",
      visibility: "PUBLIC",
      budgetMin: "", // Use empty string initially
      budgetMax: "", // Use empty string initially
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 bg-white p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter plan title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destination</FormLabel>
                <FormControl>
                  <Input placeholder="Where to?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Short description about this plan..."
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="travelType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Travel Type (Optional)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || "SOLO"} // Controlled value
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="SOLO">Solo</SelectItem>
                    <SelectItem value="FAMILY">Family</SelectItem>
                    <SelectItem value="FRIENDS">Friends</SelectItem>
                    <SelectItem value="COUPLE">Couple</SelectItem>
                    <SelectItem value="GROUP">Group</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="visibility"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Visibility (Optional)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || "PUBLIC"} // Controlled value
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PUBLIC">Public</SelectItem>
                    <SelectItem value="PRIVATE">Private</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="budgetMin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget Min (BDT)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    // Fix: If your Zod schema expects a string, remove the Number() cast.
                    // If Zod expects a number, use z.coerce.number() in your schema instead.
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="budgetMax"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget Max (BDT)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-between gap-4 pt-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Tip:</span> Keep dates
            and budget realistic.
          </p>

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="min-w-[120px]"
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Plan"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}