/**
 * Dimension display component showing Length, Width, and Angle at the bottom of the settings panel
 * Displays dimensions for selected walls, openings, or active measurements
 * Supports both imperial (ft/in) and metric (m/cm) unit systems
 */
'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useWallGraphStoreContext } from '../context/WallGraphStoreContext';
import { useMeasureStore } from '../store/measureStore';
import { useShapesStore } from '../store/shapesStore';
import { useCADToolsStore } from '@/features/model-3d/store/cadToolsStore';
import {
  pixelsToMeters,
  metersToPixels,
  formatMetersAsImperial,
  formatMetersAsMetric,
  metersToInches,
  metersToCentimeters,
  inchesToMeters,
  centimetersToMeters,
  feetToMeters,
  parseImperialInput,
  parseMetricInput,
} from '@/lib/units/unitsSystem';

// Format meters as imperial (wrapper for consistency)
const formatImperial = (meters: number): string => {
  return formatMetersAsImperial(meters);
};

// Format meters as metric (wrapper for consistency)
const formatMetric = (meters: number): string => {
  return formatMetersAsMetric(meters);
};

const normalizeAngleValue = (radians: number): number => {
  const degrees = (radians * 180) / Math.PI;
  return ((degrees % 360) + 360) % 360;
};

interface DimensionBoxProps {
  label: string;
  value: string;
  showDivider?: boolean;
  editable?: boolean;
  inputValue?: string;
  onInputChange?: (value: string) => void;
  onCommit?: () => void;
  onCancel?: () => void;
  unitLabel?: string;
  disabled?: boolean;
}

const DimensionBox = ({
  label,
  value,
  showDivider = false,
  editable = false,
  inputValue = '',
  onInputChange,
  onCommit,
  onCancel,
  unitLabel,
  disabled = false,
}: DimensionBoxProps) => {
  const [showLabel, setShowLabel] = useState(false);

  return (
    <div 
      className="relative flex-1 flex items-center justify-center px-2 py-1.5"
      onMouseEnter={() => setShowLabel(true)}
      onMouseLeave={() => setShowLabel(false)}
    >
      {showLabel && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap z-10">
          {label}
        </div>
      )}
      {editable && !disabled ? (
        <div className="flex items-center gap-1">
          <input
            className="w-16 bg-transparent text-xs font-medium text-center font-mono border border-[#EF4444] rounded px-1 py-0.5 text-[#FCA5A5] focus:outline-none focus:ring-1 focus:ring-[#EF4444]"
            value={inputValue}
            onChange={(event) => onInputChange?.(event.target.value)}
            onBlur={() => onCommit?.()}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                onCommit?.();
              }
              if (event.key === 'Escape') {
                event.preventDefault();
                onCancel?.();
              }
            }}
            placeholder="--"
            inputMode="decimal"
            disabled={disabled}
          />
          {unitLabel ? (
            <span className="text-[10px] text-gray-400">{unitLabel}</span>
          ) : null}
        </div>
      ) : (
        <div className="text-xs font-medium text-center font-mono" style={{ color: '#FCA5A5' }}>
          {value}
        </div>
      )}
      {showDivider && (
        <div className="absolute right-0 top-2 bottom-2 w-px bg-gray-600" />
      )}
    </div>
  );
};

