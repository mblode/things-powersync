import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type FormValues = z.infer<typeof formSchema>;

export type LoginAction = {
  title: string;
  onClick: (values?: FormValues) => void;
};

export type Props = {
  title: string;
  secondaryActions: LoginAction[];
  onSubmit: (values: FormValues) => Promise<void>;
  submitTitle: string;
};

export const LoginDetails = (props: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await props.onSubmit(values);
    } catch (ex: any) {
      console.error(ex);
      form.setError("password", { message: ex.message });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-6 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">{props.title}</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              {props.secondaryActions.map((action) => (
                <Button
                  key={action.title}
                  variant="ghost"
                  onClick={() => action.onClick(form.getValues())}
                  disabled={form.formState.isSubmitting}
                >
                  {action.title}
                </Button>
              ))}
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {props.submitTitle}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
