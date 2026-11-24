namespace BackendTurtleRescueCahuita.SQL;
using Dapper;
using BackendTurtleRescueCahuita.models;
using Npgsql;

public class SessionSQL
{
    private NpgsqlConnection Connection;
    public SessionSQL(NpgsqlConnection connection)
    {
        Connection = connection;
    }

    public async Task<string?> LoginAsync(InfoLoginModel infoLoginModel)
    {
        const string sql = "SELECT fn_sign_in(@UserName);";
        return await Connection.QueryFirstOrDefaultAsync<string>(
            sql,
            new { UserName = infoLoginModel.user_name }
        );
    }

    public async Task<UserModel?> GetUserModelAsync(string user_name)
    {
        const string sql = "SELECT * FROM fn_get_info_user(@UserName);";
        return await Connection.QueryFirstOrDefaultAsync<UserModel>(
            sql,
            new { UserName = user_name }
        );
    }
}