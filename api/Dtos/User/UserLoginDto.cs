using System.ComponentModel.DataAnnotations;

namespace Dtos
{
    public class UserLoginDto
    {
        [Required(ErrorMessage = "O nome de usuário é obrigatório.")]
        [MinLength(3, ErrorMessage = "O username precisa ter no mínimo 3 caracters.")]
        [MaxLength(50, ErrorMessage = "O username pode ter no máximo 30 caracter.")]
        public string UserName { get; set; } = string.Empty;
        [Required(ErrorMessage = "A senha é obrigatória.")]
        [MaxLength(50, ErrorMessage = "A senha pode ter no máximo 50 caracters.")]
        public string Password { get; set; } = string.Empty;
    }
}