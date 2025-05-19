interface Judge0Response {
    stdout: string | null;
    stderr: string | null;
    compile_output: string | null;
    message?: string;
    status?: {
      id: number;
      description: string;
    };
    time?: string;
    memory?: string;
  }
  
 export default function ExecutionOutput({
    result,
  }: {
    result: Judge0Response | string | null;
  }) {
    if (!result) {
      return (
        <span className="text-gray-500">
          Output will appear here after execution...
        </span>
      );
    }
  
    if (typeof result === "string") {
      return <pre className="whitespace-pre-wrap text-red-500">{result}</pre>;
    }
  
    const isSuccess = result.status?.id === 3;
    const isCompilationError = result.status?.id === 6;
    const isRuntimeError =
      result.status && result.status.id >= 7 && result.status.id <= 12;
  
    return (
      <div className="space-y-3">
        {result.status && (
          <div
            className={`font-medium ${
              isSuccess
                ? "text-green-500"
                : isCompilationError || isRuntimeError
                ? "text-red-500"
                : "text-yellow-500"
            }`}
          >
            Status: {result.status.description}
          </div>
        )}
  
        <div className="flex gap-4 text-sm">
          {result.time && (
            <span className="text-blue-400">Time: {result.time}s</span>
          )}
          {result.memory && (
            <span className="text-blue-400">Memory: {result.memory}KB</span>
          )}
        </div>
  
        {result.stdout && (
          <div className="bg-gray-800 p-2 rounded">
            <div className="text-green-400 font-mono text-sm mb-1">Output:</div>
            <pre className="whitespace-pre-wrap font-mono text-sm">
              {result.stdout}
            </pre>
          </div>
        )}
  
        {isCompilationError && result.compile_output && (
          <div className="bg-gray-800 p-2 rounded">
            <div className="text-yellow-500 font-mono text-sm mb-1">
              Compilation Error:
            </div>
            <pre className="whitespace-pre-wrap font-mono text-sm text-red-400">
              {result.compile_output}
            </pre>
          </div>
        )}
  
        {isRuntimeError && result.stderr && (
          <div className="bg-gray-800 p-2 rounded">
            <div className="text-red-500 font-mono text-sm mb-1">
              Runtime Error:
            </div>
            <pre className="whitespace-pre-wrap font-mono text-sm text-red-400">
              {result.stderr}
            </pre>
          </div>
        )}
  
        {result.message && (
          <div className="text-red-500">
            <pre className="whitespace-pre-wrap">{result.message}</pre>
          </div>
        )}
      </div>
    );
  }