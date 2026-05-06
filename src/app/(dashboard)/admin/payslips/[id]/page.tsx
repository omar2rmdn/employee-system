import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/auth";
import { PayslipDetails } from "@/components/payslips/payslip-details";
import { connectDB } from "@/lib/db";
import { Payslip } from "@/models/payslip";

export const metadata: Metadata = {
  title: "Print Payslips",
};

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function PrintPayslips({ params }: Props) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/employee/payslips");
  }

  await connectDB();

  const { id } = await params;

  const payslip = await Payslip.findById(id)
    .populate("employee", "firstName lastName email department position")
    .lean();

  if (!payslip) {
    notFound();
  }

  return (
    <PayslipDetails
      payslip={JSON.parse(JSON.stringify(payslip))}
      backHref="/admin/payslips"
    />
  );
}
