import { getLanguageExtension } from '../getLanguageExtensions';

describe('getLanguageExtension', () => {
  describe('supported languages', () => {
    it('should return "python" for python', () => {
      expect(getLanguageExtension('python')).toBe('python');
    });

    it('should return "java" for java', () => {
      expect(getLanguageExtension('java')).toBe('java');
    });

    it('should return "csharp" for c#', () => {
      expect(getLanguageExtension('c#')).toBe('csharp');
    });

    it('should return "csharp" for csharp', () => {
      expect(getLanguageExtension('csharp')).toBe('csharp');
    });

    it('should return "cpp" for cpp', () => {
      expect(getLanguageExtension('cpp')).toBe('cpp');
    });

    it('should return "cpp" for c++', () => {
      expect(getLanguageExtension('c++')).toBe('cpp');
    });
  });

  describe('case insensitivity', () => {
    it('should handle uppercase input', () => {
      expect(getLanguageExtension('PYTHON')).toBe('python');
      expect(getLanguageExtension('JAVA')).toBe('java');
    });

    it('should handle mixed case input', () => {
      expect(getLanguageExtension('PyThOn')).toBe('python');
      expect(getLanguageExtension('C#')).toBe('csharp');
    });
  });

  describe('unsupported languages', () => {
    it('should return "text" for unknown language', () => {
      expect(getLanguageExtension('javascript')).toBe('text');
    });

    it('should return "text" for empty string', () => {
      expect(getLanguageExtension('')).toBe('text');
    });

    it('should return "text" for random string', () => {
      expect(getLanguageExtension('xyz123')).toBe('text');
    });
  });
});