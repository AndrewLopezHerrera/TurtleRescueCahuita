namespace BackendTurtleRescueCahuita.models;
using Npgsql;

public class NestTurtleModel
{
    public int id { get; } = -1;
	public int id_actividad_playa { get; } = -1;
	public string vivero { get; } = "";
	public string hora_llegada { get;} = "";
	public string codigo_nido { get; } = "";
	public int huevos_normales { get; } = -1;
	public int huevos_vanos { get; } = -1;
	public string estado_nido { get; } = "";
}