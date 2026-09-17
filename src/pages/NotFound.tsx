import React from "react";
import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import { Button } from "@/components/ui/button";
import { Search, Home, ArrowRight } from "lucide-react";

export const NotFoundPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Page Not Found | 404 | Opsiys"
        description="The requested page could not be found."
        robots="noindex, follow"
      />
      <div className="min-h-screen bg-[#0B0B0B] text-white flex flex-col items-center justify-center p-6 text-center pt-24 pb-20">
        <div className="max-w-md space-y-6">
          <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 text-accent rounded-full flex items-center justify-center mx-auto shadow-2xl">
            <Search className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-accent">
              404 • ROUTE_NOT_FOUND
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-tight">
              Page Not Found
            </h1>
          </div>

          <p className="text-zinc-400 text-sm leading-relaxed">
            The page you requested may have moved or no longer exists. Navigate back to our core growth solutions below.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link to="/" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-white text-black hover:bg-zinc-200 font-bold uppercase tracking-widest text-xs px-8 py-6 rounded-none">
                <Home className="w-4 h-4 mr-2" />
                Return to Home
              </Button>
            </Link>
            <Link to="/services" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto border-zinc-800 text-white hover:border-white font-bold uppercase tracking-widest text-xs px-8 py-6 rounded-none">
                Explore Services
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
export default NotFoundPage;
