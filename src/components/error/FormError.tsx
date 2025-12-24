export default function FormError({ message }: { message?: string | undefined | null }) {
  if (!message) return null;
  return <p className="text-red-500 text-sm mt-1">{message}</p>;
}
