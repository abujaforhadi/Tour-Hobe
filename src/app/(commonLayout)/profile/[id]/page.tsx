
import Image from "next/image";
import { notFound } from "next/navigation";

type Props = { params: { id: string } };

export default async function ProfilePage({ params }: Props) {
    const { id } =await params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000"}/user/${id}`, { next: { revalidate: 30 }});
  if (!res.ok) return notFound();
  const j = await res.json();
  console.log(j,"USer");
  const user = j.user;

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex items-center gap-4">
        <Image
        width={80} height={80} src={user.profileImage || "https://i.ibb.co.com/jvLMWbX0/image.png"} className="w-20 h-20 rounded-full object-cover" alt="avatar" />
        <div>
          <h2 className="text-xl font-semibold">{user.fullName || user.email}</h2>
          <div className="text-sm text-gray-500">{user.bio}</div>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold">Visited Countries</h3>
        <p className="text-sm">{(user.visitedCountries || []).join(", ")}</p>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold">Travel Interests</h3>
        <p className="text-sm">{(user.travelInterests || []).join(", ")}</p>
      </div>
    </div>
  );
}
