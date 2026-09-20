/**
 * Continuum: Interactive GitHub Repository Access Button
 * Positioned in the bottom-right viewport corner.
 * Directs users to the authoritative GitHub repository.
 */

import React, { useState } from 'react';
import { Github, ExternalLink, Edit2, Check } from 'lucide-react';
import { useUniverseStore } from '../../state/useUniverseStore';

export const GitHubButton: React.FC = () => {
  const { githubRepoUrl, setGithubRepoUrl, theme } = useUniverseStore();
  const [isEditing, setIsEditing] = useState(false);
  const [customUrl, setCustomUrl] = useState(githubRepoUrl);

  const isDark = theme === 'dark';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      setGithubRepoUrl(customUrl.trim());
    }
    setIsEditing(false);
  };

  return (
    <div
      id="continuum-github-container"
      className="fixed bottom-4 right-4 z-30 pointer-events-auto select-none flex items-center gap-1.5 animate-in fade-in duration-200"
    >
      {isEditing ? (
        <form
          onSubmit={handleSave}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-xl border shadow-xl ${
            isDark
              ? 'bg-[#0c0f17]/95 border-white/20 text-white'
              : 'bg-white/95 border-slate-300 text-slate-800 shadow-lg'
          }`}
        >
          <Github className="w-3.5 h-3.5 shrink-0 opacity-70" />
          <input
            type="url"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="https://github.com/..."
            className={`text-xs font-mono-math px-2 py-0.5 rounded outline-none border w-52 ${
              isDark
                ? 'bg-black/40 border-white/15 text-white placeholder-white/40 focus:border-blue-400'
                : 'bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
            }`}
            autoFocus
          />
          <button
            type="submit"
            title="Save repository URL"
            className="p-1 rounded-full hover:bg-emerald-500/20 text-emerald-400 transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
        </form>
      ) : (
        <div className="group flex items-center gap-1">
          <a
            id="continuum-github-link"
            href={githubRepoUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={`View Repository: ${githubRepoUrl}`}
            aria-label="View Continuum repository on GitHub"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-full backdrop-blur-xl border transition-all duration-200 shadow-lg hover:scale-[1.03] active:scale-95 ${
              isDark
                ? 'bg-[#0c0f17]/90 hover:bg-white/12 border-white/12 hover:border-white/25 text-white/90 hover:text-white shadow-[0_8px_24px_rgba(0,0,0,0.5)]'
                : 'bg-white/90 hover:bg-slate-100/90 border-slate-200/90 hover:border-slate-300 text-slate-800 hover:text-slate-950 shadow-[0_8px_24px_rgba(0,0,0,0.08)]'
            }`}
          >
            <Github className="w-4 h-4 transition-transform group-hover:rotate-6 text-current" />
            <span className="text-xs font-semibold tracking-wide font-mono-math">
              GitHub
            </span>
            <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
          </a>

          {/* Quick Edit Target Icon on Hover */}
          <button
            type="button"
            onClick={() => {
              setCustomUrl(githubRepoUrl);
              setIsEditing(true);
            }}
            title="Configure repository URL"
            aria-label="Edit repository URL"
            className={`opacity-0 group-hover:opacity-100 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-150 backdrop-blur-md border ${
              isDark
                ? 'bg-[#0c0f17]/80 hover:bg-white/15 text-white/60 hover:text-white border-white/10'
                : 'bg-white/80 hover:bg-slate-200 text-slate-500 hover:text-slate-900 border-slate-200'
            }`}
          >
            <Edit2 className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
