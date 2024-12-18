"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const formSchema = z.object({
  customerId: z.string(),
  provider: z.string(),
})

interface CreditCheckDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type Customer = {
  id: string;
  contactName: string;
  businessName?: string; // Optional
  email?: string; // Optional
  phone?: string; // Optional
  address?: string; // Optional
};

export function CreditCheckDialog({ open, onOpenChange }: CreditCheckDialogProps) {
  const[customers , setCusstomers] = useState<Customer[]>([])
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerId: "",
      provider: "EQUIFAX",
    },
  })

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('/api/customers');
        if(!response.ok){
          throw new Error("an error occured while fetching customers");
        }
        const body = await response.json();
        setCusstomers(body);
      } catch(error){
        console.error("an error occured while getting the customers" , error);
      }
    }
    fetchCustomers();
  },[]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // TODO: Implement credit check
      console.log(values)
      onOpenChange(false)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Credit Check</DialogTitle>
          <DialogDescription>
            Request a new credit check for a customer.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {customers.length > 0 ? (
                        customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.contactName}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem disabled value="">
                          No customers available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credit Provider</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="EQUIFAX">Equifax</SelectItem>
                      <SelectItem value="EXPERIAN">Experian</SelectItem>
                      <SelectItem value="ILLION">Illion</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Request Check</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}