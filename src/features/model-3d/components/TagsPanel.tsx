/**
 * Tags Panel Component
 * SketchUp-style tag management for organizing and controlling visibility of CAD objects
 * Allows creating tags, assigning objects, and toggling visibility
 */
'use client';

import React, { useState } from 'react';
import { useCADToolsStore } from '../store/cadToolsStore';

export const TagsPanel = () => {
  const tags = useCADToolsStore((state) => state.tags);
  const selectedObjectIds = useCADToolsStore((state) => state.selectedObjectIds);
  const createTag = useCADToolsStore((state) => state.createTag);
  const deleteTag = useCADToolsStore((state) => state.deleteTag);
  const updateTag = useCADToolsStore((state) => state.updateTag);
  const toggleTagVisibility = useCADToolsStore((state) => state.toggleTagVisibility);
  const assignObjectsToTag = useCADToolsStore((state) => state.assignObjectsToTag);
  const removeObjectsFromTag = useCADToolsStore((state) => state.removeObjectsFromTag);

  const [newTagName, setNewTagName] = useState('');
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleCreateTag = () => {
    if (!newTagName.trim()) {
      return;
    }

    createTag(newTagName.trim());
    setNewTagName('');
  };

  const handleStartEdit = (tagId: string, currentName: string) => {
    setEditingTagId(tagId);
    setEditingName(currentName);
  };

  const handleSaveEdit = (tagId: string) => {
    if (!editingName.trim()) {
      return;
    }

    updateTag(tagId, { name: editingName.trim() });
    setEditingTagId(null);
    setEditingName('');
  };

  const handleCancelEdit = () => {
    setEditingTagId(null);
    setEditingName('');
  };

  const handleAssignSelected = (tagId: string) => {
    if (selectedObjectIds.length > 0) {
      assignObjectsToTag(selectedObjectIds, tagId);
    }
  };

  const handleRemoveSelected = (tagId: string) => {
    if (selectedObjectIds.length > 0) {
      removeObjectsFromTag(selectedObjectIds, tagId);
    }
  };

  return (
    <div className="h-full w-full bg-gray-900 text-white p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Tags</h2>

      {/* Create new tag */}
      <div className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleCreateTag();
              }
            }}
            placeholder="New tag name..."
            className="flex-1 px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-orange-500"
          />
          <button
            onClick={handleCreateTag}
            disabled={!newTagName.trim()}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </div>

      {/* Tags list */}
      <div className="space-y-2">
        {tags.length === 0 && (
          <p className="text-gray-500 text-sm italic">No tags yet. Create one to get started!</p>
        )}

        {tags.map((tag) => (
          <div
            key={tag.id}
            className="bg-gray-800 rounded-lg p-3 border border-gray-700"
          >
            {/* Tag header */}
            <div className="flex items-center gap-2 mb-2">
              {/* Visibility toggle */}
              <button
                onClick={() => toggleTagVisibility(tag.id)}
                className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded hover:bg-gray-700"
                title={tag.visible ? 'Hide objects' : 'Show objects'}
              >
                {tag.visible ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>

              {/* Color indicator */}
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: tag.color }}
              />

              {/* Tag name */}
              {editingTagId === tag.id ? (
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveEdit(tag.id);
                    }
                    if (e.key === 'Escape') {
                      handleCancelEdit();
                    }
                  }}
                  onBlur={() => handleSaveEdit(tag.id)}
                  className="flex-1 px-2 py-1 bg-gray-700 text-white rounded border border-orange-500 focus:outline-none"
                  autoFocus
                />
              ) : (
                <div
                  className="flex-1 font-medium cursor-pointer hover:text-orange-500"
                  onClick={() => handleStartEdit(tag.id, tag.name)}
                >
                  {tag.name}
                </div>
              )}

              {/* Object count */}
              <span className="text-gray-400 text-sm">
                ({tag.objectIds.length})
              </span>

              {/* Delete button */}
              <button
                onClick={() => deleteTag(tag.id)}
                className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded hover:bg-red-900/50 hover:text-red-500"
                title="Delete tag"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Assign/Remove buttons */}
            {selectedObjectIds.length > 0 && (
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleAssignSelected(tag.id)}
                  className="flex-1 px-3 py-1 bg-green-700 hover:bg-green-600 text-white text-xs rounded"
                  title="Assign selected objects to this tag"
                >
                  Assign ({selectedObjectIds.length})
                </button>
                {tag.objectIds.some(id => selectedObjectIds.includes(id)) && (
                  <button
                    onClick={() => handleRemoveSelected(tag.id)}
                    className="flex-1 px-3 py-1 bg-red-700 hover:bg-red-600 text-white text-xs rounded"
                    title="Remove selected objects from this tag"
                  >
                    Remove
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Help text */}
      <div className="mt-6 p-3 bg-gray-800 rounded-lg border border-gray-700">
        <h3 className="text-sm font-semibold mb-2">How to use Tags:</h3>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• Create tags to organize your objects</li>
          <li>• Select objects and click "Assign" to tag them</li>
          <li>• Toggle the eye icon to show/hide tagged objects</li>
          <li>• Click a tag name to rename it</li>
        </ul>
      </div>
    </div>
  );
};
