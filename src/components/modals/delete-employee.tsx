"use client";

import { useActionState, useEffect } from "react";
import { IUser } from "@/models/user";
import { deleteEmployee } from "@/actions/employee";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  employee: IUser | null;
}

export function DeleteEmployeeModal({ isOpen, onClose, employee }: Props) {
  const [state, formAction, isPending] = useActionState(
    deleteEmployee,
    undefined,
  );

  useEffect(() => {
    if (state?.success) {
      onClose();
    }
  }, [state?.success, onClose]);

  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 m-4">
        <h2 className="text-xl font-semibold mb-2 text-red-600">
          Delete Employee
        </h2>

        <form action={formAction}>
          <input type="hidden" name="id" value={employee._id.toString()} />

          {state?.error && (
            <div className="bg-red-100 text-red-600 p-3 rounded text-sm mb-4 text-center">
              {state.error as string}
            </div>
          )}

          <p className="text-sm text-gray-600 mb-6">
            Are you sure you want to delete{" "}
            <strong className="font-semibold text-gray-900">
              {employee.firstName} {employee.lastName}
            </strong>
            ? This action will set their status to terminated.
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
