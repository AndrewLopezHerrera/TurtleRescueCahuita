namespace BackendTurtleRescueCahuita.exception;

public class WebException(string message, int codeError) : Exception(message)
{
    public int CodeError { get; } = codeError;

}