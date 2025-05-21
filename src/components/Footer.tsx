import { CameraIcon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <CameraIcon className="h-5 w-5 text-red-500" />
            <span className="text-lg font-bold tracking-wider">VAKTROS</span>
          </div>
          <div className="text-sm text-gray-400">© {new Date().getFullYear()} Vaktros. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
} 