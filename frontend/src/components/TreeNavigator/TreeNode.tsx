import { FileCode, Folder } from "lucide-react";
import type { CodeReference } from "../../types/code";

interface TreeNodeProps {
	node: CodeReference;
	x: number;
	y: number;
	width: number;
	height: number;
	selectedNodeId: string | null;
	onNodeSelect: (node: CodeReference) => void;
	isInSelectedPath: (nodeId: string) => boolean;
}

export default function TreeNode({
	node,
	x,
	y,
	width,
	height,
	selectedNodeId,
	onNodeSelect,
	isInSelectedPath,
}: TreeNodeProps) {
	const isCategory = !!(node.children && node.children.length > 0);
	const isSelected = String(node.id) === selectedNodeId;
	const isPath = isInSelectedPath(String(node.id));

	const Icon = isCategory ? Folder : FileCode;

	const bgColor = isSelected
		? "bg-gradient-to-r from-primary to-primary/90"
		: isPath
		? "bg-primary/20"
		: "bg-card";

	const borderColor = isSelected
		? "border-primary"
		: isPath
		? "border-primary/50"
		: "border-border";

	const textColor = isSelected ? "text-white" : "text-card-foreground";
	const iconColor = isSelected
		? "text-white"
		: isCategory
		? "text-yellow-500"
		: "text-blue-500";

	const hoverClass = !isSelected
		? "hover:bg-card-hover hover:border-primary hover:shadow-lg active:scale-95"
		: "";

	const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
		if (e.type === "click") {
			e.stopPropagation();
		}

		onNodeSelect(node);
	};

	return (
		<g
			transform={`translate(${x}, ${y})`}
			onClick={handleClick}
			onTouchEnd={handleClick}
			style={{ cursor: "pointer" }}
			className="transition-all duration-200">
			{isSelected && (
				<rect
					x={-3}
					y={-3}
					width={width + 6}
					height={height + 6}
					rx={10}
					fill="#3b82f6"
					opacity="0.15"
					filter="url(#glow)"
					style={{ pointerEvents: "none" }}
				/>
			)}

			<foreignObject
				x="0"
				y="0"
				width={width}
				height={height}>
				<div
					className={`w-full h-full p-2 sm:p-3 flex items-center justify-start rounded-lg sm:rounded-xl border-2 transition-all duration-200 shadow-md touch-manipulation ${bgColor} ${borderColor} ${hoverClass}`}
					style={{
						WebkitTapHighlightColor: "transparent",
						userSelect: "none",
						WebkitUserSelect: "none",
					}}>
					<div className="flex items-center min-w-0 flex-1 gap-2">
						<Icon
							className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${iconColor}`}
						/>
						<span
							className={`text-xs sm:text-sm font-semibold truncate ${textColor}`}
							title={node.name}>
							{node.name}
						</span>
					</div>
				</div>
			</foreignObject>
		</g>
	);
}
