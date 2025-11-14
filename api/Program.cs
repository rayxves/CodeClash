using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Builders;
using Data;
using Dtos;
using Facades;
using Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Models;
using Newtonsoft.Json;
using Observers;
using Repositories;
using Services;
using Services.Extensions;
using Strategies;
using SubmissionChain;
using Adapters;
using Composites;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpContextAccessor();

builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
    })
    .AddJsonOptions(opts =>
    {
        opts.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        opts.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(option =>
{
    option.SwaggerDoc("v1", new OpenApiInfo { Title = "CodeClash API", Version = "v1" });
    option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter a valid token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });
    option.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type=ReferenceType.SecurityScheme,
                    Id="Bearer"
                }
            },
            new string[]{}
        }
    });
});

builder.Services.AddDbContextPool<ApplicationDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseNpgsql(connectionString, npgsql =>
    {
        npgsql.CommandTimeout(30);
        npgsql.EnableRetryOnFailure(3, TimeSpan.FromSeconds(5), null);
    });
}, poolSize: 64);

builder.Services.AddMemoryCache();

builder.Services.AddIdentity<User, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["JWT:Issuer"],
        ValidateAudience = true,
        ValidAudience = builder.Configuration["JWT:Audience"],
        ValidateLifetime = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:SigningKey"]!)),
        ValidateIssuerSigningKey = true
    };
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins", policy =>
    {
        policy.WithOrigins("https://codeclashplatform.duckdns.org")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.KeepAliveTimeout = TimeSpan.FromMinutes(2);
    options.Limits.RequestHeadersTimeout = TimeSpan.FromMinutes(2);
});

builder.Configuration.AddEnvironmentVariables();

builder.Services.AddHttpClient();
builder.Services.Configure<Judge0Settings>(builder.Configuration.GetSection("Judge0"));

builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<ICodeReferenceRepository, CodeReferenceRepository>();
builder.Services.AddScoped<IProblemRepository, ProblemRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserProblemSolutionRepository, UserProblemSolutionRepository>();

builder.Services.AddScoped<IJudge0Services, Judge0Services>();
builder.Services.AddScoped<ICodeReferenceServices, CodeReferenceService>();
builder.Services.AddScoped<IProblemServices, ProblemServices>();
builder.Services.AddScoped<IUserServices, UserServices>();
builder.Services.AddScoped<TokenServices>();
builder.Services.AddScoped<IUserProblemSolutionServices, UserProblemSolutionServices>();
builder.Services.AddScoped<ICodeFormatterServices, CodeFormatterServices>();
builder.Services.AddScoped<ITestExecutorService, TestExecutorService>();
builder.Services.AddScoped<ISubmissionServices, SubmissionServices>();
builder.Services.AddScoped<ITreeNavigationService, TreeNavigationService>();
builder.Services.AddScoped<ILanguageResolver, LanguageResolver>();

builder.Services.AddScoped<ICodeComponentFactory, CodeComponentFactory>();
builder.Services.AddScoped<IJudge0ResponseAdapter, Judge0ResponseAdapter>();
builder.Services.AddScoped<ISubmissionFacade, SubmissionFacade>();
builder.Services.AddScoped<ISubmissionRequestBuilder, SubmissionBuilder>();
builder.Services.AddScoped<SubmissionDirector>();

builder.Services.AddScoped<ISubject, SubmissionPublisher>();
builder.Services.AddScoped<IObserver, PointsObserver>();
builder.Services.AddScoped<IObserver, SolutionPersistenceObserver>();
builder.Services.AddScoped<IObserver, FrontendNotifierObserver>();


builder.Services.AddScoped<ISubmissionStrategySelector, SubmissionStrategySelector>();
builder.Services.AddScoped<ISubmissionStrategy, ProblemSubmissionStrategy>();
builder.Services.AddScoped<ISubmissionStrategy, SimpleExecutionStrategy>();
builder.Services.AddScoped<ISubmissionChainFactory, SubmissionChainFactory>(); 
builder.Services.AddScoped<ISubmissionHandler>(sp =>
{
    var judge0Service = sp.GetRequiredService<IJudge0Services>();
    var factory = sp.GetRequiredService<ISubmissionChainFactory>();
    return factory.Create(judge0Service);
});

var app = builder.Build();

app.UseCors("AllowSpecificOrigins");

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        var factory = services.GetRequiredService<ICodeComponentFactory>();
        await DbSeeder.SeedCodeReferenceAsync(context, factory);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while migrating or seeding the database.");
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.Run();

public partial class Program { }