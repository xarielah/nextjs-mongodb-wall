import { Alert } from "@/app/hooks/use-alerts";
import { IoMdClose } from "react-icons/io";

interface IAlertComponent {
  alerts: Alert[];
}

export default function AlertComponent({ alerts }: IAlertComponent) {
  return (
    <div id="alert-component">
      <div className="space-y-2">
        {alerts.map((alert) => (
          <SingleAlert key={alert.id} alert={alert} />
        ))}
      </div>
    </div>
  );
}

function SingleAlert({ alert }: { alert: Alert }) {
  const getColor = (type: Alert["type"]) => {
    if (type === "success") return "bg-green-500/20";
    if (type === "info") return "bg-blue-500/20";
    if (type === "error") return "bg-red-500/20";
    return "bg-blue-500";
  };

  const className = alert.toast
    ? "fixed md:top-4 top-0 bottom-4 md:bottom-0 left-1/2 -translate-x-1/2 "
    : "";

  return (
    <article className={className}>
      <div className={getColor(alert.type) + " min-h-2"}></div>
      <p className="bg-zinc-800/70 px-4 py-2 text-zinc-300 relative">
        {alert.message}{" "}
        {alert.closeable ? (
          <IoMdClose
            className="absolute top-2 right-2"
            role="button"
            onClick={alert.removeAlert}
          />
        ) : (
          ""
        )}
      </p>
    </article>
  );
}
