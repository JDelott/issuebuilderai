'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Repository {
  id: number;
  name: string;
  full_name: string;
}

interface Issue {
  title: string;
  body: string;
  labels: string[];
  priority: string;
}

interface Notification {
  message: string;
  type: 'success' | 'error';
}

export default function Generator() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>("");
  const [inputText, setInputText] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedIssue, setGeneratedIssue] = useState<Issue | null>(null);
  const [isCreatingIssues, setIsCreatingIssues] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedIssue, setEditedIssue] = useState<Issue | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);

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

  // Add notification timeout cleanup
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };

  const handleGenerateIssue = async () => {
    if (!selectedRepo || !inputText) {
      showNotification("Please select a repository and enter some text", "error");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('/api/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          repository: selectedRepo,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process text');
      }

      const issue = await response.json();
      setGeneratedIssue(issue);
      setEditedIssue(issue);
    } catch (error) {
      console.error('Generation Error:', error);
      showNotification("Failed to generate issue. Please try again.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateIssue = async () => {
    if (!selectedRepo || !editedIssue) return;

    setIsCreatingIssues(true);
    try {
      const response = await fetch('/api/github/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repository: selectedRepo,
          issues: [editedIssue],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create issue');
      }

      showNotification("Issue created successfully!", "success");
      // Reset form
      setInputText('');
      setGeneratedIssue(null);
      setEditedIssue(null);
      setIsEditing(false);
    } catch (error) {
      console.error('Issue Creation Error:', error);
      showNotification("Failed to create issue. Please try again.", "error");
    } finally {
      setIsCreatingIssues(false);
    }
  };

  const handleDeleteIssue = () => {
    if (confirm('Are you sure you want to delete this generated issue?')) {
      setGeneratedIssue(null);
      setEditedIssue(null);
      setIsEditing(false);
      showNotification("Issue deleted", "success");
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleEditChange = (field: keyof Issue, value: string | string[]) => {
    if (!editedIssue) return;
    
    if (field === 'labels') {
      // Handle labels as comma-separated string
      const labels = typeof value === 'string' ? value.split(',').map(l => l.trim()) : value;
      setEditedIssue({ ...editedIssue, [field]: labels });
    } else {
      setEditedIssue({ ...editedIssue, [field]: value });
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-200">
        <div className="text-neutral-900">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded-md text-white transition-all transform ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {notification.message}
        </div>
      )}

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
                  Choose where to create the new issue
                </span>
              </div>
              <div className="relative">
                <div className="bg-white border-b-2 border-neutral-300 transition-colors focus-within:border-[#FF3F0A]">
                  <select 
                    value={selectedRepo}
                    onChange={(e) => setSelectedRepo(e.target.value)}
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
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
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
              <button
                onClick={handleGenerateIssue}
                disabled={isProcessing || !selectedRepo || !inputText}
                className="group w-full sm:w-auto bg-[#111111] hover:bg-[#FF3F0A] text-white px-8 sm:px-12 py-3 shadow-sm hover:shadow transition-all"
              >
                <span className="inline-flex items-center gap-2 text-sm sm:text-base">
                  {isProcessing ? 'Processing...' : 'Generate Issue'}
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#FF3F0A] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
            </div>

            {/* Generated Issue Preview */}
            {generatedIssue && editedIssue && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Generated Issue</h2>
                  <div className="space-x-2">
                    <button
                      onClick={handleEditToggle}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                    >
                      {isEditing ? 'Preview' : 'Edit'}
                    </button>
                    <button
                      onClick={handleDeleteIssue}
                      className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-md p-4">
                  {isEditing ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Title</label>
                        <input
                          type="text"
                          value={editedIssue.title}
                          onChange={(e) => handleEditChange('title', e.target.value)}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Body</label>
                        <textarea
                          value={editedIssue.body}
                          onChange={(e) => handleEditChange('body', e.target.value)}
                          className="w-full p-2 border rounded-md h-64"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Labels (comma-separated)</label>
                        <input
                          type="text"
                          value={editedIssue.labels.join(', ')}
                          onChange={(e) => handleEditChange('labels', e.target.value)}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Priority</label>
                        <select
                          value={editedIssue.priority}
                          onChange={(e) => handleEditChange('priority', e.target.value)}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    // Preview Mode
                    <>
                      <h3 className="font-medium">{editedIssue.title}</h3>
                      <div className="mt-2 text-sm text-gray-600 whitespace-pre-wrap">
                        {editedIssue.body}
                      </div>
                      <div className="mt-2 flex gap-2">
                        {editedIssue.labels.map((label, i) => (
                          <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {label}
                          </span>
                        ))}
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          editedIssue.priority === 'high' ? 'bg-red-100 text-red-800' :
                          editedIssue.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {editedIssue.priority}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Create Issue Button */}
                <button
                  onClick={handleCreateIssue}
                  disabled={isCreatingIssues}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {isCreatingIssues ? 'Creating Issue...' : 'Create Issue in GitHub'}
                </button>
              </div>
            )}
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
