"use server";

import { User } from "@/models/user";
import { connectDB } from "@/lib/db";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";
import { Department } from "@/models/department";

export async function addEmployee(prevState: unknown, formData: FormData) {
  try {
    await connectDB();

    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const department = formData.get("department") as string;
    const position = formData.get("position") as string;
    const phone = formData.get("phone") as string;
    const basicSalary = Number(formData.get("basicSalary"));
    const allowances = Number(formData.get("allowances"));
    const deductions = Number(formData.get("deductions"));
    const employmentStatus = formData.get("employmentStatus") as string;
    const password = formData.get("password") as string;

    if (!email || !firstName || !lastName || !password) {
      return { error: "Please fill all required fields." };
    }

    if (!department) {
      return { error: "Please select a department." };
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: "User with this email already exists." };
    }

    const existingDepartment = await Department.findOne({
      name: department,
      isActive: true,
    });

    if (!existingDepartment) {
      return { error: "Selected department does not exist." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      department,
      position: position || "Employee",
      phone: phone || "",
      basicSalary: basicSalary || 0,
      allowances: allowances || 0,
      deductions: deductions || 0,
      employmentStatus: employmentStatus || "ACTIVE",
      password: hashedPassword,
      role: "EMPLOYEE",
      joinDate: new Date(),
    });

    await newUser.save();
    revalidatePath("/admin/employees");
    return { success: true };
  } catch (error: unknown) {
    console.error("Add employee error:", error);
    return { error: error instanceof Error ? error.message : "Failed to add employee." };
  }
}

export async function editEmployee(prevState: unknown, formData: FormData) {
  try {
    await connectDB();

    const id = formData.get("id") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const department = formData.get("department") as string;
    const position = formData.get("position") as string;
    const phone = formData.get("phone") as string;
    const basicSalary = Number(formData.get("basicSalary"));
    const employmentStatus = formData.get("employmentStatus") as string;

    if (!id) {
      return { error: "Employee ID is required." };
    }

    const user = await User.findById(id);
    if (!user) {
      return { error: "Employee not found." };
    }

    if (department) {
      const existingDepartment = await Department.findOne({
        name: department,
        isActive: true,
      });

      if (!existingDepartment) {
        return { error: "Selected department does not exist." };
      }
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return { error: "Email is already taken by another employee." };
      }
      user.email = email;
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (department) user.department = department;
    if (position) user.position = position;
    if (phone) user.phone = phone;
    if (!isNaN(basicSalary)) user.basicSalary = basicSalary;
    if (employmentStatus) user.employmentStatus = employmentStatus;

    await user.save();
    revalidatePath("/admin/employees");
    return { success: true };
  } catch (error: unknown) {
    console.error("Edit employee error:", error);
    return { error: error instanceof Error ? error.message : "Failed to update employee." };
  }
}

export async function deleteEmployee(prevState: unknown, formData: FormData) {
  try {
    await connectDB();

    const id = formData.get("id") as string;

    if (!id) {
      return { error: "Employee ID is required." };
    }

    const user = await User.findById(id);
    if (!user) {
      return { error: "Employee not found." };
    }

    // Soft delete
    user.isDeleted = true;
    user.employmentStatus = "TERMINATED";
    await user.save();

    revalidatePath("/admin/employees");
    return { success: true };
  } catch (error: unknown) {
    console.error("Delete employee error:", error);
    return { error: error instanceof Error ? error.message : "Failed to delete employee." };
  }
}
