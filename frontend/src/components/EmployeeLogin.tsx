import * as React from "react";

import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function EmployeeLogin() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Employee/Manager Login</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Employee/Manager Login</DialogTitle>
          <DialogDescription>
            Enter your credentials here. Click enter to log in.
          </DialogDescription>
        </DialogHeader>
        <ProfileForm />
      </DialogContent>
    </Dialog>
  );
}

interface LoginForm {
  username: string;
  password: string;
}

export function ProfileForm() {
  const [error, setError] = useState<string | null>(null);

  const formSchema = z.object({
    username: z.string().nonempty(),
    password: z.string().nonempty(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const check = await CheckLogin(values as LoginForm);
    if (check == 1) {
      //Employee
      window.location.href = "/kiosk";
    } else if (check == 2) {
      //Manager
      window.location.href = "/kiosk";
    } else {
      //Invalid
      setError("Invalid username or password. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="your_name" {...field} />
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
                <Input placeholder="your_password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>} {/* Display error message */}

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

async function CheckLogin(values: LoginForm): Promise<number> {
  const res = await fetch(
    `http://localhost:3000/logins/${values.username}/${values.password}`
  );
  const json = await res.json();

  console.log(JSON.stringify(json));
  if (json.perm !== undefined) {
    return json.perm;
  }

  return 0;
}

export default EmployeeLogin;
