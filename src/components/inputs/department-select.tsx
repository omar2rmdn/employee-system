"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";

interface Props {
  departments: string[];
  defaultValue?: string;
  disabled?: boolean;
  name?: string;
}

export function DepartmentSelect({
  departments,
  defaultValue = "",
  disabled = false,
  name = "department",
}: Props) {
  const normalizedDepartments = useMemo(
    () =>
      Array.from(
        new Set(
          departments
            .map((department) => department.trim())
            .filter(Boolean),
        ),
      ).sort((a, b) => a.localeCompare(b)),
    [departments],
  );

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(defaultValue);
  const rootRef = useRef<HTMLDivElement>(null);

  const availableDepartments = useMemo(() => {
    if (!selectedDepartment) {
      return normalizedDepartments;
    }

    return normalizedDepartments.includes(selectedDepartment)
      ? normalizedDepartments
      : [selectedDepartment, ...normalizedDepartments];
  }, [normalizedDepartments, selectedDepartment]);

  const filteredDepartments = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) {
      return availableDepartments;
    }

    return availableDepartments.filter((department) =>
      department.toLowerCase().includes(search),
    );
  }, [availableDepartments, query]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        rootRef.current &&
        !rootRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setQuery("");
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="relative" ref={rootRef}>
      <input type="hidden" name={name} value={selectedDepartment} />

      <button
        type="button"
        disabled={disabled}
        onClick={() =>
          setIsOpen((open) => {
            if (open) {
              setQuery("");
            }

            return !open;
          })
        }
        className="flex w-full items-center justify-between rounded border border-gray-300 bg-white p-2 text-left text-sm text-gray-700 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
      >
        <span
          className={selectedDepartment ? "truncate" : "truncate text-gray-400"}
        >
          {selectedDepartment || "Select department"}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-20 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="border-b border-gray-100 p-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search departments..."
                className="w-full rounded border border-gray-200 py-2 pl-9 pr-3 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="max-h-56 overflow-y-auto py-1">
            {filteredDepartments.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">
                No departments found.
              </div>
            ) : (
              filteredDepartments.map((department) => (
                <button
                  key={department}
                  type="button"
                  onClick={() => {
                    setSelectedDepartment(department);
                    setIsOpen(false);
                    setQuery("");
                  }}
                  className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                    selectedDepartment === department
                      ? "bg-blue-50 font-medium text-blue-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {department}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
