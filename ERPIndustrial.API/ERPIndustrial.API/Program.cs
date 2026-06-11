using ERPIndustrial.API.Data;

var builder = WebApplication.CreateBuilder(args);

// Integracion de controladores y reposositorio
builder.Services.AddControllers();
builder.Services.AddScoped<ProyectoRepository>();
builder.Services.AddScoped<ClienteRepository>();
builder.Services.AddScoped<TecnicoRepository>();
builder.Services.AddScoped<AreaRepository>();
builder.Services.AddScoped<EspecialidadRepository>();

// Regla CORS (Permitir Next.js)
builder.Services.AddCors(options => {
    options.AddPolicy("PermitirNextJs", policy => {
        policy.WithOrigins("http://localhost:3000").AllowAnyHeader().AllowAnyMethod();
    });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
//Se apaga redireccion forzada HTTPS para desarrollo local
//app.UseHttpsRedirection();

//Regla CORS
app.UseCors("PermitirNextJs");

app.UseAuthorization();

app.MapControllers();

app.Run();
