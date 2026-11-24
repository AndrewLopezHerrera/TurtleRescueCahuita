namespace BackendTurtleRescueCahuita.SQL;

using Dapper;
using Npgsql;

public class ReportsSQL(NpgsqlConnection connection)
{
    private readonly NpgsqlConnection Connection = connection;

    public async Task<List<ReportBySpecieModel>> GetReportTotalEncountersBySpecies()
    {
        const string sql = "SELECT * FROM fn_get_report_total_encounters_by_species();";
        IEnumerable<ReportBySpecieModel> report = await Connection.QueryAsync<ReportBySpecieModel>(
            sql
        );
        return report.AsList();
    }

    public async Task<List<ReportBySpecieModel>> GetReportAverageEncountersBySpecies()
    {
        const string sql = "SELECT * FROM fn_get_report_average_encounters_by_species();";
        IEnumerable<ReportBySpecieModel> report = await Connection.QueryAsync<ReportBySpecieModel>(
            sql
        );
        return report.AsList();
    }

    public async Task<List<ReportBySpecieModel>> GetReportAmountEncountersBySpecies()
    {
        const string sql = "SELECT * FROM fn_get_report_amount_encounters_by_species();";
        IEnumerable<ReportBySpecieModel> report = await Connection.QueryAsync<ReportBySpecieModel>(
            sql
        );
        return report.AsList();
    }

    public async Task<List<GeneralStatus>> GetGeneralStatusNest()
    {
        const string sql = "SELECT * FROM fn_get_general_status_nest();";
        IEnumerable<GeneralStatus> report = await Connection.QueryAsync<GeneralStatus>(
            sql
        );
        return report.AsList();
    }

    public async Task<List<StatusNestByVivarium>> GetStatusNestByVivarium()
    {
        const string sql = "SELECT * FROM fn_get_status_nest_by_vivarium();";
        IEnumerable<StatusNestByVivarium> report = await Connection.QueryAsync<StatusNestByVivarium>(
            sql
        );
        return report.AsList();
    }
}