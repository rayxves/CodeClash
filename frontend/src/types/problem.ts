export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface Problem {
  id: number;
  title: string;
  description: string;
  difficulty: "Fácil" | "Médio" | "Difícil";
  category: string;
  testCases: TestCase[];
}

export interface TestResult {
  testCase: TestCase;
  userOutput: string;
  passed: boolean;
  error?: string;
}

export interface SubmissionResult {
  passed: number;
  total: number;
  results: TestResult[];
  allPassed: boolean;
}
