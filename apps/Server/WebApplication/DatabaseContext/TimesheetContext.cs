using Microsoft.EntityFrameworkCore;
using WebApplication.Models;

namespace WebApplication.DatabaseContext
{
	public class TimesheetContext : DbContext
	{
		/// <summary>
		/// Initializes a new instance of the <see cref="T:WebApplication.DatabaseContext.TimesheetContext"/> class.
		/// </summary>
		/// <param name="options">The options to be used when creating the context.</param>
		public TimesheetContext(DbContextOptions<TimesheetContext> options)
			: base(options) 
		{
		}

		public DbSet<TimesheetEntry> TimesheetEntries { get; set; }
	}
}
