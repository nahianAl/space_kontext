/**
 * Selection management utilities
 */

export const selectSingleObject = (id: string): { selectedObjectIds: string[]; selectedFaces: import('../types').CADFaceSelection[] } => ({
  selectedObjectIds: [id],
  selectedFaces: [], // Clear face selection when selecting objects
});

export const selectMultipleObjects = (ids: string[]): { selectedObjectIds: string[]; selectedFaces: import('../types').CADFaceSelection[] } => ({
  selectedObjectIds: ids,
  selectedFaces: [], // Clear face selection when selecting objects
});

export const deselectObject = (id: string, selectedObjectIds: string[]): { selectedObjectIds: string[] } => ({
  selectedObjectIds: selectedObjectIds.filter(selectedId => selectedId !== id),
});

export const clearSelection = (): { selectedObjectIds: string[]; selectedFaces: import('../types').CADFaceSelection[] } => ({
  selectedObjectIds: [],
  selectedFaces: [],
});

export const toggleObjectSelection = (id: string, selectedObjectIds: string[]): { selectedObjectIds: string[] } => ({
  selectedObjectIds: selectedObjectIds.includes(id)
    ? selectedObjectIds.filter(selectedId => selectedId !== id)
    : [...selectedObjectIds, id],
});
