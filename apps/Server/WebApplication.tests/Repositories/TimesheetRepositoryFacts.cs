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
		#region Constructor

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

		#endregion

		#region GetAll

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
					Assert.Empty(result);
				}
			}
		}

		#endregion

		#region Add

		public class Add
		{
			[Fact]
			public void Adds_Entry_To_Database()
			{
				var options = BuildContextOptions(nameof(Adds_Entry_To_Database));

				// Run the test against one instance of the context
				using (var context = new TimesheetContext(options))
				{
					context.Database.EnsureDeleted();
					var repository = new TimesheetRepository(context);
					repository.Add(new TimesheetEntry { TaskName = "Test Task", TaskDescription = "Test Task Description" });
				}

				// Use a separate instance of the context to verify correct data was added to the database
				using (var context = new TimesheetContext(options))
				{
					Assert.Equal(1, context.TimesheetEntries.Count());
					Assert.Equal("Test Task", context.TimesheetEntries.Single().TaskName);
					Assert.Equal("Test Task Description", context.TimesheetEntries.Single().TaskDescription);
				}
			}
		}

		#endregion

		#region Delete

		public class Delete
		{
			[Fact]
			public void Removes_Entry_From_Database_If_It_Exists()
			{
				var options = BuildContextOptions(nameof(Removes_Entry_From_Database_If_It_Exists));

				long idToDelete;

				// Set up the test against one instance of the context
				using (var context = new TimesheetContext(options))
				{
					context.TimesheetEntries.Add(new TimesheetEntry { TaskName = "Task 1", TaskDescription = "Task 1 Description" });
					context.TimesheetEntries.Add(new TimesheetEntry { TaskName = "Task 2", TaskDescription = "Task 2 Description" });
					context.SaveChanges();

					// Find out the ID of the first entry so that we can delete it
					idToDelete = context.TimesheetEntries.ToList().First().Id;
				}

				// Run the test against another instance of the context
				using (var context = new TimesheetContext(options))
				{
					var repository = new TimesheetRepository(context);
					repository.Delete(idToDelete);
				}

				// Use a separate instance of the context to verify correct data was deleted from the database
				using (var context = new TimesheetContext(options))
				{
					Assert.Equal(1, context.TimesheetEntries.Count());
					Assert.Equal("Task 2", context.TimesheetEntries.Single().TaskName);
					Assert.Equal("Task 2 Description", context.TimesheetEntries.Single().TaskDescription);
				}
			}

			[Fact]
			public void Throws_InvalidOperationException_If_Entry_Does_Not_Exist()
			{
				var options = BuildContextOptions(nameof(Throws_InvalidOperationException_If_Entry_Does_Not_Exist));

				// Run the test with an empty db in the context
				using (var context = new TimesheetContext(options))
				{
					context.Database.EnsureDeleted();
					var repository = new TimesheetRepository(context);
					Assert.Throws<InvalidOperationException>(() => repository.Delete(1));
				}
			}
		}

		#endregion

		/// <summary>
		/// Builds the database context options.
		/// </summary>
		/// <param name="dbName">The database name to use.</param>
		/// <returns>The context options.</returns>
		private static DbContextOptions<TimesheetContext> BuildContextOptions(string dbName)
		{
			return new DbContextOptionsBuilder<TimesheetContext>()
				.UseInMemoryDatabase(databaseName: dbName)
				.Options;
		}
	}
}
