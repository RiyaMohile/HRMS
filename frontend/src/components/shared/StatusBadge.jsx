import { Badge } from "@/components/ui/badge";

export default function StatusBadge({ status }) {
  const map = {
    Present: "success",
    Approved: "success",
    Pending: "warning",
    Rejected: "destructive",
    Absent: "destructive",
    "Not Checked In": "secondary"
  };

  return <Badge variant={map[status] || "outline"}>{status}</Badge>;
}
