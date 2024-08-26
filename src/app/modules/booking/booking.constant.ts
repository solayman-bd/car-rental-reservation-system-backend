export const BOOKING_STATUS = {
  pending: 'pending',
  approved: 'approved',
  cancelled: 'cancelled',
} as const;

export type TBookingStatus =
  (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];
