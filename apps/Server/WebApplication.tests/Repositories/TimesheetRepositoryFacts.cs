using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using WebApplication.DatabaseContext;
using WebApplication.Models;
using WebApplication.Repositories;
using Xunit;

namespace Repositories
{
	public class TimesheetRepositoryFacts
	{
		public class Constructor
		{
			/// <summary>
			/// Checks that the constructor throws an Exception if passed a null context.
			/// </summary>
			[Fact]
			public void Throws_Null_Exception_For_Null_Context()
			{
				var ex = Assert.Throws<ArgumentNullException>(() => new TimesheetRepository(null));
				Assert.Contains("context", ex.Message);
			}
		}

		public class GetAll
		{
			[Fact]
			public void Returns_All_Timesheet_Entries()
			{
				var options = BuildContextOptions(nameof(Returns_All_Timesheet_Entries));

				// Insert seed data into the database using one instance of the context
				using (var context = new TimesheetContext(options))
				{
					context.Database.EnsureDeleted();
					context.TimesheetEntries.Add(new TimesheetEntry { TaskName = "Task 1", TaskDescription = "Task 1 Description" });
					context.TimesheetEntries.Add(new TimesheetEntry { TaskName = "Task 2", TaskDescription = "Task 2 Description" });
					context.SaveChanges();
				}

				// Use a clean instance of the context to run the test
				using (var context = new TimesheetContext(options))
				{
					var repository = new TimesheetRepository(context);
					var result = repository.GetAll();
					Assert.Equal(2, result.Count());

					var resultList = result.ToList();

					// Check Entry 1
					Assert.Equal("Task 1", resultList[0].TaskName);
					Assert.Equal("Task 1 Description", resultList[0].TaskDescription);

					// Check Entry 2
					Assert.Equal("Task 2", resultList[1].TaskName);
					Assert.Equal("Task 2 Description", resultList[1].TaskDescription);
				}
			}

			[Fact]
			public void Returns_Empty_Collection_If_No_Timesheet_Entries_Exist()
			{
				var options = BuildContextOptions(nameof(Returns_All_Timesheet_Entries));

				// Run the test with an empty db in the context
				using (var context = new TimesheetContext(options))
				{
					context.Database.EnsureDeleted();
					var repository = new TimesheetRepository(context);
					var result = repository.GetAll();
					Assert.Equal(0, result.Count());
				}
			}

			/// <summary>
			/// Builds the database context options.
			/// </summary>
			/// <param name="dbName">The database name to use.</param>
			/// <returns>The context options.</returns>
			private DbContextOptions<TimesheetContext> BuildContextOptions(string dbName)
			{
				return new DbContextOptionsBuilder<TimesheetContext>()
					.UseInMemoryDatabase(databaseName: dbName)
					.Options;
			}
		}
	}
}
