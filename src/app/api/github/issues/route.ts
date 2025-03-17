import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/config";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { repository, issues } = await request.json();

    if (!repository || !issues || !Array.isArray(issues)) {
      return NextResponse.json(
        { error: "Repository and issues array are required" },
        { status: 400 }
      );
    }

    const createdIssues = await Promise.all(
      issues.map(async (issue) => {
        const response = await fetch(
          `https://api.github.com/repos/${repository}/issues`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session.accessToken}`,
              'Accept': 'application/vnd.github.v3+json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: issue.title,
              body: `${issue.body}\n\n**Priority:** ${issue.priority}`,
              labels: issue.labels,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to create issue: ${issue.title}`);
        }

        return response.json();
      })
    );

    return NextResponse.json(createdIssues);
  } catch (error) {
    console.error('GitHub Issue Creation Error:', error);
    return NextResponse.json(
      { error: "Failed to create issues" },
      { status: 500 }
    );
  }
}
