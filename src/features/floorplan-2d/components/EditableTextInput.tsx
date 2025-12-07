/**
 * Editable text input component for canvas annotations
 * Renders an HTML textarea positioned on the canvas for text and leader annotations
 * Supports multi-line text with Enter for new lines, Ctrl+Enter to confirm, Escape to cancel, and click-outside to confirm
 */
'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import type { Point } from '../types/wallGraph';

interface EditableTextInputProps {
  position: Point; // Canvas position
  initialValue?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
  stageRef: React.RefObject<any>; // Konva Stage ref for coordinate conversion
  placeholder?: string;
  multiline?: boolean; // Whether to use textarea for multi-line support
}

export const EditableTextInput: React.FC<EditableTextInputProps> = ({
  position,
  initialValue = '',
  onConfirm,
  onCancel,
  stageRef,
  placeholder = 'Enter text...',
  multiline = true,
}) => {
  const [value, setValue] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Calculate screen position from canvas position (memoized to prevent re-renders)
  const screenPos = useMemo(() => {
    if (!stageRef.current) {
      return { x: position[0], y: position[1] };
    }

    const stage = stageRef.current;
    const scale = stage.scaleX(); // Assuming uniform scale
    const stagePos = stage.position();
    const containerRect = stage.container().getBoundingClientRect();

    // Convert world coordinates to screen coordinates
    const screenX = containerRect.left + (position[0] * scale) + stagePos.x;
    const screenY = containerRect.top + (position[1] * scale) + stagePos.y;

    return { x: screenX, y: screenY };
  }, [position, stageRef]);

  // Auto-focus on mount only (not on every value change)
  useEffect(() => {
    const element = multiline ? textareaRef.current : inputRef.current;
    if (element) {
      // Only focus on initial mount, not on every render
      element.focus();
      if (multiline && textareaRef.current) {
        // For textarea, place cursor at end
        const len = initialValue.length;
        textareaRef.current.setSelectionRange(len, len);
      } else if (!multiline && inputRef.current) {
        // For input, select all
        inputRef.current.select();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (multiline) {
      // For textarea: Enter creates new line, Ctrl+Enter or Shift+Enter confirms
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey || e.shiftKey)) {
        e.preventDefault();
        if (value.trim()) {
          onConfirm(value);
        } else {
          onCancel();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
      // Otherwise, Enter creates a new line (default textarea behavior)
    } else {
      // For input: Enter confirms, Escape cancels
      if (e.key === 'Enter') {
        e.preventDefault();
        if (value.trim()) {
          onConfirm(value.trim());
        } else {
          onCancel();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const element = multiline ? textareaRef.current : inputRef.current;
      if (element && !element.contains(e.target as Node)) {
        // Only confirm if there's actual content
        const currentValue = element.value;
        if (currentValue.trim()) {
          onConfirm(currentValue);
        } else {
          // Cancel if empty - don't create empty text annotations
          onCancel();
        }
      }
    };

    // Use a small delay to avoid immediate trigger on the click that opened the input
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onConfirm, onCancel, multiline]); // Removed value from dependencies to prevent re-renders

  const baseStyle: React.CSSProperties = {
    padding: '6px 10px',
    fontSize: '12px',
    fontFamily: 'Arial, sans-serif',
    border: '2px solid #0f7787',
    borderRadius: '4px',
    outline: 'none',
    minWidth: '150px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    resize: multiline ? 'both' : 'none',
    overflow: multiline ? 'auto' : 'hidden',
  };

  return (
    <div
      style={{
        position: 'fixed',
        left: `${screenPos.x}px`,
        top: `${screenPos.y}px`,
        zIndex: 10000,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'auto',
      }}
    >
      {multiline ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          style={{
            ...baseStyle,
            minHeight: '60px',
            minWidth: '200px',
            pointerEvents: 'auto',
          }}
        />
      ) : (
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          style={{
            ...baseStyle,
            pointerEvents: 'auto',
          }}
        />
      )}
    </div>
  );
};
