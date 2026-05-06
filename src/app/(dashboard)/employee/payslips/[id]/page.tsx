import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/auth";
import { PayslipDetails } from "@/components/payslips/payslip-details";
import { connectDB } from "@/lib/db";
import { Payslip } from "@/models/payslip";

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

  if (user.role !== "EMPLOYEE") {
    redirect("/admin/payslips");
  }

  await connectDB();

  const { id } = await params;

  const payslip = await Payslip.findOne({
    _id: id,
    employee: user._id,
  })
    .populate("employee", "firstName lastName email department position")
    .lean();

  if (!payslip) {
    notFound();
  }

  return (
    <PayslipDetails
      payslip={JSON.parse(JSON.stringify(payslip))}
      backHref="/employee/payslips"
    />
  );
}
