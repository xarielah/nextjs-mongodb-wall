"use client";

import { useState } from "react";

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

export default function useAlerts() {
  const [data, setData] = useState<Alert[]>([]);

  const addAlert = (
    alertOptions: Pick<
      Alert,
      "message" | "type" | "showTimer" | "ttl" | "closeable" | "toast"
    >
  ) => {
    const id = data.length + 1;

    let to: NodeJS.Timeout | null = null;
    if (alertOptions.ttl) {
      setTimeout(() => removeAlert(id), alertOptions.ttl * 1000);
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
