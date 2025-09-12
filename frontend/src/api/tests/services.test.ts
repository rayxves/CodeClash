import { apiClient } from '../client';
import { submitCode } from '../codeReferenceServices';
import { getProblems } from '../problemServices';
import { loginUser } from '../userServices';

jest.mock('../client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

jest.mock("js-cookie", () => ({
  get: jest.fn().mockReturnValue("{\"token\":\"mock-token\"}"),
}));


describe('API Services', () => {
  const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProblems', () => {
    it('should fetch problems successfully', async () => {
      const mockProblems = [
        { id: 1, title: 'Problem 1', difficulty: 'Fácil' },
        { id: 2, title: 'Problem 2', difficulty: 'Médio' },
      ];
      
      mockApiClient.get.mockResolvedValue(mockProblems);

      const result = await getProblems();

      expect(mockApiClient.get).toHaveBeenCalledWith('/problems');
      expect(result).toEqual(mockProblems);
    });

    it('should handle errors when fetching problems', async () => {
      const errorMessage = 'Network error';
      mockApiClient.get.mockRejectedValue(new Error(errorMessage));

      await expect(getProblems()).rejects.toThrow(errorMessage);
      expect(mockApiClient.get).toHaveBeenCalledWith('/problems');
    });
  });

  describe('loginUser', () => {
    it('should login user successfully', async () => {
      const mockUser = { id: 1, username: 'testuser', token: 'mock-token' };
      mockApiClient.post.mockResolvedValue(mockUser);

      const result = await loginUser('testuser', 'password');

      expect(mockApiClient.post).toHaveBeenCalledWith('/users/login', {
        username: 'testuser',
        password: 'password',
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('submitCode', () => {
    it('should submit code successfully', async () => {
      const mockResponse = { success: true, output: 'Test passed' };
      mockApiClient.post.mockResolvedValue(mockResponse);

      jest.doMock('js-cookie', () => ({
        get: jest.fn().mockReturnValue('{"token": "mock-token"}'),
      }));

      const result = await submitCode('python', 'print("hello")', 1);

      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/code/submit',
        { code: 'print("hello")', language: 'python', problemId: 1 },
        { headers: expect.objectContaining({ Authorization: 'Bearer mock-token' }) }
      );
      expect(result).toEqual(mockResponse);
    });
  });
});