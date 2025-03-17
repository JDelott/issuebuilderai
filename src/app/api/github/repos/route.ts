import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/config";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  console.log('API Session:', session); // Debug log

  if (!session?.accessToken) {
    console.log('No access token found'); // Debug log
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    console.log('GitHub API Status:', response.status); // Debug log

    if (!response.ok) {
      const errorData = await response.json();
      console.error('GitHub API Error:', errorData);
      throw new Error('Failed to fetch repositories');
    }

    const repos = await response.json();
    return NextResponse.json(repos);
  } catch (error) {
    console.error('Error in repos route:', error);
    return NextResponse.json(
      { error: "Failed to fetch repositories" },
      { status: 500 }
    );
  }
}
