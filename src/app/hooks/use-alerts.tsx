"use client";

import { useEffect, useState } from "react";

export type Alert = {
  id: number;
  message: string;
  type: "success" | "error" | "info";
  showTimer?: boolean;
  removeAlert: () => void;
  ttl?: number;
  closeable?: boolean;
  toast?: boolean;
};

export type AlertOptions = Pick<
  Alert,
  "message" | "type" | "showTimer" | "ttl" | "closeable" | "toast"
>;

export type AddAlert = (alertOptions: AlertOptions) => void;

export default function useAlerts() {
  const [data, setData] = useState<Alert[]>([]);
  const [timeouts, setTimeouts] = useState<NodeJS.Timeout[]>([]);

  useEffect(() => {
    return () => {
      timeouts.forEach((to) => clearTimeout(to));
    };
  }, [timeouts]);

  const addAlert = (alertOptions: AlertOptions) => {
    const id = data.length + 1;

    let to: NodeJS.Timeout | null = null;
    if (alertOptions.ttl) {
      const to = setTimeout(() => removeAlert(id), alertOptions.ttl * 1000);
      setTimeouts([...timeouts, to]);
    }

    const newAlert: Alert = {
      id,
      showTimer: alertOptions.showTimer,
      message: alertOptions.message,
      type: alertOptions.type,
      removeAlert: () => {
        if (to) clearTimeout(to);
        removeAlert(id);
      },
      ttl: alertOptions.ttl,
      closeable:
        alertOptions.closeable === undefined ? true : alertOptions.closeable,
      toast: alertOptions.toast || false,
    };

    setData([...data, newAlert]);
  };

  const removeAlert = (id: number) => {
    setData(data.filter((alert) => alert.id !== id));
  };

  return { removeAlert, addAlert, alerts: data };
}