export const DimensionDisplay: React.FC = () => {
  const useWallGraphStore = useWallGraphStoreContext();
  const selectedWallId = useWallGraphStore((state) => state.selectedWallId);
  const selectedOpeningId = useWallGraphStore((state) => state.selectedOpeningId);
  const selectedOpeningIds = useWallGraphStore((state) => state.selectedOpeningIds ?? []);
  const graph = useWallGraphStore((state) => state.graph);
  const unitSystem = useWallGraphStore((state) => state.unitSystem);
  const updateSelectedOpeningsDimensions = useWallGraphStore((state) => state.updateSelectedOpeningsDimensions);
  const updateWallThickness = useWallGraphStore((state) => state.updateWallThickness);
  const updateWallGeometry = useWallGraphStore((state) => state.updateWallGeometry);
  const isDrawing = useWallGraphStore((state) => state.isDrawing);
  const drawingStartPoint = useWallGraphStore((state) => state.drawingStartPoint);
  const drawingCurrentPoint = useWallGraphStore((state) => state.drawingCurrentPoint);
  const wallThickness = useWallGraphStore((state) => state.wallThickness);
  const wallHeightValue = useWallGraphStore((state) => state.wallHeight);
  const setWallLength = useWallGraphStore((state) => state.setWallLength);
  const setWallAngle = useWallGraphStore((state) => state.setWallAngle);
  
  // Shape drawing state
  const isShapeDrawing = useShapesStore((state) => state.isShapeDrawing);
  const activeShapeTool = useShapesStore((state) => state.activeShapeTool);
  const shapeDrawingData = useShapesStore((state) => state.shapeDrawingData);
  
  // Measure tool state
  const isMeasureActive = useMeasureStore((state) => state.isMeasureActive);
  const startPoint = useMeasureStore((state) => state.startPoint);
  const endPoint = useMeasureStore((state) => state.endPoint);
  const currentPoint = useMeasureStore((state) => state.currentPoint);
  const isMeasuring = useMeasureStore((state) => state.isMeasuring);
  const setMeasureLength = useMeasureStore((state) => state.setMeasureLength);

  // 3D CAD tool state
  const activeTool3D = useCADToolsStore((state) => state.activeTool);
  const pushPullState = useCADToolsStore((state) => state.pushPullState);
  const rectanglePreview = useCADToolsStore((state) => state.rectanglePreview);
  const circlePreview = useCADToolsStore((state) => state.circlePreview);
  const tapeState = useCADToolsStore((state) => state.tapeState);
  const setRectanglePreview = useCADToolsStore((state) => state.setRectanglePreview);
  const setCirclePreview = useCADToolsStore((state) => state.setCirclePreview);
  const updatePushPullDistance = useCADToolsStore((state) => state.updatePushPullDistance);
  const setTapeDistance = useCADToolsStore((state) => state.setTapeDistance);
  const selectedCADObjectIds = useCADToolsStore((state) => state.selectedObjectIds);
  const cadObjects = useCADToolsStore((state) => state.objects);
  const updateObject = useCADToolsStore((state) => state.updateObject);

  const selectedOpeningData = useMemo(() => {
    if (!selectedOpeningId) {
      return null;
    }
    for (const wall of Object.values(graph.edges)) {
      const opening = wall.openings?.find(o => o.id === selectedOpeningId);
      if (opening) {
        return { wall, opening } as const;
      }
    }
    return null;
  }, [graph.edges, selectedOpeningId]);
  
  const selectedWall = useMemo(() => {
    if (!selectedWallId) {
      return null;
    }
    return graph.edges[selectedWallId] ?? null;
  }, [graph.edges, selectedWallId]);


  const openingNumericValues = useMemo(() => {
    if (!selectedOpeningData) {
      return null;
    }

    const { opening } = selectedOpeningData;
    const storedUnitSystem = opening.unitSystem ?? unitSystem;

    // opening.width is already in METERS
    const widthValue = (() => {
      if (opening.userWidth !== undefined) {
        // Convert user width to meters, then to display units
        const meters = storedUnitSystem === 'imperial'
          ? inchesToMeters(opening.userWidth)
          : centimetersToMeters(opening.userWidth);
        return unitSystem === 'imperial'
          ? metersToInches(meters)
          : metersToCentimeters(meters);
      }
      // opening.width is already in meters, convert to display units
      return unitSystem === 'imperial'
        ? metersToInches(opening.width)
        : metersToCentimeters(opening.width);
    })();

    const heightValue = (() => {
      if (opening.userHeight !== undefined) {
        // Convert user height to meters, then to display units
        const meters = storedUnitSystem === 'imperial'
          ? inchesToMeters(opening.userHeight)
          : centimetersToMeters(opening.userHeight);
        return unitSystem === 'imperial'
          ? metersToInches(meters)
          : metersToCentimeters(meters);
      }
      if (opening.height !== undefined) {
        // opening.height is already in meters, convert to display units
        return unitSystem === 'imperial'
          ? metersToInches(opening.height)
          : metersToCentimeters(opening.height);
      }
      return undefined;
    })();

    return {
      width: widthValue,
      height: heightValue,
      type: opening.type,
    } as const;
  }, [selectedOpeningData, unitSystem]);

  const wallNumericValues = useMemo(() => {
    if (!selectedWall) {
      return {
        length: undefined,
        thickness: undefined,
        angle: undefined,
        height: undefined,
      } as const;
    }

    // selectedWall.length is already in METERS
    const lengthValue = unitSystem === 'imperial'
      ? metersToInches(selectedWall.length)
      : metersToCentimeters(selectedWall.length);

    // selectedWall.thickness is already in METERS
    const thicknessValue = unitSystem === 'imperial'
      ? metersToInches(selectedWall.thickness)
      : metersToCentimeters(selectedWall.thickness);

    const angleValue = normalizeAngleValue(selectedWall.angle);
    
    // wallHeightValue is already in METERS (per units fix plan)
    const heightValue = unitSystem === 'imperial'
      ? metersToInches(wallHeightValue)
      : metersToCentimeters(wallHeightValue);

    return {
      length: lengthValue,
      thickness: thicknessValue,
      angle: angleValue,
      height: heightValue,
    } as const;
  }, [selectedWall, unitSystem, wallHeightValue]);

  const [heightInput, setHeightInput] = useState('');
  const [lengthInput, setLengthInput] = useState('');
  const [angleInput, setAngleInput] = useState('');

  // Get selected CAD object
  const selectedCADObject = useMemo(() => {
    if (selectedCADObjectIds.length === 1) {
      return cadObjects.find(obj => obj.id === selectedCADObjectIds[0]) ?? null;
    }
    return null;
  }, [selectedCADObjectIds, cadObjects]);

  const formatValueForInput = useCallback((value: number | undefined) => {
    if (value === undefined || Number.isNaN(value)) {
      return '';
    }
    const rounded = Math.round(value * 100) / 100;
    return Number.isInteger(rounded) ? `${rounded}` : rounded.toString();
  }, []);

  // Parse user input with units (wrapper for imported parse functions)
  const parseUserInput = useCallback((input: string): number | null => {
    if (unitSystem === 'imperial') {
      return parseImperialInput(input);
    }
    return parseMetricInput(input);
  }, [unitSystem]);

  const measurementInfo = useMemo(() => {
    if (!isMeasureActive || !startPoint) {
      return null;
    }

    const referencePoint = (isMeasuring && currentPoint)
      ? currentPoint
      : endPoint;

    if (!referencePoint) {
      return null;
    }

    const dx = referencePoint[0] - startPoint[0];
    const dy = referencePoint[1] - startPoint[1];
    const distancePixels = Math.sqrt(dx * dx + dy * dy);
    const distanceMeters = pixelsToMeters(distancePixels); // Convert to meters

    return {
      startPoint,
      referencePoint,
      dx,
      dy,
      distancePixels,
      distanceMeters, // Store meters instead of mixed units
    };
  }, [isMeasureActive, isMeasuring, startPoint, currentPoint, endPoint]);

  const allowMeasurementEditing = Boolean(measurementInfo);

  const allowOpeningEditing = Boolean(
    selectedOpeningId &&
    !isMeasureActive &&
    selectedOpeningData &&
    selectedOpeningIds.length <= 1
  );

  const allowWallEditing = Boolean(
    selectedWall &&
    !isMeasureActive &&
    !allowOpeningEditing
  );

  const resetLengthInput = useCallback(() => {
    // Handle 3D Rectangle tool (width in meters -> display units)
    if (activeTool3D === 'rectangle' && rectanglePreview.active) {
      const value = unitSystem === 'imperial'
        ? rectanglePreview.width * 39.3701 // meters to inches
        : rectanglePreview.width * 100; // meters to cm
      setLengthInput(formatValueForInput(value));
      return;
    }

    // Handle 3D Circle tool (radius in meters -> display units)
    if (activeTool3D === 'circle' && circlePreview.active) {
      const value = unitSystem === 'imperial'
        ? circlePreview.radius * 39.3701 // meters to inches
        : circlePreview.radius * 100; // meters to cm
      setLengthInput(formatValueForInput(value));
      return;
    }

    // Handle 3D Push-Pull tool (distance in meters -> display units)
    if (activeTool3D === 'push-pull' && pushPullState.active) {
      const value = unitSystem === 'imperial'
        ? Math.abs(pushPullState.distance) * 39.3701 // meters to inches
        : Math.abs(pushPullState.distance) * 100; // meters to cm
      setLengthInput(formatValueForInput(value));
      return;
    }

    // Handle 3D Tape Measure tool (distance in meters -> display units)
    if (activeTool3D === 'tape' && tapeState.active && tapeState.startPoint && tapeState.endPoint) {
      const value = unitSystem === 'imperial'
        ? tapeState.distance * 39.3701 // meters to inches
        : tapeState.distance * 100; // meters to cm
      setLengthInput(formatValueForInput(value));
      return;
    }

    // Handle selected CAD object (width in meters -> display units)
    if (selectedCADObject && selectedCADObject.mesh.geometry instanceof THREE.BoxGeometry) {
      const params = selectedCADObject.mesh.geometry.parameters;
      const width = (params.width ?? 1) * selectedCADObject.scale[0];
      const value = unitSystem === 'imperial'
        ? width * 39.3701 // meters to inches
        : width * 100; // meters to cm
      setLengthInput(formatValueForInput(value));
      return;
    }

    if (measurementInfo) {
      // Use distanceMeters converted to display units
      const value = unitSystem === 'imperial'
        ? measurementInfo.distanceMeters * 39.3701 // meters to inches
        : measurementInfo.distanceMeters * 100; // meters to cm
      setLengthInput(formatValueForInput(value));
      return;
    }

    if (allowOpeningEditing) {
      setLengthInput(formatValueForInput(openingNumericValues?.height));
      return;
    }

    if (allowWallEditing) {
      setLengthInput(formatValueForInput(wallNumericValues.length));
      return;
    }

    setLengthInput('');
  }, [
    activeTool3D,
    rectanglePreview,
    circlePreview,
    pushPullState,
    tapeState,
    selectedCADObject,
    unitSystem,
    formatValueForInput,
    allowOpeningEditing,
    allowWallEditing,
    measurementInfo,
    openingNumericValues?.height,
    wallNumericValues.length,
  ]);

  useEffect(() => {
    resetLengthInput();
  }, [resetLengthInput]);

  const resetHeightInput = useCallback(() => {
    // Handle 3D Rectangle tool (height in meters -> display units)
    if (activeTool3D === 'rectangle' && rectanglePreview.active) {
      const value = unitSystem === 'imperial'
        ? rectanglePreview.height * 39.3701 // meters to inches
        : rectanglePreview.height * 100; // meters to cm
      setHeightInput(formatValueForInput(value));
      return;
    }

    // Handle 3D Circle tool (diameter in meters -> display units)
    if (activeTool3D === 'circle' && circlePreview.active) {
      const value = unitSystem === 'imperial'
        ? (circlePreview.radius * 2) * 39.3701 // meters to inches
        : (circlePreview.radius * 2) * 100; // meters to cm
      setHeightInput(formatValueForInput(value));
      return;
    }

    // Handle selected CAD object (height in meters -> display units)
    if (selectedCADObject && selectedCADObject.mesh.geometry instanceof THREE.BoxGeometry) {
      const params = selectedCADObject.mesh.geometry.parameters;
      const height = (params.height ?? 1) * selectedCADObject.scale[1];
      const value = unitSystem === 'imperial'
        ? height * 39.3701 // meters to inches
        : height * 100; // meters to cm
      setHeightInput(formatValueForInput(value));
      return;
    }

    if (allowOpeningEditing) {
      setHeightInput(formatValueForInput(openingNumericValues?.height));
      return;
    }

    if (allowWallEditing) {
      setHeightInput(formatValueForInput(wallNumericValues.height));
      return;
    }

    setHeightInput('');
  }, [
    activeTool3D,
    rectanglePreview,
    circlePreview,
    selectedCADObject,
    unitSystem,
    formatValueForInput,
    allowOpeningEditing,
    allowWallEditing,
    openingNumericValues?.height,
    wallNumericValues.height,
  ]);

  useEffect(() => {
    resetHeightInput();
  }, [resetHeightInput]);

  const resetAngleInput = useCallback(() => {
    if (allowWallEditing) {
      setAngleInput(formatValueForInput(wallNumericValues.angle));
      return;
    }
    setAngleInput('');
  }, [allowWallEditing, formatValueForInput, wallNumericValues.angle]);

  useEffect(() => {
    resetAngleInput();
  }, [resetAngleInput]);

  const handleHeightCommit = useCallback(() => {
    // Handle 3D Rectangle tool (height)
    if (activeTool3D === 'rectangle' && rectanglePreview.active) {
      const meters = parseMetricInput(heightInput);
      if (meters !== null && meters > 0) {
        setRectanglePreview({
          ...rectanglePreview,
          height: meters,
        });
      }
      return;
    }

    // Handle 3D Circle tool (diameter - convert to radius)
    if (activeTool3D === 'circle' && circlePreview.active) {
      const meters = parseMetricInput(heightInput);
      if (meters !== null && meters > 0) {
        setCirclePreview({
          ...circlePreview,
          radius: meters / 2, // Convert diameter to radius
        });
      }
      return;
    }

    // Handle selected CAD object (scale height)
    if (selectedCADObject && selectedCADObject.mesh.geometry instanceof THREE.BoxGeometry) {
      const meters = parseMetricInput(heightInput);
      if (meters !== null && meters > 0) {
        const params = selectedCADObject.mesh.geometry.parameters;
        const currentHeight = params.height ?? 1;
        const scale = meters / currentHeight;
        updateObject(selectedCADObject.id, {
          scale: [selectedCADObject.scale[0], scale, selectedCADObject.scale[2]],
        });
      }
      return;
    }

    const parsed = parseFloat(heightInput);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      resetHeightInput();
      return;
    }

    if (allowOpeningEditing && selectedOpeningId) {
      updateSelectedOpeningsDimensions(undefined, parsed);
      setHeightInput(formatValueForInput(parsed));
      return;
    }

    resetHeightInput();
  }, [
    activeTool3D,
    rectanglePreview,
    circlePreview,
    selectedCADObject,
    heightInput,
    parseMetricInput,
    setRectanglePreview,
    setCirclePreview,
    updateObject,
    allowOpeningEditing,
    formatValueForInput,
    resetHeightInput,
    selectedOpeningId,
    updateSelectedOpeningsDimensions,
  ]);

  const handleLengthCommit = useCallback(() => {
    // Handle 3D Rectangle tool (width)
    if (activeTool3D === 'rectangle' && rectanglePreview.active) {
      const meters = parseMetricInput(lengthInput);
      if (meters !== null && meters > 0) {
        setRectanglePreview({
          ...rectanglePreview,
          width: meters,
        });
      }
      return;
    }

    // Handle 3D Circle tool (radius)
    if (activeTool3D === 'circle' && circlePreview.active) {
      const meters = parseMetricInput(lengthInput);
      if (meters !== null && meters > 0) {
        setCirclePreview({
          ...circlePreview,
          radius: meters,
        });
      }
      return;
    }

    // Handle 3D Push-Pull tool (distance)
    if (activeTool3D === 'push-pull' && pushPullState.active) {
      const meters = parseMetricInput(lengthInput);
      if (meters !== null) {
        const sign = pushPullState.distance >= 0 ? 1 : -1;
        updatePushPullDistance(meters * sign);
      }
      return;
    }

    // Handle 3D Tape Measure tool (distance editing)
    if (activeTool3D === 'tape' && tapeState.active && tapeState.startPoint && tapeState.endPoint) {
      const meters = parseMetricInput(lengthInput);
      if (meters !== null && meters > 0) {
        setTapeDistance(meters);
      }
      return;
    }

    // Handle selected CAD object (scale width)
    if (selectedCADObject && selectedCADObject.mesh.geometry instanceof THREE.BoxGeometry) {
      const meters = parseMetricInput(lengthInput);
      if (meters !== null && meters > 0) {
        const params = selectedCADObject.mesh.geometry.parameters;
        const currentWidth = params.width ?? 1;
        const scale = meters / currentWidth;
        updateObject(selectedCADObject.id, {
          scale: [scale, selectedCADObject.scale[1], selectedCADObject.scale[2]],
        });
      }
      return;
    }

    const parsed = parseFloat(lengthInput);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      resetLengthInput();
      return;
    }

    if (measurementInfo) {
      // parsed is in display units (inches or cm), convert to meters then to pixels
      const meters = unitSystem === 'imperial'
        ? inchesToMeters(parsed)
        : centimetersToMeters(parsed);
      const lengthPixels = metersToPixels(meters);
      setMeasureLength(lengthPixels);
      return;
    }

    if (allowWallEditing && selectedWallId) {
      // parsed is in display units (feet or meters), convert to meters then to pixels
      const meters = unitSystem === 'imperial'
        ? feetToMeters(parsed)
        : parsed; // Already in meters
      const lengthPixels = metersToPixels(meters);
      setWallLength(selectedWallId, lengthPixels);
      setLengthInput(formatValueForInput(parsed));
      return;
    }

    if (allowOpeningEditing && selectedOpeningId) {
      // parsed is in display units (inches or cm), pass as-is (opening slice will convert)
      updateSelectedOpeningsDimensions(undefined, parsed);
      setLengthInput(formatValueForInput(parsed));
      return;
    }

    resetLengthInput();
  }, [
    activeTool3D,
    rectanglePreview,
    circlePreview,
    pushPullState,
    tapeState,
    selectedCADObject,
    lengthInput,
    parseMetricInput,
    setRectanglePreview,
    setCirclePreview,
    updatePushPullDistance,
    setTapeDistance,
    updateObject,
    allowOpeningEditing,
    allowWallEditing,
    formatValueForInput,
    measurementInfo,
    resetLengthInput,
    selectedOpeningId,
    selectedWallId,
    setMeasureLength,
    setWallLength,
    unitSystem,
    updateSelectedOpeningsDimensions,
  ]);

  const handleAngleCommit = useCallback(() => {
    if (!allowWallEditing || !selectedWallId) {
      resetAngleInput();
      return;
    }

    const parsed = parseFloat(angleInput);
    if (!Number.isFinite(parsed)) {
      resetAngleInput();
      return;
    }

    const normalizedDegrees = ((parsed % 360) + 360) % 360;
    const angleRadians = (normalizedDegrees * Math.PI) / 180;
    setWallAngle(selectedWallId, angleRadians);
    setAngleInput(formatValueForInput(normalizedDegrees));
  }, [
    allowWallEditing,
    angleInput,
    formatValueForInput,
    resetAngleInput,
    selectedWallId,
    setWallAngle,
  ]);

  const unitLabel = unitSystem === 'imperial' ? 'in' : 'cm';
  const lengthUnitLabel = allowWallEditing
    ? (unitSystem === 'imperial' ? 'ft' : 'm')
    : unitLabel;
  const heightUnitLabel = unitLabel;
  const angleUnitLabel = '°';

  // Check if 3D tools are being used or 3D object is selected
  const is3DToolActive = (activeTool3D === 'rectangle' && rectanglePreview.active) ||
                         (activeTool3D === 'circle' && circlePreview.active) ||
                         (activeTool3D === 'push-pull' && pushPullState.active) ||
                         (activeTool3D === 'tape' && tapeState.active && tapeState.startPoint && tapeState.endPoint);
  const is3DObjectSelected = Boolean(selectedCADObject);

  const allowLengthEditing = Boolean(allowOpeningEditing || allowMeasurementEditing || allowWallEditing || is3DToolActive || is3DObjectSelected);
  const allowHeightEditing = Boolean(allowOpeningEditing || is3DToolActive || is3DObjectSelected);
  const allowAngleEditing = allowWallEditing;

  const formatLinearDimension = useCallback((meters: number) => {
    if (!Number.isFinite(meters)) {
      return '--';
    }
    if (unitSystem === 'imperial') {
      return formatMetersAsImperial(meters);
    }
    return formatMetersAsMetric(meters);
  }, [unitSystem]);

  const formatHeight = useCallback(
    (valueMeters: number) => {
      if (!Number.isFinite(valueMeters)) {
        return '--';
      }
      // valueMeters is already in METERS (per units fix plan)
      // Format using the standard formatting functions
      if (unitSystem === 'imperial') {
        return formatImperial(valueMeters);
      }
      return formatMetric(valueMeters);
    },
    [unitSystem, formatImperial, formatMetric]
  );

  const normalizeAngle = (radians: number) => normalizeAngleValue(radians).toFixed(1);

  const dimensions = useMemo(() => {
    if (measurementInfo) {
      return {
        length: formatLinearDimension(measurementInfo.distanceMeters),
        height: '--',
        angle: '--',
      };
    }

    // Show live dimensions while drawing walls
    if (isDrawing && drawingStartPoint && drawingCurrentPoint) {
      const [x1, y1] = drawingStartPoint;
      const [x2, y2] = drawingCurrentPoint;
      const dx = x2 - x1;
      const dy = y2 - y1;
      const distancePixels = Math.sqrt(dx * dx + dy * dy);
      const distanceMeters = pixelsToMeters(distancePixels);
      const angle = normalizeAngle(Math.atan2(dy, dx));

      return {
        length: formatLinearDimension(distanceMeters),
        height: formatHeight(wallHeightValue),
        angle: `${angle}°`,
      };
    }

    // Show live dimensions while drawing shapes
    if (isShapeDrawing && activeShapeTool && shapeDrawingData) {
      const current = shapeDrawingData.currentPoint;
      const start = shapeDrawingData.startPoint;
      const points = shapeDrawingData.points ?? [];
      const trianglePoints = shapeDrawingData.trianglePoints ?? [];

      const lastPoint = (() => {
        if (activeShapeTool === 'polyline' && points.length > 0) {
          return points[points.length - 1];
        }
        if (activeShapeTool === 'triangle' && trianglePoints.length > 0) {
          return trianglePoints[trianglePoints.length - 1];
        }
        return start ?? null;
      })();

      if (activeShapeTool === 'circle' && shapeDrawingData.center && current) {
        const [cx, cy] = shapeDrawingData.center;
        const [px, py] = current;
        const radiusPixels = Math.sqrt((px - cx) ** 2 + (py - cy) ** 2);
        const diameterPixels = radiusPixels * 2;
        const diameterMeters = pixelsToMeters(diameterPixels);
        return {
          length: formatLinearDimension(diameterMeters),
          height: formatLinearDimension(diameterMeters),
          angle: '--',
        };
      }

      if (activeShapeTool === 'square' && shapeDrawingData.corner && current) {
        const [x1, y1] = shapeDrawingData.corner;
        const [x2, y2] = current;
        const widthPixels = Math.abs(x2 - x1);
        const heightPixels = Math.abs(y2 - y1);
        const widthMeters = pixelsToMeters(widthPixels);
        const heightMeters = pixelsToMeters(heightPixels);
        const angle = normalizeAngle(Math.atan2(y2 - y1, x2 - x1));
        return {
          length: formatLinearDimension(heightMeters),
          height: formatLinearDimension(widthMeters),
          angle: `${angle}°`,
        };
      }

      if (lastPoint && current) {
        const [x1, y1] = lastPoint;
        const [x2, y2] = current;
        const dx = x2 - x1;
        const dy = y2 - y1;
        const distancePixels = Math.sqrt(dx * dx + dy * dy);
        const distanceMeters = pixelsToMeters(distancePixels);
        const angle = normalizeAngle(Math.atan2(dy, dx));
        return {
          length: formatLinearDimension(distanceMeters),
          height: '--',
          angle: `${angle}°`,
        };
      }
    }
    
    // Check if a wall is selected
    if (selectedWallId) {
      const wall = graph.edges[selectedWallId];
      if (wall) {
        // wall.length and wall.thickness are already in METERS
        let angleDeg = ((wall.angle * 180) / Math.PI);
        // Ensure angle is positive (0-360 range)
        angleDeg = ((angleDeg % 360) + 360) % 360;
        
        const heightValue = wallHeightValue;
        return {
          length: formatLinearDimension(wall.length),
          height: formatHeight(heightValue),
          angle: `${angleDeg.toFixed(1)}°`
        };
      }
    }
    
    // Check if an opening is selected
    if (selectedOpeningId && openingNumericValues) {
      for (const edge of Object.values(graph.edges)) {
        const opening = edge.openings?.find(o => o.id === selectedOpeningId);
        if (opening) {
          const widthValue = openingNumericValues.width ?? 0;
          const lengthValue = openingNumericValues.height ?? 0;

          const angleRad = opening.angle ?? edge.angle;
          let angleDeg = ((angleRad * 180) / Math.PI);
          angleDeg = ((angleDeg % 360) + 360) % 360;

          return {
            length: unitSystem === 'imperial'
              ? formatImperial(lengthValue)
              : formatMetric(lengthValue),
          height: unitSystem === 'imperial'
            ? formatImperial(widthValue)
            : formatMetric(widthValue),
            angle: `${angleDeg.toFixed(1)}°`
          };
        }
      }
    }

    // 3D Rectangle tool - show width and height
    if (activeTool3D === 'rectangle' && rectanglePreview.active) {
      const widthMeters = rectanglePreview.width;
      const heightMeters = rectanglePreview.height;

      return {
        length: formatLinearDimension(widthMeters),
        height: formatLinearDimension(heightMeters),
        angle: '--',
      };
    }

    // 3D Circle tool - show radius and diameter
    if (activeTool3D === 'circle' && circlePreview.active) {
      const radiusMeters = circlePreview.radius;
      const diameterMeters = radiusMeters * 2;

      return {
        length: formatLinearDimension(radiusMeters),
        height: formatLinearDimension(diameterMeters),
        angle: '--',
      };
    }

    // 3D Push-Pull tool - show distance
    if (activeTool3D === 'push-pull' && pushPullState.active && pushPullState.distance !== 0) {
      const distanceMeters = Math.abs(pushPullState.distance);
      const sign = pushPullState.distance >= 0 ? '+' : '-';
      const distanceDisplay = `${sign}${formatLinearDimension(distanceMeters)}`;

      return {
        length: distanceDisplay,
        height: '--',
        angle: '--',
      };
    }

    // 3D Tape Measure tool - show distance
    if (activeTool3D === 'tape' && tapeState.active && tapeState.startPoint && tapeState.endPoint) {
      const distanceMeters = tapeState.distance;
      const distanceDisplay = formatLinearDimension(distanceMeters);

      return {
        length: distanceDisplay,
        height: '--',
        angle: '--',
      };
    }

    // Selected CAD object - show dimensions
    if (selectedCADObject && selectedCADObject.mesh.geometry instanceof THREE.BoxGeometry) {
      const params = selectedCADObject.mesh.geometry.parameters;
      const widthMeters = (params.width ?? 1) * selectedCADObject.scale[0];
      const heightMeters = (params.height ?? 1) * selectedCADObject.scale[1];

      return {
        length: formatLinearDimension(widthMeters),
        height: formatLinearDimension(heightMeters),
        angle: '--',
      };
    }

    return null;
  }, [
    isMeasureActive,
    startPoint,
    endPoint,
    unitSystem,
    isDrawing,
    drawingStartPoint,
    drawingCurrentPoint,
    wallThickness,
    formatLinearDimension,
    formatHeight,
    normalizeAngle,
    isShapeDrawing,
    activeShapeTool,
    shapeDrawingData,
    selectedWallId,
    graph,
    selectedOpeningId,
    openingNumericValues,
    measurementInfo,
    activeTool3D,
    pushPullState,
    tapeState,
    rectanglePreview,
    circlePreview,
    selectedCADObject,
    wallHeightValue,
  ]);

  return (
    <div className="pt-8 pb-2 px-2">
      <div 
        className="flex rounded-lg"
        style={{ border: '1px solid #EF4444' }}
      >
        <DimensionBox 
          label="Length" 
          value={dimensions ? dimensions.length : '--'}
          editable={allowLengthEditing}
          inputValue={lengthInput}
          onInputChange={setLengthInput}
          onCommit={handleLengthCommit}
          onCancel={resetLengthInput}
          unitLabel={lengthUnitLabel}
          showDivider={true}
        />
        <DimensionBox 
          label="Height" 
          value={dimensions ? dimensions.height : '--'}
          editable={allowHeightEditing}
          inputValue={heightInput}
          onInputChange={setHeightInput}
          onCommit={handleHeightCommit}
          onCancel={resetHeightInput}
          unitLabel={heightUnitLabel}
          showDivider={true}
        />
        <DimensionBox 
          label="Angle" 
          value={dimensions ? dimensions.angle : '--'}
          editable={allowAngleEditing}
          inputValue={angleInput}
          onInputChange={setAngleInput}
          onCommit={handleAngleCommit}
          onCancel={resetAngleInput}
          unitLabel={angleUnitLabel}
          showDivider={false}
        />
      </div>
    </div>
  );
};

