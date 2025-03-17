import { NextResponse } from "next/server";
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { text, repository } = await request.json();

    if (!text || !repository) {
      return NextResponse.json(
        { error: "Text and repository are required" },
        { status: 400 }
      );
    }

    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 4000,
      temperature: 0.7,
      messages: [{
        role: "user",
        content: `Create a detailed GitHub issue from this text. Format your response as a JSON object with these exact fields:
        - title: A clear, concise title
        - body: A detailed description with sections for Overview, Details, Expected Outcome, and Additional Context
        - labels: An array of relevant GitHub labels
        - priority: either "high", "medium", or "low"

        Here's the text to convert: ${text}`
      }]
    });

    // Log the response for debugging
    console.log('Claude Response:', response.content[0]);

    if (response.content[0].type === 'text') {
      const content = response.content[0].text;
      try {
        const parsedContent = JSON.parse(content);
        return NextResponse.json(parsedContent);
      } catch (parseError) {
        console.error('Parse Error:', content);
        throw new Error('Failed to parse AI response');
      }
    }

    throw new Error('Invalid response from AI');

  } catch (error) {
    console.error('AI Processing Error:', error);
    return NextResponse.json(
      { error: "Failed to process text" },
      { status: 500 }
    );
  }
}
