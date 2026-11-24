namespace BackendTurtleRescueCahuita.models;

public class UserModel
{
    public int id { get; set; } = 0;
	public string user_name { get; set; } = "";
    public string email { get; set; } = "";
    public string role_user {get; set; } = "";
    public string password { get; set; } = "";
    public string first_name { get; set; } = "";
	public string second_name { get; set; } = "";
    public string first_last_name { get; set; } = "";
    public string second_last_name { get; set; } = "";
}