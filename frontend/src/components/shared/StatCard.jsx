import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function StatCard({ icon: Icon, label, value, helper, tone = "blue" }) {
  const tones = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600"
  };

  return (
    <Card className="rounded-2xl p-5">
      <div className="flex items-start justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tones[tone] || tones.blue}`}>
          <Icon className="h-5 w-5" />
        </div>
        
      </div>
      <div className="mt-5 text-3xl font-medium">{value}</div>
      <div className="mt-1 text-sm font-medium">{label}</div>
      {helper && <div className="mt-1 text-xs text-slate-400">{helper}</div>}
    </Card>
  );
}
