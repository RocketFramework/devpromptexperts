// components/ui/ActionCard.tsx
interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  buttonColor: string;
  status: "completed" | "current" | "pending";
  iconColor?: string;
  onButtonClick?: () => void;
}

export function ActionCard({
  icon,
  title,
  description,
  buttonText,
  buttonColor,
  status,
  iconColor = "text-blue-600",
  onButtonClick
}: ActionCardProps) {
  const statusBadge = {
    completed: { text: "Completed", color: "bg-green-100 text-green-800" },
    current: { text: "Next Step", color: "bg-blue-100 text-blue-800" },
    pending: { text: "Upcoming", color: "bg-slate-100 text-slate-800" }
  }[status];

  const isDisabled = status === "pending";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative">
      <div className="flex justify-between items-start mb-4">
        <div className={iconColor}>{icon}</div>
        <span className={`text-xs px-2 py-1 rounded-full ${statusBadge.color}`}>
          {statusBadge.text}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 mb-4 text-sm">{description}</p>
      <button
        className={`w-full ${buttonColor} text-white py-2 rounded-lg font-semibold transition-colors ${
          isDisabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
        }`}
        disabled={isDisabled}
        onClick={onButtonClick}
      >
        {buttonText}
      </button>
    </div>
  );
}