'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Repository {
  id: number;
  full_name: string;
  name: string;
}

export default function Generator() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add debug logging for session
  useEffect(() => {
    console.log('Session status:', status);
    console.log('Session data:', session);
  }, [session, status]);

  useEffect(() => {
    async function fetchRepositories() {
      try {
        const response = await fetch('/api/github/repos');
        console.log('API Response:', response);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Error:', errorData);
          throw new Error(`Failed to fetch repositories: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Repositories:', data);
        setRepositories(data);
      } catch (err) {
        console.error('Fetch Error:', err);
        setError('Failed to load repositories');
      } finally {
        setLoading(false);
      }
    }

    if (status === 'authenticated' && session?.accessToken) {
      fetchRepositories();
    }
  }, [session, status]);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-200">
        <div className="text-neutral-900">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full bg-[#111111]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-5 w-5 sm:h-6 sm:w-6 bg-[#FF3F0A] rotate-45 shadow-sm"/>
              <div className="h-5 sm:h-6 w-[1px] bg-neutral-800"/>
              <span className="text-neutral-400 text-xs sm:text-sm tracking-[0.2em] uppercase">IssueBuilder AI</span>
            </div>
            {session && (
              <button 
                onClick={() => router.push('/')}
                className="text-neutral-400 hover:text-white text-xs sm:text-sm tracking-wide transition-colors"
              >
                Exit Generator
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-neutral-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
          <div className="max-w-3xl mx-auto space-y-8 sm:space-y-12 md:space-y-16">
            {/* Repository Selection */}
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-1">
                <label className="block text-xs sm:text-sm text-neutral-900 tracking-[0.15em] uppercase font-medium">
                  Select Repository
                </label>
                <span className="block text-xs sm:text-sm text-neutral-500">
                  Choose where to create the new issues
                </span>
              </div>
              <div className="relative">
                <div className="bg-white border-b-2 border-neutral-300 transition-colors focus-within:border-[#FF3F0A]">
                  <select 
                    className="w-full appearance-none bg-transparent text-neutral-800 text-sm sm:text-base px-4 sm:px-6 py-4 sm:py-5 focus:ring-0 focus:outline-none"
                  >
                    <option value="" className="text-neutral-400">Select a repository...</option>
                    {error ? (
                      <option disabled className="text-red-500">Error loading repositories</option>
                    ) : (
                      repositories.map((repo) => (
                        <option key={repo.id} value={repo.full_name} className="text-neutral-800">
                          {repo.full_name}
                        </option>
                      ))
                    )}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 sm:px-6 pointer-events-none">
                    <svg className="h-3 w-3 sm:h-4 sm:w-4 text-[#FF3F0A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Text Input */}
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-1">
                <label className="block text-xs sm:text-sm text-neutral-900 tracking-[0.15em] uppercase font-medium">
                  Input Text
                </label>
                <span className="block text-xs sm:text-sm text-neutral-500">
                  Add the text you want to convert into GitHub issues
                </span>
              </div>
              <div className="bg-white border-b-2 border-neutral-300 transition-colors focus-within:border-[#FF3F0A]">
                <textarea 
                  className="w-full h-48 sm:h-64 bg-transparent text-neutral-800 text-sm sm:text-base px-4 sm:px-6 py-4 sm:py-5 focus:ring-0 focus:outline-none resize-none placeholder:text-neutral-400 placeholder:text-xs sm:placeholder:text-sm"
                  placeholder="Start by pasting your content here. This could be:

• A discussion thread from Discord or Slack
• User feedback or feature requests
• Bug reports or technical discussions
• Any text you want to convert into structured issues"
                />
              </div>
            </div>

            {/* Generate Button */}
            <div className="pt-4 sm:pt-8">
              <button className="group w-full sm:w-auto bg-[#111111] hover:bg-[#FF3F0A] text-white px-8 sm:px-12 py-3 shadow-sm hover:shadow transition-all">
                <span className="inline-flex items-center gap-2 text-sm sm:text-base">
                  Generate Issues
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#FF3F0A] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-neutral-200 bg-neutral-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="text-neutral-500 text-[10px] sm:text-xs tracking-wide text-center">© 2024 IssueBuilder AI</div>
        </div>
      </footer>
    </div>
  );
}
