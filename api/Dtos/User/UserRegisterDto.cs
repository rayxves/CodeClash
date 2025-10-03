using System.ComponentModel.DataAnnotations;

namespace Dtos
{
    public class UserRegisterDto
    {
        [Required(ErrorMessage = "O nome de usuário é obrigatório.")]
        [MinLength(3, ErrorMessage = "O username precisa ter no mínimo 3 caracters.")]
        [MaxLength(50, ErrorMessage = "O username pode ter no máximo 30 caracter.")]
        public string UserName { get; set; } = string.Empty;
        [EmailAddress(ErrorMessage = "O formato do e-mail é inválido.")]
        public string Email { get; set; } = string.Empty;
        [Required(ErrorMessage = "A senha é obrigatória.")]
        [MaxLength(50, ErrorMessage = "A senha pode ter no máximo 50 caracters.")]
        public string Password { get; set; } = string.Empty;
        [Required]
        [Compare("Password", ErrorMessage = "As senhas não conferem.")]
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}