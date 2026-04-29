"use client";

import { useActionState, useEffect, useState } from "react";
import {
  addDepartment,
  deleteDepartment,
  editDepartment,
} from "@/actions/department";

interface DepartmentItem {
  _id: string;
  name: string;
  description?: string;
}

interface Props {
  departments: DepartmentItem[];
}

const initialState = undefined;

export function DepartmentManager({ departments }: Props) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] =
    useState<DepartmentItem | null>(null);
  const [addState, addAction, isAdding] = useActionState(
    addDepartment,
    initialState,
  );
  const [editState, editAction, isEditing] = useActionState(
    editDepartment,
    initialState,
  );
  const [deleteState, deleteAction, isDeleting] = useActionState(
    deleteDepartment,
    initialState,
  );

  useEffect(() => {
    const form = document.getElementById(
      "department-create-form",
    ) as HTMLFormElement | null;

    if (addState?.success && form) {
      const timeoutId = window.setTimeout(() => {
        form.reset();
        setIsAddModalOpen(false);
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }
  }, [addState]);

  useEffect(() => {
    const form = document.getElementById(
      "department-edit-form",
    ) as HTMLFormElement | null;

    if (editState?.success && form) {
      const timeoutId = window.setTimeout(() => {
        form.reset();
        setEditingDepartment(null);
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }
  }, [editState]);

  return (
    <>
      <div className="mb-6 flex items-center justify-end">
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Add Department
        </button>
      </div>

      <div className="grid gap-6">
      <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Departments
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              These entries feed the employee department dropdown.
            </p>
          </div>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
            {departments.length}
          </span>
        </div>

        {deleteState?.error && (
          <div className="mt-4 rounded bg-red-100 p-3 text-sm text-red-600">
            {deleteState.error as string}
          </div>
        )}

        <div className="mt-6 space-y-3">
          {departments.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
              No departments yet.
            </div>
          ) : (
            departments.map((department) => (
              <div
                key={department._id}
                className="flex items-start justify-between gap-4 rounded-lg border border-gray-100 px-4 py-3"
              >
                <div>
                  <h3 className="font-medium text-gray-900">
                    {department.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {department.description || "No description provided."}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingDepartment(department)}
                    className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
                  >
                    Edit
                  </button>

                  <form action={deleteAction}>
                    <input type="hidden" name="id" value={department._id} />
                    <button
                      type="submit"
                      disabled={isDeleting}
                      className="text-sm font-medium text-red-600 transition-colors hover:text-red-700 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="m-4 w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              Add Department
            </h2>
            <p className="mb-6 text-sm text-gray-500">
              Create a department once and reuse it across employee forms.
            </p>

            <form
              id="department-create-form"
              action={addAction}
              className="space-y-4"
            >
              {addState?.error && (
                <div className="rounded bg-red-100 p-3 text-sm text-red-600">
                  {addState.error as string}
                </div>
              )}

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  disabled={isAdding}
                  className="w-full rounded border border-gray-300 p-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  disabled={isAdding}
                  className="w-full rounded border border-gray-300 p-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={isAdding}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdding}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                >
                  {isAdding ? "Saving..." : "Create Department"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingDepartment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="m-4 w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              Edit Department
            </h2>
            <p className="mb-6 text-sm text-gray-500">
              Updating the name also updates employee records using it.
            </p>

            <form
              id="department-edit-form"
              action={editAction}
              className="space-y-4"
            >
              <input type="hidden" name="id" value={editingDepartment._id} />

              {editState?.error && (
                <div className="rounded bg-red-100 p-3 text-sm text-red-600">
                  {editState.error as string}
                </div>
              )}

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingDepartment.name}
                  disabled={isEditing}
                  className="w-full rounded border border-gray-300 p-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  defaultValue={editingDepartment.description || ""}
                  disabled={isEditing}
                  className="w-full rounded border border-gray-300 p-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingDepartment(null)}
                  disabled={isEditing}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEditing}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                >
                  {isEditing ? "Saving..." : "Update Department"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
