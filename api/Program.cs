using Composites;
using Data;
using Dtos;
using Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpContextAccessor();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "CodeClash",
        Version = "v1",
        Description = ""
    });
});


builder.Services.AddControllers().AddNewtonsoftJson(options =>
{
    options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
});


builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

    options.UseNpgsql(connectionString);
});

builder.Configuration.AddEnvironmentVariables();


builder.Services.Configure<Judge0Settings>(builder.Configuration.GetSection("Judge0"));
builder.Services.AddHttpClient();
builder.Services.AddScoped<IJudge0Interface, Judge0Client>();
builder.Services.AddScoped<CodeSubmissionFacade>();
builder.Services.AddScoped<ICodeReferenceInterface, CodeReferenceService>();


var app = builder.Build();

app.UseRouting();
app.UseAuthorization();

app.MapControllers();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "");
    });


    app.UseHttpsRedirection();


    app.Run();
}
