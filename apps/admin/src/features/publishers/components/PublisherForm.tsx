"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { createPublisherAction, updatePublisherAction } from "../actions";
import type { PublisherWithAuth } from "../types";

interface PublisherFormProps {
  initialData?: PublisherWithAuth;
}

export function PublisherForm({ initialData }: PublisherFormProps) {
  const router = useRouter();
  const toast = useToast();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  
  const isEditing = !!initialData;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    
    if (!isEditing && !password) {
      setError("Password is required for new publishers");
      return;
    }

    startTransition(async () => {
      let result;
      if (isEditing) {
        result = await updatePublisherAction(initialData.id, formData);
      } else {
        result = await createPublisherAction(formData);
      }

      if (result.success) {
        toast.success(isEditing ? "Publisher updated." : "Publisher created.");
        router.push("/publishers");
        router.refresh();
      } else {
        const msg = result.error || "Something went wrong";
        setError(msg);
        toast.error(msg);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-6">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            name="full_name"
            type="text"
            required
            defaultValue={initialData?.full_name}
            placeholder="John Doe"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#E86149] focus:ring-[#E86149] text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            name="email"
            type="email"
            required
            defaultValue={initialData?.email}
            placeholder="john@example.com"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#E86149] focus:ring-[#E86149] text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password {isEditing ? "(Leave blank to keep unchanged)" : <span className="text-red-500">*</span>}
          </label>
          <input
            name="password"
            type="password"
            placeholder={isEditing ? "Enter new password to reset" : "Enter a secure password"}
            minLength={6}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#E86149] focus:ring-[#E86149] text-sm"
          />
        </div>

        <div className="flex items-center pt-2">
          <input
            id="is_active"
            name="is_active"
            type="checkbox"
            value="true"
            defaultChecked={initialData ? initialData.is_active : true}
            className="h-4 w-4 rounded border-gray-300 text-[#E86149] focus:ring-[#E86149]"
          />
          <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900 font-medium">
            Account Active
          </label>
        </div>
        <p className="text-xs text-gray-500 pl-6">
          Uncheck to instantly block this publisher from logging in or modifying content.
        </p>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button 
          type="button" 
          variant="secondary" 
          onClick={() => router.push("/publishers")}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isPending}
        >
          {isPending ? "Saving..." : isEditing ? "Save Changes" : "Create Publisher"}
        </Button>
      </div>
    </form>
  );
}
