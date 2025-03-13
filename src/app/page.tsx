import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex items-center gap-4">
          <Image
            src="/github.svg" 
            alt="GitHub logo"
            width={40}
            height={40}
            priority
          />
          <h1 className="text-2xl font-bold">IssueBuilder AI</h1>
        </div>

        <div className="max-w-2xl text-center sm:text-left">
          <p className="text-lg mb-4">
            Transform your text into well-structured GitHub issues instantly with AI assistance.
          </p>
          <ol className="list-inside list-decimal text-sm/6 font-[family-name:var(--font-geist-mono)]">
            <li className="mb-2 tracking-[-.01em]">
              Paste your text or requirements
            </li>
            <li className="mb-2 tracking-[-.01em]">
              Let AI analyze and structure the content
            </li>
            <li className="tracking-[-.01em]">
              Create GitHub issues automatically
            </li>
          </ol>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <button
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
          >
            <Image
              src="/plus.svg"
              alt="New issue icon" 
              width={20}
              height={20}
            />
            Create New Issue
          </button>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
            href="https://github.com/your-username/issuebuilder-ai"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/docs"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="Documentation icon"
            width={16}
            height={16}
          />
          Documentation
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/examples"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Examples icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/your-username/issuebuilder-ai/issues"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Issues icon"
            width={16}
            height={16}
          />
          View Issues →
        </a>
      </footer>
    </div>
  );
}
