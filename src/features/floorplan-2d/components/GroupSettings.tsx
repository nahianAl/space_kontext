/**
 * Group tool settings component
 * Allows creating, managing, and deleting shape groups
 * Displayed in the SettingsPanel when group tool is active
 */
'use client';

import React from 'react';
import { useGroupStore } from '../store/groupStore';
import { useShapesStore } from '../store/shapesStore';
import { Trash2 } from 'lucide-react';

export const GroupSettings: React.FC = () => {
  const groups = useGroupStore((state) => state.groups);
  const selectedGroupId = useGroupStore((state) => state.selectedGroupId);
  const createGroup = useGroupStore((state) => state.createGroup);
  const deleteGroup = useGroupStore((state) => state.deleteGroup);
  const selectGroup = useGroupStore((state) => state.selectGroup);

  const selectedShapeIds = useShapesStore((state) => state.selectedShapeIds);
  const selectShapes = useShapesStore((state) => state.selectShapes);

  const handleCreateGroup = () => {
    if (selectedShapeIds.length < 2) {
      alert('Please select at least 2 shapes to create a group');
      return;
    }

    const groupName = prompt('Enter group name (optional):');
    createGroup(selectedShapeIds, groupName || undefined);
  };

  const handleSelectGroup = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (group) {
      selectGroup(groupId);
      selectShapes(group.shapeIds);
    }
  };

  const handleDeleteGroup = (groupId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this group? (Shapes will not be deleted)')) {
      deleteGroup(groupId);
    }
  };

  return (
    <div className="px-4 py-2 space-y-4">
      {/* Create Group Button */}
      <div>
        <button
          onClick={handleCreateGroup}
          disabled={selectedShapeIds.length < 2}
          className="w-full px-3 py-2 bg-[#0f7787] hover:bg-[#0d5f6b] disabled:bg-gray-700 disabled:text-gray-500 text-white rounded text-sm font-medium transition-colors"
        >
          Create Group ({selectedShapeIds.length} selected)
        </button>
      </div>

      {/* Groups List */}
      <div>
        <div className="text-xs text-gray-400 mb-2">Groups:</div>
        {groups.length === 0 ? (
          <div className="text-xs text-gray-500 italic py-2">
            No groups yet. Select multiple shapes and click &quot;Create Group&quot;.
          </div>
        ) : (
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {groups.map(group => (
              <div
                key={group.id}
                className={`flex items-center justify-between p-2 rounded text-xs ${
                  selectedGroupId === group.id
                    ? 'bg-[#0f7787] text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                } cursor-pointer transition-colors`}
                onClick={() => handleSelectGroup(group.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">
                    {group.name || `Group ${group.id.slice(-6)}`}
                  </div>
                  <div className="text-[10px] opacity-75">
                    {group.shapeIds.length} shapes
                  </div>
                </div>
                <button
                  onClick={(e) => handleDeleteGroup(group.id, e)}
                  className="ml-2 p-1 hover:bg-red-600 rounded transition-colors flex-shrink-0"
                  aria-label="Delete group"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className="pt-2 border-t border-gray-800">
        <div className="text-xs text-gray-400 space-y-1">
          <div>• Select shapes (Shift+Click or drag)</div>
          <div>• Click &quot;Create Group&quot;</div>
          <div>• Grouped shapes move together</div>
          <div>• Click a group to select all shapes</div>
        </div>
      </div>
    </div>
  );
};
