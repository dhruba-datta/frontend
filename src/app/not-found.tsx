import Link from "next/link";
import { MoveLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center text-center px-4">
      <div className="relative mb-8">
        <h1 className="text-[12rem] font-black leading-none select-none text-gray-200">
          404
        </h1>
        <h2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-black whitespace-nowrap tracking-tight text-[#0F172A]">
          Page Not Found
        </h2>
      </div>
      
      <p className="max-w-md mx-auto mb-10 font-medium text-lg text-[#64748B]">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>

      <Link 
        href="/jobs"
        className="group flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all duration-300 border shadow-sm bg-white border-gray-200 text-[#0F172A] hover:border-gray-300"
      >
        <MoveLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
        Back to Jobs
      </Link>
    </div>
  );
}
