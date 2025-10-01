export interface TestResult {
  testCaseId: number;
  passed: boolean;
  status: string;
  expectedOutput: string;
  output: string;
  compileOutput: string;
  time: string;
  input?: string;
  error?: string;
}

export interface SimpleExecutionResult {
  stdout: string;
  stderr: string;
  compileOutput: string;
  status: {
    id: number;
    description: string;
  };
  time: string;
  message: string;
}

export interface SubmissionResponse {
  testResults: TestResult[];
  simpleExecutionResult: SimpleExecutionResult | null;
  overallStatus: number;
  compilationError: string | null;
  notification: string | null;
  pointsGained: number | null;
  error?: string;
}

export interface SubmissionResultDisplayProps {
  result: SubmissionResponse | null;
  isProblemsMode: boolean;
  onPointsNotification?: (points: number) => void;
}
