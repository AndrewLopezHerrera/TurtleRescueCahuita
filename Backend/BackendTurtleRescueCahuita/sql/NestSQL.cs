namespace BackendTurtleRescueCahuita.SQL;

using BackendTurtleRescueCahuita.models;
using Dapper;
using Npgsql;

public class NestSQL(NpgsqlConnection connection)
{
    private readonly NpgsqlConnection Connection = connection;

    public async Task CreateNestTurtle(InfoCreateNestTurtleModel info)
    {
        const string sql = "CALL sp_add_nest(@IdActivityBeach, @IdVivariumNest, @HatcheryArrivalTime, @NestCode, @NormalEggs, @YolklessEggs, @IdStateNest)";
        await Connection.QueryAsync(
            sql,
            new
            {
                IdActivityBeach = info.in_id_beach_activity, 
                IdVivariumNest = info.in_vivarium_nest,
                HatcheryArrivalTime = TimeOnly.FromDateTime(info.in_hatchery_arrival_time),
                NestCode = info.in_nest_code,
                NormalEggs = info.in_normal_eggs,
                YolklessEggs = info.in_yolkless_eggs,
                IdStateNest = info.in_id_state_nest
            }
        );
    }

    public async Task<List<NestTurtleModel>> GetTurtlesNests()
    {
        const string sql = "SELECT * FROM fn_see_nest();";
        IEnumerable<NestTurtleModel> result = await Connection.QueryAsync<NestTurtleModel>(
            sql
        );
        return result.AsList();
    }
}