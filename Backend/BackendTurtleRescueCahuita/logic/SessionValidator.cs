namespace BackendTurtleRescueCahuita.logic;
using BackendTurtleRescueCahuita.models;
using BackendTurtleRescueCahuita.exception;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BackendTurtleRescueCahuita.SQL;

public class SessionValidator(SessionSQL sessionSQL, JwtSecurityTokenHandler jwtSecurity)
{
    private readonly SessionSQL QuerySessionSQL = sessionSQL;
    private JwtSecurityTokenHandler JWTSecurity = jwtSecurity;
    public async Task<string> SingIn(InfoLoginModel infoLogin)
    {
        string? password = await QuerySessionSQL.LoginAsync(infoLogin);
        if(password == null || !password.Equals(infoLogin.password))
            throw new WebException("El usuario o la contraseña son incorrectas", 401);
        UserModel? user = await QuerySessionSQL.GetUserModelAsync(infoLogin.user_name)
            ?? throw new WebException("El usuario o la contraseña son incorrectas", 401);
        DateTime expires = DateTime.UtcNow;
        var claim = new Claim[]
        {
            new(ClaimTypes.Name, user.user_name),
            new(ClaimTypes.Role, user.role_user)
        };
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("T%x$@yYNgrVucf4bPk5cJZuEK8XPJhxN"));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        SecurityTokenDescriptor descriptor = new()
        {
            Audience = "https://api.proyectosprototipos.online",
            Issuer = "MiAPIPractice",
            Expires = expires.AddDays(2),
            Subject = new ClaimsIdentity(claim),
            SigningCredentials = creds
        };
        string tokenJWT = JWTSecurity.CreateEncodedJwt(descriptor);
        return tokenJWT;
    }

    public async Task<UserModel> GetUserInformation(string user_name)
    {
        UserModel? user = await QuerySessionSQL.GetUserModelAsync(user_name)
            ?? throw new WebException("Usuario no autorizado", 401);
        return user;
    }
}