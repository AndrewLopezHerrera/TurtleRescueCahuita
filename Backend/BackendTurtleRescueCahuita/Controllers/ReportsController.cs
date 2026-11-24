namespace BackendTurtleRescueCahuita.Controllers;

using BackendTurtleRescueCahuita.exception;
using BackendTurtleRescueCahuita.SQL;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("/api/reports")]
public class ReportsController(ReportsSQL sql) : ControllerBase
{
    private readonly ReportsSQL SQL = sql;

    [Authorize]
    [HttpGet("getreportamountencountersbyspecies")]
    public async Task<ActionResult<List<ReportBySpecieModel>>> GetReportAmountEncountersBySpecies()
    {
        try
        {
            List<ReportBySpecieModel> result = await SQL.GetReportAmountEncountersBySpecies()
                ?? throw new WebException("No se ha devuelto una respuesta de la base de datos", 500);
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

    [Authorize]
    [HttpGet("getreporttotalencountersbyspecies")]
    public async Task<ActionResult<List<ReportBySpecieModel>>> GetReportTotalEncountersBySpecies()
    {
        try
        {
            List<ReportBySpecieModel> result = await SQL.GetReportTotalEncountersBySpecies()
                ?? throw new WebException("No se ha devuelto una respuesta de la base de datos", 500);
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

    [Authorize]
    [HttpGet("getreportaverageencountersbyspecies")]
    public async Task<ActionResult<List<ReportBySpecieModel>>> GetReportAverageEncountersBySpecies()
    {
        try
        {
            List<ReportBySpecieModel> result = await SQL.GetReportAverageEncountersBySpecies()
                ?? throw new WebException("No se ha devuelto una respuesta de la base de datos", 500);
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

    [Authorize]
    [HttpGet("getgeneralstatusnest")]
    public async Task<ActionResult<List<GeneralStatus>>> GetGeneralStatusNest()
    {
        try
        {
            List<GeneralStatus> result = await SQL.GetGeneralStatusNest()
                ?? throw new WebException("No se ha devuelto una respuesta de la base de datos", 500);
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

    [Authorize]
    [HttpGet("getstatusnestbyvivarium")]
    public async Task<ActionResult<List<StatusNestByVivarium>>> GetStatusNestByVivarium()
    {
        try
        {
            List<StatusNestByVivarium> result = await SQL.GetStatusNestByVivarium()
                ?? throw new WebException("No se ha devuelto una respuesta de la base de datos", 500);
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