namespace BackendTurtleRescueCahuita.Controllers;
using BackendTurtleRescueCahuita.logic;
using BackendTurtleRescueCahuita.models;
using Microsoft.AspNetCore.Mvc;
using BackendTurtleRescueCahuita.exception;
using Microsoft.AspNetCore.Authorization;

[Route("/api/session/")]
[ApiController]
public class SessionController(SessionValidator session) : ControllerBase
{
    private readonly SessionValidator sessionValidator = session;

    [HttpPost("login")]
    public async Task<ActionResult<string>> Login(InfoLoginModel infoLogin)
    {
        try
        {
            string idSession = await sessionValidator.SingIn(infoLogin);
            return Ok(idSession);
        }
        catch(WebException e)
        {
            return StatusCode(e.CodeError, new { error = e.Message });
        }
        catch(Exception e)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { error = e.Message });
        }
    }

    [Authorize]
    [HttpGet("getUserInformation")]
    public async Task<ActionResult<UserModel>> GetUserInformation()
    {
        try
        {
            string session_id = User.Identity?.Name
                ?? throw new WebException("No existe el ID de sesión", 401);
            UserModel user = await sessionValidator.GetUserInformation(session_id);
            return Ok(user);
        }
        catch(WebException e)
        {
            return StatusCode(e.CodeError, new { error = e.Message });
        }
        catch(Exception e)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { error = e.Message });
        }
    }
}