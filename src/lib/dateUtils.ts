import { formatDistanceToNow, isPast, differenceInHours, format } from 'date-fns';

export function getCountdown(targetDate: string): string {
  const date = new Date(targetDate);
  if (isPast(date)) return 'Move date has passed';
  return formatDistanceToNow(date, { addSuffix: true });
}

export function getDeadlineColor(dueDate: string | null): string {
  if (!dueDate) return 'text-gray-500';
  const date = new Date(dueDate);
  if (isPast(date)) return 'text-red-600';
  const hoursUntil = differenceInHours(date, new Date());
  if (hoursUntil < 24) return 'text-red-500';
  if (hoursUntil < 72) return 'text-amber-500';
  return 'text-gray-500';
}

export function getDeadlineBgColor(dueDate: string | null): string {
  if (!dueDate) return 'bg-gray-100 text-gray-600';
  const date = new Date(dueDate);
  if (isPast(date)) return 'bg-red-100 text-red-700';
  const hoursUntil = differenceInHours(date, new Date());
  if (hoursUntil < 24) return 'bg-red-100 text-red-700';
  if (hoursUntil < 72) return 'bg-amber-100 text-amber-700';
  return 'bg-gray-100 text-gray-600';
}

export function formatDate(dateStr: string): string {
  return format(new Date(dateStr), 'MMM d, yyyy');
}

export function formatTime(timeStr: string): string {
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
}

export function isWithin48Hours(dueDate: string): boolean {
  const date = new Date(dueDate);
  const hoursUntil = differenceInHours(date, new Date());
  return hoursUntil >= 0 && hoursUntil <= 48;
}
