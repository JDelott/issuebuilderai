'use client';

import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleAuthClick = async () => {
    if (!session) {
      // Sign in with redirect to generator page
      await signIn('github', { callbackUrl: '/generator' });
    } else {
      // If already signed in, go directly to generator
      router.push('/generator');
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#111111] overflow-x-hidden">
      {/* Header */}
      <header className="w-full py-2 lg:py-4 mt-2 lg:mt-4">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-3.5 bg-[#FF3F0A] rotate-45"/>
              <div className="h-3.5 w-[1px] bg-white/20"/>
              <span className="text-white/50 text-[10px] lg:text-sm tracking-[0.15em] uppercase whitespace-nowrap">Convert Text to GitHub Issues</span>
            </div>
            <button 
              onClick={session ? handleSignOut : handleAuthClick}
              className="flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-[#E63600] hover:bg-[#FF4B1A] text-white text-[9px] sm:text-sm rounded-sm transition-all shadow-[0_0_12px_rgba(230,54,0,0.12)]"
            >
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-5 lg:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              <span>{session ? 'Sign Out' : 'Sign in'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full flex items-center py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-20">
            {/* Left Column */}
            <div className="flex flex-col justify-center">
              <h2 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.9] mb-8 text-white">
                ISSUE<br />
                BUILDER<span className="text-[#FF3F0A]">AI</span>
              </h2>
              <div className="h-[2px] w-12 bg-[#FF3F0A] mb-8"/>
              <div className="space-y-4">
                <button 
                  onClick={handleAuthClick}
                  className="group inline-flex items-center gap-3 bg-[#E63600] hover:bg-[#FF4B1A] px-8 py-4 text-white text-base rounded-sm transition-all shadow-[0_0_15px_rgba(230,54,0,0.15)] hover:shadow-[0_0_20px_rgba(230,54,0,0.25)]"
                >
                  <svg className="w-5 h-5 text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  {session ? 'Create Issue' : 'Sign in with GitHub'}
                </button>
              </div>
            </div>

            {/* Right Column */}
            <div className="relative mt-8 lg:mt-0">
              <div className="absolute -top-32 -right-32 h-96 w-96 bg-[#FF3F0A]/5 blur-3xl"/>
              
              <div className="relative">
                <div className="absolute left-[26px] top-0 h-full w-[2px] bg-zinc-800 hidden sm:block"/>
                
                <div className="space-y-6 sm:space-y-8 lg:space-y-16">
                  {[
                    { num: '01', title: 'Connect Repository', desc: 'One-click GitHub authentication to link your repositories' },
                    { num: '02', title: 'Generate Issues', desc: 'AI analyzes your text and structures it into clear issues' },
                    { num: '03', title: 'Push to GitHub', desc: 'Send your new issues directly to your repository' }
                  ].map(({ num, title, desc }) => (
                    <div key={num} className="relative group">
                      <div className="absolute left-0 top-0 h-10 w-10 sm:h-14 sm:w-14 rounded-sm bg-zinc-900 group-hover:bg-[#FF3F0A]/10 transition-colors">
                        <div className="absolute inset-[2px] bg-[#111111] flex items-center justify-center text-[#FF3F0A] font-mono text-lg sm:text-xl">
                          {num}
                        </div>
                      </div>
                      
                      <div className="pl-14 sm:pl-20">
                        <h3 className="text-lg sm:text-2xl lg:text-3xl text-white font-medium mb-2 sm:mb-4">{title}</h3>
                        <p className="text-sm sm:text-lg text-neutral-400">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-neutral-800">
        <div className="container mx-auto px-6 lg:px-12 py-6">
          <div className="text-neutral-500 text-sm text-center">© 2025 IssueBuilder AI</div>
        </div>
      </footer>
    </div>
  );
}
