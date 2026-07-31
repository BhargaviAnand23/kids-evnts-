'use client';

export function FormError({ message }: { message: string | null }) {
  if (
    !message ||
    typeof message !== 'string' ||
    message.trim() === '' ||
    message.trim() === '{}' ||
    message.trim() === '[]' ||
    message.trim() === '[object Object]'
  ) {
    return null;
  }

  return (
    <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-2">
      <span>{message}</span>
    </div>
  );
}
