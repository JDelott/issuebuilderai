import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { commentText } = body;

    if (!commentText) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

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

      return NextResponse.json({
        title,
        body: issueContent,
      });
    } catch (error) {
      console.error("Error generating issue with Anthropic:", error);
      
      // Fallback to basic issue generation if Anthropic fails
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
      
      return NextResponse.json({
        title,
        body,
      });
    }
  } catch (error) {
    console.error("Error processing issue preview:", error);
    return NextResponse.json(
      { error: "Failed to generate issue preview" },
      { status: 500 }
    );
  }
}
