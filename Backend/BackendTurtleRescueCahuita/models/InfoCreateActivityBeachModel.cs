public class InfoCreateActivityBeachModel
{
    public DateTime? in_date_activity {get; set;} = null;
    public int in_leader { get; set; } = -1;
	public DateTime? in_time_sighting {get; set; } = null;
    public int in_id_activity_turtle_sighting {get; set; } = -1;
	public int in_specie_turtle {get; set; } = -1;
	public int in_id_final_activity_turtle {get; set; } = -1;
	public string? in_comments_activity {get; set; } = null;
}