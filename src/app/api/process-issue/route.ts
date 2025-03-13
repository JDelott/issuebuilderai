import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Octokit } from "octokit";
import Anthropic from "@anthropic-ai/sdk";
// Function to generate professional issues using Anthropic Claude
export async function generateProfessionalIssue(commentText: string) {
  try {
    // Initialize Anthropic client with API key from environment variable
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    
    // Create a prompt for Claude to generate a structured issue
    const prompt = `
You are an expert software developer assistant. Convert the following code comment into a well-structured GitHub issue.
Follow this exact format:

## Description
[A clear description of the issue]

## Steps to Reproduce
[Numbered steps to reproduce the issue]

## Expected Behavior
[What should happen when following the steps]

## Additional Information
- **Browser and version**: [Browser information if applicable]
- **Operating system**: [OS information if applicable]
- **Any other relevant details**: [Any other context]

## Possible Solution
[Potential fix or workaround if available]

Here's the code comment to convert:
${commentText}

Respond only with the formatted issue content, no additional text.
`;

    // Call Claude to generate the issue
    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      temperature: 0.2,
      system: "You are a helpful assistant that converts code comments into well-structured GitHub issues.",
      messages: [
        { role: "user", content: prompt }
      ]
    });

    // Extract the generated issue content
    // Handle different content block types
    let issueContent = "";
    if (response.content[0].type === 'text') {
      issueContent = response.content[0].text;
    } else {
      // Fallback if we get a different content type
      throw new Error("Unexpected response format from Anthropic API");
    }
    
    // Extract title from the first line or section
    let title = "";
    const descriptionMatch = issueContent.match(/## Description\s*\n(.*?)(?=\n\n|\n##|$)/);
    if (descriptionMatch && descriptionMatch[1]) {
      title = descriptionMatch[1].trim().split('\n')[0];
      // Limit title length
      if (title.length > 80) {
        title = title.substring(0, 77) + '...';
      }
    } else {
      // Fallback to first line of comment
      const lines = commentText.split('\n');
      title = lines[0].replace(/^(\/\/|\/\*|\*|#)\s*/, '').trim();
      if (title.length > 80) {
        title = title.substring(0, 77) + '...';
      }
    }
    
    // Determine appropriate labels
    const labels = ["auto-generated"];
    const lowerContent = issueContent.toLowerCase();
    
    if (lowerContent.includes('bug') || lowerContent.includes('fix') || lowerContent.includes('issue') || 
        lowerContent.includes('error') || lowerContent.includes('crash') || lowerContent.includes('problem')) {
      labels.push("bug");
    }
    
    if (lowerContent.includes('feature') || lowerContent.includes('enhancement') || 
        lowerContent.includes('improve') || lowerContent.includes('add') || lowerContent.includes('new')) {
      labels.push("enhancement");
    }
    
    if (lowerContent.includes('document') || lowerContent.includes('doc') || lowerContent.includes('readme')) {
      labels.push("documentation");
    }
    
    return {
      title,
      body: issueContent,
      labels,
    };
  } catch (error) {
    console.error("Error generating issue with Anthropic:", error);
    
    // Fallback to basic issue generation if Anthropic fails
    return fallbackIssueGeneration(commentText);
  }
}

// Fallback function if Anthropic API fails
function fallbackIssueGeneration(commentText: string) {
  // Extract potential title from the first line
  const lines = commentText.split('\n');
  let title = lines[0].replace(/^(\/\/|\/\*|\*|#)\s*/, '').trim();
  
  // Limit title length
  if (title.length > 80) {
    title = title.substring(0, 77) + '...';
  }
  
  // Determine issue type and appropriate labels
  const labels = ["auto-generated"];
  
  const lowerComment = commentText.toLowerCase();
  
  // Analyze comment for categorization
  if (lowerComment.includes('bug') || lowerComment.includes('fix') || lowerComment.includes('issue') || 
      lowerComment.includes('error') || lowerComment.includes('crash') || lowerComment.includes('problem')) {
    labels.push("bug");
  }
  
  if (lowerComment.includes('feature') || lowerComment.includes('enhancement') || 
      lowerComment.includes('improve') || lowerComment.includes('add') || lowerComment.includes('new')) {
    labels.push("enhancement");
  }
  
  if (lowerComment.includes('document') || lowerComment.includes('doc') || lowerComment.includes('readme')) {
    labels.push("documentation");
  }
  
  // Generate a structured issue body
  const body = `## Description
${commentText.replace(/^(\/\/|\/\*|\*\/|\*|#)/gm, '').trim()}

## Steps to Reproduce
1. Navigate to the affected page/component
2. Observe the issue described

## Expected Behavior
The feature should work as designed without errors.

## Additional Information
- **Browser and version**: Not specified
- **Operating system**: Not specified
- **Any other relevant details**: None provided

## Possible Solution
To be determined after investigation.`;
  
  return {
    title,
    body,
    labels,
  };
}

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { commentText, customTitle, customBody, repoOwner, repoName } = body;

    if (!repoOwner || !repoName) {
      return NextResponse.json(
        { error: "Missing repository information" },
        { status: 400 }
      );
    }

    // Determine the title and body to use
    let title = customTitle;
    let issueBody = customBody;
    let labels = ["auto-generated"];

    // If we have comment text but no custom title/body, generate them
    if (commentText && (!customTitle || !customBody)) {
      try {
        const generatedIssue = await generateIssueFromComment(commentText);
        title = title || generatedIssue.title;
        issueBody = issueBody || generatedIssue.body;
        labels = generatedIssue.labels;
      } catch (error) {
        console.error("Error generating issue from comment:", error);
        return NextResponse.json(
          { error: "Failed to generate issue content" },
          { status: 500 }
        );
      }
    }

    // Final validation
    if (!title || !issueBody) {
      return NextResponse.json(
        { error: "Missing issue title or body" },
        { status: 400 }
      );
    }

    // Create GitHub issue
    const octokit = new Octokit({ auth: session.accessToken });
    
    try {
      // First check if the repository exists and is accessible
      await octokit.request("GET /repos/{owner}/{repo}", {
        owner: repoOwner,
        repo: repoName,
      });
      
      // If we get here, the repo exists and is accessible
      const response = await octokit.request("POST /repos/{owner}/{repo}/issues", {
        owner: repoOwner,
        repo: repoName,
        title: title,
        body: issueBody,
        labels: labels,
      });

      return NextResponse.json({
        success: true,
        issue: {
          number: response.data.number,
          url: response.data.html_url,
          title: title,
          body: issueBody,
        },
      });
    } catch (error: unknown) {
      // Type guard for error object
      if (typeof error === 'object' && error !== null && 'status' in error) {
        const statusError = error as { status: number };
        
        if (statusError.status === 404) {
          return NextResponse.json(
            { error: `Repository ${repoOwner}/${repoName} not found or not accessible` },
            { status: 404 }
          );
        } else if (statusError.status === 403) {
          return NextResponse.json(
            { error: "You don't have permission to create issues in this repository" },
            { status: 403 }
          );
        }
      }
      console.error("GitHub API error:", error);
      return NextResponse.json(
        { error: "Failed to create issue on GitHub" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing issue:", error);
    return NextResponse.json(
      { error: "Failed to process issue. Please check repository details and permissions." },
      { status: 500 }
    );
  }
}

// Helper function to generate issue from comment
async function generateIssueFromComment(commentText: string) {
  try {
    // Initialize Anthropic client with API key from environment variable
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    
    // Create a prompt for Claude to generate a structured issue
    const prompt = `
You are an expert software developer assistant. Convert the following code comment into a well-structured GitHub issue.
Follow this exact format:

## Description
[A clear description of the issue]

## Steps to Reproduce
[Numbered steps to reproduce the issue]

## Expected Behavior
[What should happen when following the steps]

## Additional Information
- **Browser and version**: [Browser information if applicable]
- **Operating system**: [OS information if applicable]
- **Any other relevant details**: [Any other context]

## Possible Solution
[Potential fix or workaround if available]

Here's the code comment to convert:
${commentText}

Respond only with the formatted issue content, no additional text.
`;

    // Call Claude to generate the issue
    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      temperature: 0.2,
      system: "You are a helpful assistant that converts code comments into well-structured GitHub issues.",
      messages: [
        { role: "user", content: prompt }
      ]
    });

    // Extract the generated issue content
    let issueContent = "";
    if (response.content[0].type === 'text') {
      issueContent = response.content[0].text;
    } else {
      // Fallback if we get a different content type
      throw new Error("Unexpected response format from Anthropic API");
    }
    
    // Extract title from the first line or section
    let title = "";
    const descriptionMatch = issueContent.match(/## Description\s*\n(.*?)(?=\n\n|\n##|$)/);
    if (descriptionMatch && descriptionMatch[1]) {
      title = descriptionMatch[1].trim().split('\n')[0];
      // Limit title length
      if (title.length > 80) {
        title = title.substring(0, 77) + '...';
      }
    } else {
      // Fallback to first line of comment
      const lines = commentText.split('\n');
      title = lines[0].replace(/^(\/\/|\/\*|\*|#)\s*/, '').trim();
      if (title.length > 80) {
        title = title.substring(0, 77) + '...';
      }
    }
    
    // Determine appropriate labels
    const labels = ["auto-generated"];
    const lowerContent = issueContent.toLowerCase();
    
    if (lowerContent.includes('bug') || lowerContent.includes('fix') || lowerContent.includes('issue') || 
        lowerContent.includes('error') || lowerContent.includes('crash') || lowerContent.includes('problem')) {
      labels.push("bug");
    }
    
    if (lowerContent.includes('feature') || lowerContent.includes('enhancement') || 
        lowerContent.includes('improve') || lowerContent.includes('add') || lowerContent.includes('new')) {
      labels.push("enhancement");
    }
    
    if (lowerContent.includes('document') || lowerContent.includes('doc') || lowerContent.includes('readme')) {
      labels.push("documentation");
    }
    
    return {
      title,
      body: issueContent,
      labels,
    };
  } catch (error) {
    console.error("Error generating issue with Anthropic:", error);
    
    // Fallback to basic issue generation
    const lines = commentText.split('\n');
    let title = lines[0].replace(/^(\/\/|\/\*|\*|#)\s*/, '').trim();
    
    if (title.length > 80) {
      title = title.substring(0, 77) + '...';
    }
    
    const body = `## Description
${commentText.replace(/^(\/\/|\/\*|\*\/|\*|#)/gm, '').trim()}

## Steps to Reproduce
1. Navigate to the affected page/component
2. Observe the issue described

## Expected Behavior
The feature should work as designed without errors.

## Additional Information
- **Browser and version**: Not specified
- **Operating system**: Not specified
- **Any other relevant details**: None provided

## Possible Solution
To be determined after investigation.`;
    
    return {
      title,
      body,
      labels: ["auto-generated"],
    };
  }
}
