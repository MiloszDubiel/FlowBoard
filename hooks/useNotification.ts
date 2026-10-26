import { Notification } from "@/generated/prisma/browser";
import { getCurrentUserData } from "@/lib/auth/get-current-user";
import { getNotifications } from "@/lib/data/get-notifications";
import { useEffect, useState, useCallback } from "react";

export const useNotification = () => {
  const getNotification = async () => {
    const notifications = await getNotifications();
    setNotifications(notifications);
  };

  const refetch = async () => {
    const notifications = await getNotifications();
    setNotifications(notifications);
  };

  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    getNotification();
  }, []);

  return {
    notifications,
    refetch,
  };
};
