
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block text-xl text-brand-600">MeetingMinutes</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Link to="/login">
              <Button variant="outline" size="sm" className="px-4">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="px-4 bg-brand-600 hover:bg-brand-700">
                Sign up
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
