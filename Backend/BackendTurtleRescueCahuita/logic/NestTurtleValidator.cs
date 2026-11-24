using BackendTurtleRescueCahuita.exception;
using BackendTurtleRescueCahuita.models;
using BackendTurtleRescueCahuita.SQL;

namespace BackendTurtleRescueCahuita.logic;

public class NestTurtleValidator(NestSQL nestTurtleSQL)
{
    private readonly NestSQL SQL = nestTurtleSQL;

    public async Task AddNestTurtle(InfoCreateNestTurtleModel info)
    {
        if(info == null)
            throw new WebException("No se ha enviado la información", 400);
        if(info.in_id_beach_activity == -1)
            throw new WebException("No se ingresó un ID de actividad en la playa", 400);
        if(info.in_vivarium_nest == -1)
            throw new WebException("No se ingresó un ID de vivero", 400);
        if(info.in_hatchery_arrival_time.Equals(DateTime.MinValue))
            throw new WebException("No se ingresó una fecha de ingreso del nido", 400);
        if(info.in_nest_code.Equals(""))
            throw new WebException("Debe ingresar un código de nido", 400);
        if(info.in_normal_eggs <= 0)
            throw new WebException("Debe ingresar una cantidad positiva de huevos normales", 400);
        if(info.in_yolkless_eggs <= 0)
            throw new WebException("Debe ingresar una cantidad positiva de huevos vanos", 400);
        if(info.in_id_state_nest == -1)
            throw new WebException("Debe ingresar un ID del estado del nido", 400);
        await SQL.CreateNestTurtle(info);
    }

    public async Task<List<NestTurtleModel>> GetNestsTurtle()
    {
        return await SQL.GetTurtlesNests();
    }
}