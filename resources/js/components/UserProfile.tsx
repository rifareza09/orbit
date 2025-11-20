import { usePage } from "@inertiajs/react";
import { UserCircle2 } from "lucide-react";

interface AuthUser {
  name: string;
  role?: string;
}

interface PageProps {
  auth?: {
    user?: AuthUser | null;
  };
  [key: string]: any; // ⬅ wajib untuk Inertia PageProps
}

export default function UserProfile() {
  const { auth } = usePage<PageProps>().props;
  const user = auth?.user;

  return (
    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition">
      <div className="text-right">
        <p className="font-medium text-[#0B132B] leading-tight">
          {user?.name ?? "User"}
        </p>
        <p className="text-sm text-gray-500 leading-tight">
          {user?.role?.toUpperCase() ?? "ROLE"}
        </p>
      </div>

      <UserCircle2 size={40} className="text-[#0B132B]" />
    </div>
  );
}
