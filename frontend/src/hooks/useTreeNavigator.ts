import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getCodeTreeByLanguage } from "../api/codeReferenceServices";
import { getNextSuggestedNode } from "../api/treeNavigationService";
import { NODE_WIDTH, NODE_HEIGHT, FIT_PADDING_FACTOR } from "../constants/tree-navigation_constants";
import type { CodeReference } from "../types/code";
import type { TreeNavigatorParams, NavigationMode, TreeNodePosition } from "../types/navigation";
import { calculateTreeLayout, calculatePanForCenter, findAncestors } from "../utils/treeUtils";


export const useTreeNavigator = () => {
  const { language: rawLanguage } = useParams<TreeNavigatorParams>();
  const language = useMemo(
    () => (rawLanguage ? decodeURIComponent(rawLanguage) : undefined),
    [rawLanguage]
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const [treeData, setTreeData] = useState<CodeReference | null>(null);
  const [selectedNode, setSelectedNode] = useState<CodeReference | null>(null);
  const [navigationMode, setNavigationMode] = useState<NavigationMode>("depth");
  const [isLoading, setIsLoading] = useState(true);
  const [treePositions, setTreePositions] = useState<TreeNodePosition[]>([]);
  const [zoom, setZoom] = useState(0.6);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (language) {
      setIsLoading(true);
      setIsInitialLoad(true);
      getCodeTreeByLanguage(language)
        .then((data) => {
          setTreeData(data);
          setSelectedNode(data);
          const { positions } = calculateTreeLayout(data);
          setTreePositions(positions);
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [language]);

  useEffect(() => {
    if (treePositions.length > 0 && treeData && isInitialLoad && containerRef.current) {
      const initialZoomLevel = 0.6;
      setZoom(initialZoomLevel);
      const rootNodePos = treePositions.find((p) => p.node.id === treeData.id);
      const initialPan = calculatePanForCenter(
        rootNodePos,
        containerRef.current,
        initialZoomLevel
      );
      if (initialPan) setPan(initialPan);
      setIsInitialLoad(false);
    }
  }, [treePositions, treeData, isInitialLoad]);

  const handleNodeSelect = useCallback((node: CodeReference) => {
    setSelectedNode(node);
    const nodePos = treePositions.find((p) => p.node.id === node.id);
    const newPan = calculatePanForCenter(nodePos, containerRef.current, zoom);
    if (newPan) setPan(newPan);
  }, [treePositions, zoom]);

  const handleNext = useCallback(async () => {
    if (!language || !selectedNode) return;
    try {
      const nextNode = await getNextSuggestedNode(
        language,
        navigationMode,
        parseInt(String(selectedNode.id), 10)
      );
      if (nextNode) handleNodeSelect(nextNode);
    } catch (error) {
      console.error("Erro ao buscar próximo nó:", error);
    }
  }, [language, navigationMode, selectedNode, handleNodeSelect]);

  const handleReset = useCallback(() => {
    if (treeData) handleNodeSelect(treeData);
  }, [treeData, handleNodeSelect]);

  const handleZoom = useCallback((direction: "in" | "out") => {
    if (!selectedNode || !containerRef.current) return;
    const zoomStep = 0.15;
    const newZoom = direction === "in"
        ? Math.min(zoom + zoomStep, 2)
        : Math.max(zoom - zoomStep, 0.2);
    
    const nodePos = treePositions.find((p) => p.node.id === selectedNode.id);
    if (!nodePos) return;

    const nodeCenterX = nodePos.x + NODE_WIDTH / 2;
    const nodeCenterY = nodePos.y + NODE_HEIGHT / 2;
    const focalPointX = nodeCenterX * zoom + pan.x;
    const focalPointY = nodeCenterY * zoom + pan.y;
    const newPanX = focalPointX - nodeCenterX * newZoom;
    const newPanY = focalPointY - nodeCenterY * newZoom;

    setZoom(newZoom);
    setPan({ x: newPanX, y: newPanY });
  }, [zoom, pan.x, pan.y, selectedNode, treePositions]);
  
  const handleZoomIn = useCallback(() => handleZoom("in"), [handleZoom]);
  const handleZoomOut = useCallback(() => handleZoom("out"), [handleZoom]);

  const handleZoomFit = useCallback(() => {
    if (treePositions.length > 0 && containerRef.current) {
      const minX = Math.min(...treePositions.map((p) => p.x));
      const maxX = Math.max(...treePositions.map((p) => p.x + NODE_WIDTH));
      const minY = Math.min(...treePositions.map((p) => p.y));
      const maxY = Math.max(...treePositions.map((p) => p.y + NODE_HEIGHT));
      
      const contentWidth = maxX - minX;
      const contentHeight = maxY - minY;
      const { clientWidth: containerWidth, clientHeight: containerHeight } = containerRef.current;
      
      const scaleX = containerWidth / contentWidth;
      const scaleY = containerHeight / contentHeight;
      const newZoom = Math.min(scaleX, scaleY) * FIT_PADDING_FACTOR;
      
      setZoom(newZoom);
      setPan({
        x: -minX * newZoom + (containerWidth - contentWidth * newZoom) / 2,
        y: -minY * newZoom + (containerHeight - contentHeight * newZoom) / 2,
      });
    }
  }, [treePositions]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  const isNodeInSelectedPath = useCallback((nodeId: string): boolean => {
    if (!selectedNode || !treeData) return false;
    if (String(selectedNode.id) === nodeId) return true;
    const ancestors = findAncestors(String(selectedNode.id), treeData);
    return ancestors ? ancestors.includes(nodeId) : false;
  }, [selectedNode, treeData]);

  const gTransitionStyle = useMemo(() => ({
    transition: isInitialLoad || isDragging ? "none" : "transform 0.3s ease-out",
  }), [isInitialLoad, isDragging]);

  return {
    containerRef,
    treeData,
    selectedNode,
    navigationMode,
    isLoading,
    treePositions,
    zoom,
    pan,
    isDragging,
    language,
    handleNodeSelect,
    handleNext,
    handleReset,
    setNavigationMode,
    handleZoomIn,
    handleZoomOut,
    handleZoomFit,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    isNodeInSelectedPath,
    gTransitionStyle,
  };
};