import { useTreeNavigator } from "../../../hooks/useTreeNavigator";
import NotificationToast from "../../Submission/NotificationToast";
import NodeDetails from "./NodeDetails";
import TreeControls from "./TreeControls";
import TreeHeader from "./TreeHeader";
import TreeView from "./TreeView";

export default function TreeNavigator() {
  const {
    isLoading,
    language,
    navigationMode,
    setNavigationMode,
    handleNext,
    handleReset,
    notifications,
    removeNotification,
    ...viewProps
  } = useTreeNavigator();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-surface flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-surface py-8 px-4 sm:px-6">
      <div className="fixed top-20 right-4 z-50 w-80 max-w-full">
        {notifications.map((notification) => (
          <NotificationToast
            key={notification.id}
            notification={notification}
            onDismiss={removeNotification}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        <TreeHeader language={language} />
        <TreeControls
          navigationMode={navigationMode}
          onModeChange={setNavigationMode}
          onNext={handleNext}
          onReset={handleReset}
        />
        <TreeView {...viewProps} />

        <NodeDetails
          selectedNode={viewProps.selectedNode}
          treeData={viewProps.treeData}
          language={language}
        />
      </div>
    </div>
  );
}
