"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import { Department } from "@/models/department";
import { User } from "@/models/user";

export async function addDepartment(prevState: unknown, formData: FormData) {
  try {
    await connectDB();

    const name = (formData.get("name") as string)?.trim();
    const description = (formData.get("description") as string)?.trim();

    if (!name) {
      return { error: "Department name is required." };
    }

    const existingDepartment = await Department.findOne({
      name: { $regex: `^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" },
    });

    if (existingDepartment) {
      return { error: "Department already exists." };
    }

    await Department.create({
      name,
      description: description || "",
    });

    revalidatePath("/admin/departments");
    revalidatePath("/admin/employees");
    return { success: true };
  } catch (error: unknown) {
    console.error("Add department error:", error);
    return {
      error:
        error instanceof Error ? error.message : "Failed to add department.",
    };
  }
}

export async function editDepartment(prevState: unknown, formData: FormData) {
  try {
    await connectDB();

    const id = formData.get("id") as string;
    const name = (formData.get("name") as string)?.trim();
    const description = (formData.get("description") as string)?.trim();

    if (!id) {
      return { error: "Department ID is required." };
    }

    if (!name) {
      return { error: "Department name is required." };
    }

    const department = await Department.findById(id);
    if (!department) {
      return { error: "Department not found." };
    }

    const existingDepartment = await Department.findOne({
      _id: { $ne: id },
      name: {
        $regex: `^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
        $options: "i",
      },
    });

    if (existingDepartment) {
      return { error: "Department already exists." };
    }

    const previousName = department.name;

    department.name = name;
    department.description = description || "";
    await department.save();

    if (previousName !== name) {
      await User.updateMany(
        {
          department: previousName,
          role: "EMPLOYEE",
          isDeleted: false,
        },
        {
          $set: {
            department: name,
          },
        },
      );
    }

    revalidatePath("/admin/departments");
    revalidatePath("/admin/employees");
    return { success: true };
  } catch (error: unknown) {
    console.error("Edit department error:", error);
    return {
      error:
        error instanceof Error ? error.message : "Failed to update department.",
    };
  }
}

export async function deleteDepartment(prevState: unknown, formData: FormData) {
  try {
    await connectDB();

    const id = formData.get("id") as string;

    if (!id) {
      return { error: "Department ID is required." };
    }

    const department = await Department.findById(id);
    if (!department) {
      return { error: "Department not found." };
    }

    const employeesUsingDepartment = await User.countDocuments({
      department: department.name,
      role: "EMPLOYEE",
      isDeleted: false,
    });

    if (employeesUsingDepartment > 0) {
      return {
        error:
          "Cannot delete a department that is assigned to active employees.",
      };
    }

    await Department.findByIdAndDelete(id);

    revalidatePath("/admin/departments");
    revalidatePath("/admin/employees");
    return { success: true };
  } catch (error: unknown) {
    console.error("Delete department error:", error);
    return {
      error:
        error instanceof Error ? error.message : "Failed to delete department.",
    };
  }
}
