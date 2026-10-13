import React from 'react';
import { Input } from '@/components/ui/input';
import { CATEGORIES } from '../builderConstants';

export const MetadataTab = ({
  name,
  handleNameChange,
  code,
  setCode,
  category,
  setCategory,
  status,
  setStatus,
  description,
  setDescription,
  thumbnailUrl,
  setThumbnailUrl,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-slate-300 block mb-1">
          Template Name
        </label>
        <Input
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="e.g. Modern Executive Chronological"
          className="bg-slate-800 border-slate-700 text-white"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-300 block mb-1">
          Unique Code (Identifier)
        </label>
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="e.g. modern-exec-pro"
          className="bg-slate-800 border-slate-700 text-white font-mono text-xs"
        />
        <p className="text-[10px] text-slate-500 mt-1">
          Unique URL-safe code used in backend database and user template selection.
        </p>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-300 block mb-1">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none cursor-pointer"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-300 block mb-1">
          Publication Status
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'draft', label: 'Draft', color: 'text-amber-400 border-amber-500/30' },
            { id: 'published', label: 'Published', color: 'text-emerald-400 border-emerald-500/30' },
            { id: 'archived', label: 'Archived', color: 'text-slate-400 border-slate-700' },
          ].map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => setStatus(st.id)}
              className={`p-2 rounded-xl border text-center text-xs font-semibold uppercase tracking-wider transition-all ${
                status === st.id
                  ? `bg-slate-800 ring-2 ring-blue-500 ${st.color}`
                  : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-300 block mb-1">
          Description
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of when candidates should choose this layout..."
          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-300 block mb-1">
          Thumbnail Preview URL (Optional)
        </label>
        <Input
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
          placeholder="https://.../preview.jpg"
          className="bg-slate-800 border-slate-700 text-white text-xs font-mono"
        />
      </div>
    </div>
  );
};

export default MetadataTab;
