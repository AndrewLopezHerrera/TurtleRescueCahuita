using BackendTurtleRescueCahuita.exception;
using BackendTurtleRescueCahuita.logic;
using BackendTurtleRescueCahuita.models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("/api/neststurtle")]
public class NestTurtleController(NestTurtleValidator validator) : ControllerBase
{
    private readonly NestTurtleValidator Validator = validator;

    [Authorize(Roles = "Admin")]
    [HttpPost("addturtlenest")]
    public async Task<ActionResult> AddTurtleNests(InfoCreateNestTurtleModel info)
    {
        try
        {
            await Validator.AddNestTurtle(info);
            return Ok();
        }
        catch(WebException e)
        {
            return StatusCode(e.CodeError, e.Message);
        }
        catch(Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    [Authorize(Roles = "Admin, Researcher")]
    [HttpGet("getturtlenest")]
    public async Task<ActionResult<List<NestTurtleModel>>> GetNestsTurtle()
    {
        try
        {
            List<NestTurtleModel> result = await Validator.GetNestsTurtle();
            return Ok(result);
        }
            catch(WebException e)
        {
            return StatusCode(e.CodeError, e.Message);
        }
        catch(Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }
}