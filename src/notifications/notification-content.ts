import { NotificationType } from './notification-type.enum';

export const NotificationContent: { [ key in keyof typeof NotificationType ]?: string } = {
    LIKE: " liked your tweet.",
    FOLLOW: " followed you.",
};
