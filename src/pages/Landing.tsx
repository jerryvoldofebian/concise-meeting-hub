
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Link } from "react-router-dom";
import { Calendar, CheckSquare, Share2, Users } from "lucide-react";

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28 bg-gradient-to-br from-white to-blue-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-800">
                  Streamline Your Meetings and Track Tasks Effortlessly
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl">
                  Create, share, and follow up on meeting minutes with our intuitive platform. Assign tasks, track progress, and collaborate with your team.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Link to="/signup">
                    <Button size="lg" className="bg-brand-600 hover:bg-brand-700">
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative lg:block">
                <div className="relative mx-auto w-full max-w-2xl rounded-lg border shadow-lg bg-white p-2">
                  <div className="rounded-md bg-slate-50 p-4">
                    <div className="space-y-4">
                      <div className="h-2 w-20 rounded bg-slate-200"></div>
                      <div className="space-y-2">
                        <div className="h-4 w-full rounded bg-slate-200"></div>
                        <div className="h-4 w-2/3 rounded bg-slate-200"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-slate-200"></div>
                        <div className="h-4 w-24 rounded bg-slate-200"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 w-full rounded bg-slate-200"></div>
                        <div className="h-4 w-4/5 rounded bg-slate-200"></div>
                        <div className="h-4 w-3/4 rounded bg-slate-200"></div>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-8 w-16 rounded bg-brand-200"></div>
                        <div className="h-8 w-16 rounded bg-slate-200"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Key Features</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Everything you need to manage meetings and follow up on tasks.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card shadow-sm">
                <Calendar className="h-12 w-12 mb-4 text-brand-600" />
                <h3 className="text-xl font-bold mb-2">Meeting Management</h3>
                <p className="text-muted-foreground">Schedule meetings, create agendas, and record minutes all in one place.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card shadow-sm">
                <CheckSquare className="h-12 w-12 mb-4 text-brand-600" />
                <h3 className="text-xl font-bold mb-2">Task Assignment</h3>
                <p className="text-muted-foreground">Create and assign tasks directly from meeting minutes to team members.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card shadow-sm">
                <Share2 className="h-12 w-12 mb-4 text-brand-600" />
                <h3 className="text-xl font-bold mb-2">Easy Sharing</h3>
                <p className="text-muted-foreground">Share meeting minutes via email, WhatsApp, or directly within the app.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card shadow-sm">
                <Users className="h-12 w-12 mb-4 text-brand-600" />
                <h3 className="text-xl font-bold mb-2">Team Collaboration</h3>
                <p className="text-muted-foreground">Collaborate with your team on meeting minutes and task assignments.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 bg-brand-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to Streamline Your Meetings?</h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Sign up today and start creating effective meeting minutes and task management.
                </p>
              </div>
              <div className="space-x-4">
                <Link to="/signup">
                  <Button size="lg" className="bg-brand-600 hover:bg-brand-700">
                    Get Started - It's Free
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 MeetingMinutes. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link to="/terms" className="underline underline-offset-4 hover:text-foreground">Terms</Link>
            <Link to="/privacy" className="underline underline-offset-4 hover:text-foreground">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
