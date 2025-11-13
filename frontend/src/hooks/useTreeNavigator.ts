import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getCodeTreeByLanguage } from "../api/codeReferenceServices";
import { getNextSuggestedNode } from "../api/treeNavigationService";
import {
  NODE_WIDTH,
  NODE_HEIGHT,
} from "../constants/tree-navigation_constants";
import type { CodeReference } from "../types/code";
import type {
  TreeNavigatorParams,
  NavigationMode,
  TreeNodePosition,
} from "../types/navigation";
import {
  calculateTreeLayout,
  calculatePanForCenter,
  findAncestors,
} from "../utils/treeUtils";
import type { Notification } from "../components/Submission/NotificationToast";
import { getErrorMessage } from "../utils/errorsHandler";

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
  const [zoom, setZoom] = useState(0.3);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const lastPositionRef = useRef({ x: 0, y: 0 });

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
        .catch((error) => {
          const message = getErrorMessage(error);
          addNotification("error", message);
        })
        .finally(() => setIsLoading(false));
    }
  }, [language]);

  useEffect(() => {
    if (
      treePositions.length > 0 &&
      treeData &&
      isInitialLoad &&
      containerRef.current
    ) {
      const isMobile = window.innerWidth < 768;
      const initialZoomLevel = isMobile ? 0.25 : 0.6;
      
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

  const addNotification = useCallback(
    (type: "error" | "success" | "info", message: string, duration = 4000) => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, type, message, duration }]);
    },
    []
  );

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleNodeSelect = useCallback(
    (node: CodeReference, shouldCenter = false) => {
      setSelectedNode(node);
      
      const isMobile = window.innerWidth < 768;
      if (shouldCenter || !isMobile) {
        const nodePos = treePositions.find((p) => p.node.id === node.id);
        const newPan = calculatePanForCenter(nodePos, containerRef.current, zoom);
        if (newPan) setPan(newPan);
      }
    },
    [treePositions, zoom]
  );

  const handleNext = useCallback(async () => {
    if (!language) return;
    if (!selectedNode) {
      addNotification(
        "error",
        "Erro ao buscar o próximo sugerido. Nenhum nó selecionado."
      );
      return;
    }
    try {
      const nextNode = await getNextSuggestedNode(
        language,
        navigationMode,
        parseInt(String(selectedNode.id), 10)
      );
      if (nextNode) {
        handleNodeSelect(nextNode, true);
      }
    } catch (error) {
      const message = getErrorMessage(error);
      addNotification("error", message);
    }
  }, [language, navigationMode, selectedNode, handleNodeSelect, addNotification]);

  const handleReset = useCallback(() => {
    if (treeData) {
      handleNodeSelect(treeData, true);
    }
  }, [treeData, handleNodeSelect]);

  const handleZoom = useCallback(
    (direction: "in" | "out") => {
      if (!containerRef.current) return;
      
      const isMobile = window.innerWidth < 768;
      const zoomStep = isMobile ? 0.05 : 0.15;
      const maxZoom = isMobile ? 1.0 : 2;
      const minZoom = 0.15;
      
      const newZoom =
        direction === "in"
          ? Math.min(zoom + zoomStep, maxZoom)
          : Math.max(zoom - zoomStep, minZoom);

      if (newZoom === zoom) return;

      const container = containerRef.current;
      const centerX = container.clientWidth / 2;
      const centerY = container.clientHeight / 2;
      
      const worldX = (centerX - pan.x) / zoom;
      const worldY = (centerY - pan.y) / zoom;
      
      const newPanX = centerX - worldX * newZoom;
      const newPanY = centerY - worldY * newZoom;

      setZoom(newZoom);
      setPan({ x: newPanX, y: newPanY });
    },
    [zoom, pan]
  );

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
      const { clientWidth: containerWidth, clientHeight: containerHeight } =
        containerRef.current;

      const scaleX = containerWidth / contentWidth;
      const scaleY = containerHeight / contentHeight;
      const newZoom = Math.min(scaleX, scaleY) * 0.85;

      setZoom(newZoom);
      setPan({
        x: -minX * newZoom + (containerWidth - contentWidth * newZoom) / 2,
        y: -minY * newZoom + (containerHeight - contentHeight * newZoom) / 2,
      });
    }
  }, [treePositions]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent | { clientX: number; clientY: number }) => {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      lastPositionRef.current = { x: e.clientX, y: e.clientY };
    },
    [pan]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent | { clientX: number; clientY: number }) => {
      if (isDragging) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        setPan({ x: newX, y: newY });
        lastPositionRef.current = { x: e.clientX, y: e.clientY };
      }
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  const isNodeInSelectedPath = useCallback(
    (nodeId: string): boolean => {
      if (!selectedNode || !treeData) return false;
      if (String(selectedNode.id) === nodeId) return true;
      const ancestors = findAncestors(String(selectedNode.id), treeData);
      return ancestors ? ancestors.includes(nodeId) : false;
    },
    [selectedNode, treeData]
  );

  const gTransitionStyle = useMemo(
    () => ({
      transition:
        isInitialLoad || isDragging ? "none" : "transform 0.3s ease-out",
    }),
    [isInitialLoad, isDragging]
  );

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
    notifications,
    removeNotification,
  };
};
