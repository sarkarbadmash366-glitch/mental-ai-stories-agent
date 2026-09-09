'use client';

import { useState } from 'react';

const initialCharacter = {
  name: 'Aloo',
  vegetable: 'potato',
  body: 'full human-like cartoon body',
  face: '100% potato-shaped head; eyes, nose and mouth embedded on potato surface',
  clothes: 'simple village kurta shalwar',
  colors: 'natural potato brown + off-white clothing'
};

export default function Home() {
  const [ideas, setIdeas] = useState([]);
  const [project, setProject] = useState(null);
  const [busy, setBusy] = useState(false);

  async function findIdeas() {
    setBusy(true);
    const r = await fetch('/api/agent', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ action: 'ideas' })
    });
    const data = await r.json();
    setIdeas(data.ideas || []);
    setProject(null);
    setBusy(false);
  }

  async function buildStory(idea) {
    setBusy(true);
    const r = await fetch('/api/agent', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ action: 'build', idea })
    });
    const data = await r.json();
    setProject(data.project);
    setBusy(false);
  }

  return (
    <main className="wrap">
      <header>
        <div>
          <p className="eyebrow">MENTAL AI STORIES</p>
          <h1>Viral Vegetable Story Agent</h1>
          <p className="sub">v1 — Trend → Score → Story → Scenes → SEO</p>
        </div>
        <button onClick={findIdeas} disabled={busy}>
          {busy ? 'Working…' : '🔥 Find Viral Ideas'}
        </button>
      </header>

      <section className="card">
        <h2>Character Lock</h2>
        <div className="lock">
          <b>{initialCharacter.name}</b>
          <span>Vegetable: {initialCharacter.vegetable}</span>
          <span>{initialCharacter.body}</span>
          <span>{initialCharacter.face}</span>
          <span>Clothes: {initialCharacter.clothes}</span>
          <span>Colors: {initialCharacter.colors}</span>
        </div>
      </section>

      <section className="card">
        <h2>Candidate Ideas</h2>
        {ideas.length === 0 && <p className="muted">Press “Find Viral Ideas” to run the first agent pass.</p>}
        <div className="ideas">
          {ideas.map((x, i) => (
            <article className="idea" key={i}>
              <div className="score">{x.score}</div>
              <h3>{x.title}</h3>
              <p>{x.hook}</p>
              <small>{x.reason}</small>
              <button onClick={() => buildStory(x)} disabled={busy}>Build Story →</button>
            </article>
          ))}
        </div>
      </section>

      {project && (
        <>
          <section className="card">
            <h2>Selected Story</h2>
            <h3>{project.title}</h3>
            <p className="hook">HOOK: {project.hook}</p>
            <p>{project.story}</p>
          </section>

          <section className="card">
            <h2>8-Second Scene Plan</h2>
            <div className="scenes">
              {project.scenes.map((s) => (
                <article className="scene" key={s.number}>
                  <b>Scene {s.number} · 8 sec</b>
                  <p>{s.action}</p>
                  <p><strong>Dialogue/Narration:</strong> {s.dialogue}</p>
                  <pre>{s.prompt}</pre>
                </article>
              ))}
            </div>
          </section>

          <section className="card">
            <h2>YouTube Package</h2>
            <p><b>Title:</b> {project.seo.title}</p>
            <p><b>Description:</b> {project.seo.description}</p>
            <p><b>Hashtags:</b> {project.seo.hashtags.join(' ')}</p>
            <p><b>Tags:</b> {project.seo.tags.join(', ')}</p>
          </section>
        </>
      )}

      <footer>v1 orchestration demo • no publishing credentials are stored here</footer>
    </main>
  );
    }
