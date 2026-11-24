using System.IdentityModel.Tokens.Jwt;
using System.Text;
using BackendTurtleRescueCahuita.logic;
using BackendTurtleRescueCahuita.SQL;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddNpgsqlDataSource("Host=localhost;Username=postgres;Password=amd4234Spring0922.;Database=postgres");

builder.Services.AddScoped<SessionSQL>();
builder.Services.AddScoped<SessionValidator>();
builder.Services.AddScoped<JwtSecurityTokenHandler>();
builder.Services.AddScoped<ActivityBeachSQL>();
builder.Services.AddScoped<ActivityBeachValidator>();
builder.Services.AddScoped<NestSQL>();
builder.Services.AddScoped<NestTurtleValidator>();
builder.Services.AddScoped<ReportsSQL>();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
	.AddJwtBearer(options =>
	{
		options.TokenValidationParameters = new TokenValidationParameters
		{
			ValidateIssuer = true,
			ValidateAudience = true,
			ValidateLifetime = true,
			ValidateIssuerSigningKey = true,
			ValidIssuer = "MiAPIPractice",
			ValidAudience = "https://api.proyectosprototipos.online",
			IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("T%x$@yYNgrVucf4bPk5cJZuEK8XPJhxN"))
		};
		options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine($"[JWT Fallo]: {context.Exception.GetType().Name} - {context.Exception.Message}");
                return Task.CompletedTask;
            },
            OnChallenge = context =>
            {
                Console.WriteLine($"[JWT Challenge]: Error={context.Error} | Desc={context.ErrorDescription}");
                return Task.CompletedTask;
            }
        };
	});

builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirLocal", policy =>
    {
        policy.WithOrigins("http://localhost:5500")
              .AllowAnyHeader()
              .AllowAnyMethod();
        policy.WithOrigins("http://192.168.100.16:5500")
              .AllowAnyHeader()
              .AllowAnyMethod();
        // Si usas cookies/credenciales en fetch(), agrega:
        // .AllowCredentials();
    });
});

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapGet("/", () => "Hello Turtle Rescue Cahuita");

app.UseHttpsRedirection();

app.UseCors("PermitirLocal");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
