namespace BackendTurtleRescueCahuita.SQL;
using BackendTurtleRescueCahuita.models;
using Npgsql;
using Dapper;
using System.Data;

public class ActivityBeachSQL(NpgsqlConnection connection)
{
    private readonly NpgsqlConnection Connection = connection;

    public async Task AddActivityBeach(InfoCreateActivityBeachModel info)
    {
        const string sql = "CALL sp_create_activity_beach(@DateActivity, @Leader, @TimeSighting, @IdActivityTurtleSighting, @IdSpecieTurtle, @IdFinalActivity, @CommentsActivity)";
        await Connection.QueryAsync(
            sql,
            new {
                DateActivity = DateOnly.FromDateTime(info.in_date_activity ?? DateTime.UtcNow),
                Leader = info.in_leader,
                TimeSighting = TimeOnly.FromDateTime(info.in_time_sighting ?? DateTime.UtcNow),
                IdActivityTurtleSighting = info.in_id_activity_turtle_sighting,
                IdSpecieTurtle = info.in_specie_turtle,
                IdFinalActivity = info.in_id_final_activity_turtle,
                CommentsActivity = info.in_comments_activity
            }
        );
    }

    public async Task<List<ActivityBeachModel>> GetActivitiesBeach()
    {
        const string sql = "SELECT * FROM fn_see_activities_beach();";
        IEnumerable<ActivityBeachModel> result = await Connection.QueryAsync<ActivityBeachModel>(
            sql
        );
        return result.AsList();
    }
}