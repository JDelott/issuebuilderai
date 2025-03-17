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
      // Sign out and stay on home page
      await signOut({ callbackUrl: '/' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#111111] overflow-x-hidden">
      {/* Header */}
      <header className="w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 sm:h-8 sm:w-8 bg-[#FF3F0A] rotate-45"/>
              <div className="h-7 sm:h-8 w-[1px] bg-white/20"/>
              <span className="hidden sm:inline text-white/50 text-sm tracking-[0.2em] uppercase">Convert Text to GitHub Issues</span>
              <span className="sm:hidden text-white/50 text-xs tracking-[0.2em] uppercase">Convert to Issues</span>
            </div>
            <button 
              onClick={handleAuthClick}
              className="flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs sm:text-sm rounded transition-colors"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              <span className="hidden sm:inline">{session ? 'Sign Out' : 'Sign in with GitHub'}</span>
              <span className="sm:hidden">{session ? 'Sign Out' : 'Sign in'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full flex items-center py-12 sm:py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left Column */}
            <div className="lg:col-span-6">
              <h2 className="text-[2.75rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5rem] xl:text-[6rem] font-bold leading-[0.9] mb-8 sm:mb-12 text-white">
                ISSUE<br />
                BUILDER<span className="text-[#FF3F0A]">AI</span>
              </h2>
              <div className="h-[2px] w-12 bg-[#FF3F0A] mb-6 sm:mb-8"/>
              <div className="space-y-3 text-lg sm:text-xl text-neutral-400 mb-8 sm:mb-12">
                <p>• Just copy & paste any discussion or comment thread</p>
                <p>• AI instantly creates structured GitHub issues</p>
                <p>• Works with Discord, Slack & community feedback</p>
              </div>
              <div className="space-y-4">
                <button 
                  onClick={handleAuthClick}
                  className={`group flex items-center justify-center gap-3 w-full sm:w-auto ${
                    session ? 'bg-zinc-900 hover:bg-zinc-800' : 'bg-zinc-900 hover:bg-zinc-800'
                  } px-8 py-4 text-white text-base rounded-sm transition-all`}
                >
                  <svg className="w-5 h-5 text-[#FF3F0A] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  {session ? 'Continue to Generator' : 'Connect GitHub Repository'}
                </button>
                <p className="text-sm text-neutral-500 text-center sm:text-left">Authentication required to create and manage issues</p>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-6 lg:pl-8 xl:pl-12">
              <div className="relative">
                <div className="absolute -top-24 -right-12 sm:-right-24 h-64 sm:h-96 w-64 sm:w-96 bg-[#FF3F0A]/5 blur-3xl"/>
                
                <div className="relative">
                  <div className="absolute left-[20px] sm:left-[26px] top-0 h-full w-[2px] bg-zinc-800"/>
                  
                  <div className="space-y-16 sm:space-y-24">
                    <div className="relative group">
                      <div className="absolute left-0 top-0 h-10 w-10 sm:h-14 sm:w-14 rounded-sm bg-zinc-900 group-hover:bg-[#FF3F0A]/10 transition-colors">
                        <div className="absolute inset-[2px] bg-[#111111] flex items-center justify-center text-[#FF3F0A] font-mono text-lg sm:text-xl">
                          01
                        </div>
                      </div>
                      
                      <div className="pl-16 sm:pl-20">
                        <h3 className="text-white font-medium text-xl sm:text-2xl lg:text-3xl mb-3 sm:mb-4">Connect Repository</h3>
                        <p className="text-neutral-400 text-base sm:text-lg lg:text-xl">One-click GitHub authentication to link your repositories</p>
                      </div>
                    </div>

                    <div className="relative group">
                      <div className="absolute left-0 top-0 h-10 w-10 sm:h-14 sm:w-14 rounded-sm bg-zinc-900 group-hover:bg-[#FF3F0A]/10 transition-colors">
                        <div className="absolute inset-[2px] bg-[#111111] flex items-center justify-center text-[#FF3F0A] font-mono text-lg sm:text-xl">
                          02
                        </div>
                      </div>
                      
                      <div className="pl-16 sm:pl-20">
                        <h3 className="text-white font-medium text-xl sm:text-2xl lg:text-3xl mb-3 sm:mb-4">AI Text Analysis</h3>
                        <p className="text-neutral-400 text-base sm:text-lg lg:text-xl">AI analyzes your text and structures it into clear issues</p>
                      </div>
                    </div>

                    <div className="relative group">
                      <div className="absolute left-0 top-0 h-10 w-10 sm:h-14 sm:w-14 rounded-sm bg-zinc-900 group-hover:bg-[#FF3F0A]/10 transition-colors">
                        <div className="absolute inset-[2px] bg-[#111111] flex items-center justify-center text-[#FF3F0A] font-mono text-lg sm:text-xl">
                          03
                        </div>
                      </div>
                      
                      <div className="pl-16 sm:pl-20">
                        <h3 className="text-white font-medium text-xl sm:text-2xl lg:text-3xl mb-3 sm:mb-4">Push to GitHub</h3>
                        <p className="text-neutral-400 text-base sm:text-lg lg:text-xl">Send your new issues directly to your repository</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-neutral-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="text-neutral-500 text-xs sm:text-sm text-center">© 2024 IssueBuilder AI</div>
        </div>
      </footer>
    </div>
  );
}
