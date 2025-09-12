namespace Services.Extensions;

public static class ProblemHelperServices
{
    public static int GetPointsForDifficulty(string difficulty)
    {
     
        return difficulty.ToLower() switch
        {
            "fácil" => 10,
            "médio" => 20,
            "difícil" => 30,
            _ => 0
        };
    }
}