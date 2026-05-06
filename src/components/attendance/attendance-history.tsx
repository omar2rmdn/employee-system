interface AttendanceRecord {
  _id: string;
  date: string;
  checkIn: string;
  checkOut: string;
  dayType: "" | "FULL" | "HALF";
  status: "PRESENT" | "ABSENT";
}

interface AttendanceHistoryProps {
  records: AttendanceRecord[];
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function AttendanceHistory({ records }: AttendanceHistoryProps) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Attendance History</h2>
          <p className="mt-1 text-sm text-gray-500">
            Check-in is created from the home page. Check-out and day type are finalized when leave is approved.
          </p>
        </div>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
          {records.length} records
        </span>
      </div>

      {records.length === 0 ? (
        <div className="px-6 py-12 text-center text-sm text-gray-500">
          No attendance records yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Check In
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Check Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Day Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.map((record) => (
                <tr key={record._id} className="text-sm text-gray-700">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {formatDate(record.date)}
                  </td>
                  <td className="px-6 py-4">{record.checkIn || "-"}</td>
                  <td className="px-6 py-4">{record.checkOut || "-"}</td>
                  <td className="px-6 py-4">
                    {record.dayType === "FULL"
                      ? "Full Day"
                      : record.dayType === "HALF"
                        ? "Half Day"
                        : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        record.status === "PRESENT"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {record.status === "PRESENT" ? "Present" : "Absent"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
