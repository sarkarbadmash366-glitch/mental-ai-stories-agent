import { NextResponse } from 'next/server';

const CHARACTER = {
  name: 'Aloo',
  vegetable: 'potato',
  body: 'full human-like cartoon body',
  face: '100% potato-shaped head; eyes, nose and mouth embedded naturally on potato surface',
  clothes: 'simple village kurta shalwar',
  colors: 'natural potato brown + off-white clothing'
};

function cleanJson(text) {
  let value = text.trim();

  if (value.startsWith('```')) {
    value = value.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
  }

  const first = value.indexOf('[');
  const last = value.lastIndexOf(']');

  if (first !== -1 && last !== -1) {
    value = value.slice(first, last + 1);
  }

  return JSON.parse(value);
}

async function askOpenAI(prompt, useWebSearch = false) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is missing in Vercel Environment Variables.');
  }

  const body = {
    model: 'gpt-5.6-luna',
    input: prompt
  };

  if (useWebSearch) {
    body.tools = [
      {
        type: 'web_search'
      }
    ];
  }

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message || 'OpenAI API request failed.'
    );
  }

  return data.output_text || '';
}

async function generateIdeas() {
  const prompt = `
You are the VIRAL TREND HUNTER for a Pakistani AI vegetable story channel.

Channel niche:
- Viral AI vegetable stories
- Anthropomorphic vegetables
- Urdu/Roman Urdu audience
- YouTube Shorts, TikTok and Facebook Reels
- Adult-feel entertainment, comedy, mystery, emotion and twists
- NOT children's nursery stories

Search the current web for recent viral topics, conversations, situations,
memes, entertainment patterns, relatable problems and story concepts.

Do NOT copy another creator's exact story.
Instead, use current trends as inspiration and create ORIGINAL vegetable-story concepts.

Focus on ideas that can become highly clickable 45-60 second videos.

For every idea give:
1. title
2. hook
3. trend or current topic behind the idea
4. why viewers will watch
5. viral score from 0-100

Return ONLY valid JSON array.
No markdown.
No explanation outside JSON.

Format:
[
  {
    "title": "...",
    "hook": "...",
    "trend": "...",
    "reason": "...",
    "score": 85
  }
]

Give exactly 5 ideas.
`;

  const text = await askOpenAI(prompt, true);

  let ideas;

  try {
    ideas = cleanJson(text);
  } catch {
    throw new Error('AI returned invalid idea data.');
  }

  return ideas
    .filter(x => x.title && x.hook)
    .sort((a, b) => Number(b.score) - Number(a.score));
}

async function buildStory(idea) {
  const prompt = `
You are the STORY WRITER and SCENE DIRECTOR for a viral AI vegetable
animation channel.

Selected idea:
Title: ${idea.title}
Hook: ${idea.hook}
Trend: ${idea.trend || 'current viral topic'}
Reason: ${idea.reason || ''}

Create a complete original Urdu story for a 45-60 second video.

IMPORTANT CHARACTER LOCK:
- Main character is Aloo.
- Aloo has a FULL human-like cartoon body.
- Aloo's head/face must remain 100% potato.
- Eyes, nose and mouth are embedded on the potato surface.
- NEVER turn Aloo into a human.
- NEVER give Aloo a human head or human skin.
- Keep exact clothing, body proportions and potato appearance consistent.
- No random human characters.
- Other vegetables can appear, but their heads must remain actual vegetables.

STYLE:
- Cinematic 3D animation
- South Asian vegetable world
- Funny, emotional or suspenseful
- Strong first 2-second hook
- Clear escalation
- Twist or satisfying payoff
- No unnecessary dialogue
- Urdu dialogue/narration

Create exactly 8 scenes.
Each scene must be approximately 8 seconds.

Return ONLY valid JSON.
No markdown.
No explanation outside JSON.

Format:
{
  "title": "...",
  "hook": "...",
  "story": "...",
  "scenes": [
    {
      "number": 1,
      "action": "...",
      "dialogue": "..."
    }
  ],
  "seo": {
    "title": "...",
    "description": "...",
    "hashtags": ["..."],
    "tags": ["..."]
  }
}
`;

  const text = await askOpenAI(prompt, false);

  let project;

  try {
    const first = text.indexOf('{');
    const last = text.lastIndexOf('}');

    if (first === -1 || last === -1) {
      throw new Error('No JSON object found.');
    }

    project = JSON.parse(text.slice(first, last + 1));
  } catch {
    throw new Error('AI returned invalid story data.');
  }

  project.characterLock = CHARACTER;

  project.scenes = (project.scenes || []).map(scene => ({
    ...scene,
    prompt: makeScenePrompt(scene)
  }));

  return project;
}

function makeScenePrompt(scene) {
  return `
9:16 vertical cinematic 3D cartoon animation.

CHARACTER LOCK:
Aloo is an anthropomorphic potato.
FULL human-like cartoon body.
HEAD AND FACE MUST BE 100% REAL POTATO SHAPE.
Potato texture and irregular potato silhouette must remain clearly visible.
Eyes, nose and mouth are embedded naturally into the potato surface.
Natural vegetable facial movement only.

Clothing:
simple village kurta shalwar.
Natural potato brown color.
Keep exactly the same character design, clothing,
body proportions and face throughout every scene.

SCENE:
${scene.action}

URDU DIALOGUE/NARRATION:
${scene.dialogue}

CONTINUITY:
This scene must begin exactly where the previous scene ended.
Preserve character position, clothing, environment,
lighting and object positions.

VISUAL STYLE:
high-end cinematic 3D animation,
South Asian village environment,
expressive but natural acting,
detailed environment,
smooth camera movement,
strong facial expressions.

NEGATIVE PROMPT:
human face,
human head,
human skin,
real human character,
character redesign,
vegetable becoming human,
different clothing,
different potato shape,
character morphing,
extra characters,
text,
subtitles,
watermark,
logo.
`;
}

export async function POST(req) {
  try {
    const body = await req.json();

    if (body.action === 'ideas') {
      const ideas = await generateIdeas();

      return NextResponse.json({
        success: true,
        ideas
      });
    }

    if (body.action === 'build') {
      const project = await buildStory(body.idea);

      return NextResponse.json({
        success: true,
        project
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Unknown action'
      },
      { status: 400 }
    );

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Something went wrong.'
      },
      { status: 500 }
    );
  }
  }
