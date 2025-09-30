import { validatePassword, validateUsername } from "../validateUserData";

describe("Validation Utils", () => {
  describe("validateUsername", () => {
    it("should validate correct usernames", () => {
      expect(validateUsername("validuser")).toBe(true);
      expect(validateUsername("user123")).toBe(true);
      expect(validateUsername("user_name")).toBe(true);
      expect(validateUsername("user-name")).toBe(true);
    });

    it("should reject invalid usernames", () => {
      expect(validateUsername("")).toBe(false);
      expect(validateUsername("us")).toBe(false);
      expect(validateUsername("user@name")).toBe(false); 
      expect(validateUsername("a".repeat(21))).toBe(false); 
      expect(validateUsername("user name")).toBe(false); 
    });
  });

  describe("validatePassword", () => {
    it("should validate strong passwords", () => {
      expect(validatePassword("StrongPass123!")).toBe(null);
      expect(validatePassword("MySecure1@")).toBe(null);
    });

    it("should reject weak passwords", () => {
      expect(validatePassword("short")).toBe(
        "A senha deve ter pelo menos 6 caracteres"
      );
      expect(validatePassword("lowercase123!")).toBe(
        "A senha deve conter pelo menos uma letra maiúscula"
      );
      expect(validatePassword("UPPERCASE123!")).toBe(
        "A senha deve conter pelo menos uma letra minúscula"
      );
      expect(validatePassword("NoNumbers!")).toBe(
        "A senha deve conter pelo menos um número"
      );
      expect(validatePassword("NoSpecialChars123")).toBe(
        "A senha deve conter pelo menos um caractere especial"
      );
    });
  });
});
