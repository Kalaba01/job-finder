import { io } from "/socket.io-client/socket.io.esm.min.js";
import { formatDistanceToNow } from "/date-fns/index.js";

document.addEventListener("DOMContentLoaded", async () => {
    // Initialize WebSocket connection
    const socket = io();

    const notificationsContainer = document.getElementById("notifications-container");
    const notificationBadge = document.getElementById("notification-count");

    let isPopupOpen = false;

    // Fetch notifications
    const fetchNotifications = async () => {
        try {
            const response = await fetch("/notifications");
            const notifications = await response.json();

            notificationsContainer.querySelectorAll(".notification-item").forEach((item) => item.remove());

            if (notifications.length > 0) {
                notifications.forEach((notification) => addNotificationToUI(notification));
                notificationsContainer.querySelector(".empty").style.display = "none";
            } else {
                notificationsContainer.querySelector(".empty").style.display = "block";
            }

            const unreadCount = notifications.filter((n) => !n.read).length;
            updateBadgeCount(unreadCount);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    fetchNotifications();

    // Event listener for notifications icon click
    document.getElementById("notifications-icon").addEventListener("click", async () => {
        notificationsContainer.classList.toggle("active");
        isPopupOpen = notificationsContainer.classList.contains("active");
    
        if (isPopupOpen) {
            await fetchNotifications();
        }
    });

    // Event listener for notifications icon click
    socket.emit("join-notifications");

    // Handle real-time new notifications
    socket.on("new-notification", (notification) => {
        console.log("New notification received:", notification);
        addNotificationToUI(notification, true);

        const currentCount = parseInt(notificationBadge.textContent || "0", 10);
        updateBadgeCount(currentCount + 1);
    });

    // Add a notification to the UI
    const addNotificationToUI = (notification, isNew = false) => {
        const newNotification = document.createElement("div");
        newNotification.classList.add("notification-item", notification.read ? "read" : "unread");
        newNotification.innerHTML = `
            <div class="message">${notification.message}</div>
            <div class="timestamp">${formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</div>
        `;

        newNotification.addEventListener("click", async () => {
            await markNotificationAsRead(notification.id, newNotification);
        });

        if (isNew) {
            notificationsContainer.prepend(newNotification);
        } else {
            notificationsContainer.appendChild(newNotification);
        }
    };

    // Update the badge count for unread notifications
    const updateBadgeCount = (count) => {
        const newCount = Math.max(count, 0);
        notificationBadge.textContent = newCount > 0 ? newCount : "";
        notificationBadge.style.display = newCount > 0 ? "inline" : "none";
    };    

    // Mark a notification as read
    const markNotificationAsRead = async (id, notificationElement) => {
        try {
            await fetch(`/notifications/${id}/mark-read`, { method: "PUT" });
            notificationElement.classList.remove("unread");
            notificationElement.classList.add("read");

            updateBadgeCount(-1);
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };
});
