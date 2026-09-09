import { NextResponse } from 'next/server';

const CHARACTER = {
  name: 'Aloo',
  vegetable: 'potato',
  body: 'full human-like cartoon body',
  face: '100% potato-shaped head; eyes, nose and mouth embedded on potato surface',
  clothes: 'simple village kurta shalwar',
  colors: 'natural potato brown + off-white clothing'
};

const seeds = [
  {
    title: 'Aloo Ne Bijli Ka Bill Dekha',
    hook: 'Aloo bill kholta hai… aur amount dekh kar uski aankhen khul jaati hain.',
    factors: [24,18,19,14,8,9],
    reason: 'Relatable household problem + instant comedy + strong visual reaction.'
  },
  {
    title: 'Aloo Ko Lottery Mil Gayi',
    hook: 'Aloo ko pata chalta hai ke uski purani ticket jackpot jeet chuki hai.',
    factors: [23,19,18,15,8,8],
    reason: 'Money surprise creates curiosity and a clear payoff.'
  },
  {
    title: 'Tamatar Ne Shaadi Mein Dhoka De Diya',
    hook: 'Tamatar shaadi ke stage par kisi aur ke saath nazar aa jata hai.',
    factors: [22,20,20,15,7,7],
    reason: 'Relationship twist + emotional comedy, but needs careful family-safe execution.'
  },
  {
    title: 'Pyaz Ka Aakhri Raaz',
    hook: 'Pyaz sab ko kehta hai ke uske paas ek aisa raaz hai jo poori sabzi mandi badal dega.',
    factors: [21,22,18,14,7,8],
    reason: 'Mystery hook encourages viewers to stay for the reveal.'
  },
  {
    title: 'Kheera Bana Mohallay Ka Hero',
    hook: 'Kheera ek chhoti si mushkil mein sab ko bachane ka faisla karta hai.',
    factors: [20,18,19,16,8,9],
    reason: 'Hero transformation is easy to visualize and family friendly.'
  }
];

function scoreIdea(x) {
  return x.factors.reduce((a,b) => a+b, 0);
}

function promptFor(scene, dialogue) {
  return `9:16 vertical, high-end cinematic 3D cartoon animation, consistent Indian/South Asian village vegetable world. ${CHARACTER.name} is an anthropomorphic potato with a FULL human-like body but a HEAD/FACE that is 100% potato, never human. Potato texture and irregular potato silhouette remain visible. Eyes, nose and mouth are embedded naturally on the potato surface. Natural vegetable mouth movement only. ${CHARACTER.name} wears ${CHARACTER.clothes}; preserve exact clothing, colors, proportions and face design. Scene action: ${scene}. Dialogue/narration: ${dialogue}. Warm cinematic lighting, expressive comedy, clean family-friendly composition, detailed environment. NO human faces, NO human heads, NO realistic human skin, NO human background characters, NO character morphing, NO redesign, NO text, NO subtitles.`;
}

function buildProject(idea) {
  const scenes = [
    { number:1, action:'Aloo ghar ke darwaze par bijli ka bill uthata hai aur camera uske shocked potato face par push-in karta hai.', dialogue:'آلو نے بجلی کا بل دیکھا تو اس کے ہوش اڑ گئے۔' },
    { number:2, action:'Aloo bill ko dobara dekhta hai, phir apni jeb check karta hai.', dialogue:'وہ بولا، اتنے پیسے تو میرے پاس ہیں ہی نہیں۔' },
    { number:3, action:'Aloo calculator nikalta hai aur bill ki rakam dobara calculate karta hai.', dialogue:'آلو نے حساب لگایا، مگر رقم پھر بھی اتنی ہی تھی۔' },
    { number:4, action:'Aloo pareshan hokar ghar ke andar chalta hai.', dialogue:'اس نے سوچا، اب یہ بل کون بھرے گا؟' },
    { number:5, action:'Aloo ko achanak yaad aata hai ke pichle mahine ghar mein fan poori raat chalta raha tha.', dialogue:'پھر اسے پچھلے مہینے کی اپنی غلطی یاد آ گئی۔' },
    { number:6, action:'Aloo sharminda expression ke saath fan ki taraf dekhta hai.', dialogue:'وہ بولا، غلطی میری تھی، بل بھی مجھے ہی بھرنا ہوگا۔' },
    { number:7, action:'Aloo family-style vegetable household mein energy-saving ka plan banata hai.', dialogue:'آلو نے فیصلہ کیا، اب بجلی ضائع نہیں کرے گا۔' },
    { number:8, action:'Aloo camera ki taraf dekh kar serious-comedy expression deta hai.', dialogue:'اور اگلا بل دیکھنے سے پہلے، پنکھا بند کرنا سیکھ گیا۔' }
  ].map(s => ({...s, prompt: promptFor(s.action, s.dialogue)}));

  return {
    title: idea.title,
    hook: idea.hook,
    story: 'آلو کو اچانک بجلی کا بل ملتا ہے۔ رقم دیکھ کر وہ گھبرا جاتا ہے، حساب کرتا ہے، اپنی پچھلی لاپرواہی یاد کرتا ہے اور آخر میں فیصلہ کرتا ہے کہ اب بجلی ضائع نہیں کرے گا۔ کہانی کا مزاح اس کے بڑھتے ہوئے صدمے اور آخری سبق میں ہے۔',
    characterLock: CHARACTER,
    scenes,
    seo: {
      title: 'Aloo Ne Bijli Ka Bill Dekha 😂 | Funny Vegetable Story',
      description: 'Aloo ko jab bijli ka bill mila to uska reaction dekh kar aap bhi hans parenge 😂 Family-friendly funny AI vegetable story.',
      hashtags: ['#Aloo','#VegetableStory','#FunnyStory','#AIAnimation','#Shorts'],
      tags: ['aloo story','funny vegetable story','ai vegetable animation','urdu funny story','potato cartoon','viral shorts','ai story']
    }
  };
}

export async function POST(req) {
  try {
    const body = await req.json();
    if (body.action === 'ideas') {
      const ideas = seeds
        .map(x => ({...x, score: scoreIdea(x)}))
        .sort((a,b) => b.score-a.score);
      return NextResponse.json({ideas});
    }
    if (body.action === 'build') {
      return NextResponse.json({project: buildProject(body.idea)});
    }
    return NextResponse.json({error:'Unknown action'}, {status:400});
  } catch (e) {
    return NextResponse.json({error:e.message}, {status:500});
  }
    }
