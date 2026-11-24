namespace BackendTurtleRescueCahuita.models;

public class InfoCreateNestTurtleModel
{
    public int in_id_beach_activity { get; set; } = -1;
	public int in_vivarium_nest { get; set; } = -1;
	public DateTime in_hatchery_arrival_time { get; set; } = DateTime.MinValue;
	public string in_nest_code { get; set; } = "";
	public int in_normal_eggs { get; set; } = 0;
	public int in_yolkless_eggs { get; set; } = 0;
	public int in_id_state_nest { get; set; } = -1;
}