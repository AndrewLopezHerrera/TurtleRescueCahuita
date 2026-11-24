namespace BackendTurtleRescueCahuita.Controllers;

using BackendTurtleRescueCahuita.exception;
using BackendTurtleRescueCahuita.logic;
using BackendTurtleRescueCahuita.models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


[ApiController]
[Route("api/activitybeach")]
public class ActivityBeachController(ActivityBeachValidator validator) : ControllerBase
{
    private readonly ActivityBeachValidator Validator = validator;

    [Authorize(Roles = "Admin")]
    [HttpPost("createactivitybeach")]
    public async Task<ActionResult> CreateActivityBeach(InfoCreateActivityBeachModel info)
    {
        try
        {
            await Validator.CreateActivityBeach(info);
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
    [HttpGet("getactitiesbeach")]
    public async Task<ActionResult<List<ActivityBeachModel>>> GetActivitiesBeach()
    {
        try
        {
            List<ActivityBeachModel> activities = await Validator.GetActivitiesBeach();
            return Ok(activities);
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