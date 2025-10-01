export function mapToJudge0(status: number): string {
  switch (status) {
    case 1:
      return "Na Fila";
    case 2:
      return "Processando";
    case 3:
      return "Aceito";
    case 4:
      return "Resposta Incorreta";
    case 5:
      return "Limite de Tempo Excedido";
    case 6:
      return "Erro de Compilação";
    case 7:
      return "Limite de Memória Excedido";
    case 8:
      return "Erro de Execução (SIGSEGV)";
    case 9:
      return "Erro de Execução (SIGFPE)";
    case 10:
      return "Erro de Execução (Abortado)";
    case 11:
      return "Erro de Execução (NZEC)";
    case 12:
      return "Limite de Saída Excedido";
    case 13:
      return "Erro Interno";
    case 14:
      return "Entidade Não Processável";
    default:
      return "Status Desconhecido";
  }
}
