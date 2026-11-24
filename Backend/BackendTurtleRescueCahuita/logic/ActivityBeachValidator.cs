namespace BackendTurtleRescueCahuita.logic;
using BackendTurtleRescueCahuita.SQL;
using BackendTurtleRescueCahuita.exception;
using BackendTurtleRescueCahuita.models;

public class ActivityBeachValidator(ActivityBeachSQL activityBeachSQL)
{
    private readonly ActivityBeachSQL SQL = activityBeachSQL;

    public async Task CreateActivityBeach(InfoCreateActivityBeachModel info)
    {
        if(info == null)
            throw new WebException("No se envió la información de la actividad", 400);
        if(info.in_date_activity == null)
            throw new WebException("Debe existir una fecha de actividad", 400);
        if(info.in_leader == -1)
            throw new WebException("Un lider debe ser quien agregue la actividad", 400);
        if(info.in_time_sighting == null)
            throw new WebException("Debe estar asignado la hora de avistamiento", 400);
        if(info.in_id_activity_turtle_sighting == -1)
            throw new WebException("Debe estar asignado una actividad de la tortuga", 400);
        if(info.in_specie_turtle == -1)
            throw new WebException("Debe estar asignado la especie de la tortuga", 400);
        if(info.in_id_final_activity_turtle == -1)
            throw new WebException("Debe estar asignado la actividad final de la tortuga", 400);
        if(info.in_comments_activity == null)
            throw new WebException("Deben haber comentarios", 400);
        await SQL.AddActivityBeach(info);
    }

    public async Task<List<ActivityBeachModel>> GetActivitiesBeach()
    {
        return await SQL.GetActivitiesBeach();
    }
}