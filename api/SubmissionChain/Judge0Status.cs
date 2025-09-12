namespace SubmissionChain
{
    /// <summary>
    /// Representa os possíveis IDs de status retornados pela API do Judge0.
    /// </summary>
    public enum Judge0Status
    {
        /// <summary>
        /// A submissão está na fila de espera.
        /// </summary>
        InQueue = 1,

        /// <summary>
        /// A submissão está sendo processada.
        /// </summary>
        Processing = 2,

        /// <summary>
        /// O código foi executado com sucesso e a resposta está correta.
        /// </summary>
        Accepted = 3,

        /// <summary>
        /// O código foi executado, mas a saída é diferente da esperada.
        /// </summary>
        WrongAnswer = 4,

        /// <summary>
        /// O código excedeu o limite de tempo de execução.
        /// </summary>
        TimeLimitExceeded = 5,

        /// <summary>
        /// O código não pôde ser compilado.
        /// </summary>
        CompilationError = 6,

        /// <summary>
        /// O código ultrapassou o limite de memória permitido.
        /// </summary>
        MemoryLimitExceeded = 7,

        /// <summary>
        /// Erro de execução (Segmentation Fault).
        /// </summary>
        RuntimeErrorSigsegv = 8,

        /// <summary>
        /// Erro de execução (Floating Point Exception).
        /// </summary>
        RuntimeErrorSigfpe = 9,

        /// <summary>
        /// Erro de execução (Aborted).
        /// </summary>
        RuntimeErrorAborted = 10,

        /// <summary>
        /// Erro de execução (NZEC - Non-Zero Exit Code).
        /// </summary>
        RuntimeErrorNzec = 11,

        /// <summary>
        /// O código ultrapassou o limite de saída permitido.
        /// </summary>
        OutputLimitExceeded = 12,

        /// <summary>
        /// Erro interno do serviço de avaliação.
        /// </summary>
        InternalError = 13,

        /// <summary>
        /// O servidor não conseguiu processar a submissão.
        /// </summary>
        UnprocessableEntity = 14
    }
}
