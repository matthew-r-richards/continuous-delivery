using System.IO;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.PlatformAbstractions;
using Swashbuckle.AspNetCore.Swagger;
using WebApplication.DatabaseContext;
using WebApplication.Repositories;

namespace WebApplication
{
	public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
			// Configure DI
			services.AddDbContext<TimesheetContext>(opt => opt.UseInMemoryDatabase());
			services.AddScoped<ITimesheetRepository, TimesheetRepository>();

			// Add framework services.
            services.AddMvc();

			// Configure Swagger
			services.AddSwaggerGen(options =>
			{
				options.SwaggerDoc(
					"v1",
					new Info
					{
						Title = "Timesheet Entries API",
						Version = "v1",
						Description = "API for recording Timesheet entries"
					});
				var commentFileName = Configuration.GetValue<string>("AppSettings:XmlDocumentationFilename");
				var commentFilePath = Path.Combine(PlatformServices.Default.Application.ApplicationBasePath, commentFileName);
				options.IncludeXmlComments(commentFilePath);
				options.DescribeAllEnumsAsStrings();
			});
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            app.UseMvc();

			// Set up Swagger and its UI
			app.UseSwagger();
			app.UseSwaggerUI(options =>
			{
				options.SwaggerEndpoint("/swagger/v1/swagger.json", "Timesheet Entries API V1");
			});
        }
    }
}
