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

		public class Find
		{
			[Fact]
			public void Returns_Timesheet_Entry_If_Found()
			{
				var options = BuildContextOptions(nameof(Returns_Timesheet_Entry_If_Found));

				long idToFind;

				// Set up the test against one instance of the context
				using (var context = new TimesheetContext(options))
				{
					context.Database.EnsureDeleted();
					context.TimesheetEntries.Add(new TimesheetEntry { TaskName = "Task 1", TaskDescription = "Task 1 Description" });
					context.TimesheetEntries.Add(new TimesheetEntry { TaskName = "Task 2", TaskDescription = "Task 2 Description" });
					context.SaveChanges();

					// Find out the ID of the last entry so that we can find it
					idToFind = context.TimesheetEntries.ToList().Last().Id;
				}

				// Run the test against another instance of the context
				using (var context = new TimesheetContext(options))
				{
					var repository = new TimesheetRepository(context);
					var result = repository.Find(idToFind);
					Assert.Equal("Task 2", result.TaskName);
					Assert.Equal("Task 2 Description", result.TaskDescription);
				}
			}

			[Fact]
			public void Returns_Null_If_Entry_Is_Not_Found()
			{
				var options = BuildContextOptions(nameof(Returns_Timesheet_Entry_If_Found));

				// Set up the test against one instance of the context
				using (var context = new TimesheetContext(options))
				{
					context.Database.EnsureDeleted();
					context.TimesheetEntries.Add(new TimesheetEntry { TaskName = "Task 1", TaskDescription = "Task 1 Description" });
					context.TimesheetEntries.Add(new TimesheetEntry { TaskName = "Task 2", TaskDescription = "Task 2 Description" });
					context.SaveChanges();
				}

				// Run the test against another instance of the context
				using (var context = new TimesheetContext(options))
				{
					var repository = new TimesheetRepository(context);
					var result = repository.Find(-1);
					Assert.Null(result);
				}
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
					Assert.Empty(result);
				}
			}
		}

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
					context.Database.EnsureDeleted();
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

		public class Stop
		{
			[Fact]
			public void Updates_Entry_End_Time_If_Entry_Exists()
			{
				var options = BuildContextOptions(nameof(Updates_Entry_End_Time_If_Entry_Exists));

				long idToStop;

				// Set up the test against one instance of the context
				using (var context = new TimesheetContext(options))
				{
					context.Database.EnsureDeleted();
					context.TimesheetEntries.Add(new TimesheetEntry { TaskName = "Task 1", TaskDescription = "Task 1 Description" });
					context.TimesheetEntries.Add(new TimesheetEntry { TaskName = "Task 2", TaskDescription = "Task 2 Description" });
					context.SaveChanges();

					// Find out the ID of the first entry so that we can stop it
					idToStop = context.TimesheetEntries.ToList().First().Id;

					// make sure the end time is not already set
					Assert.Null(context.TimesheetEntries.ToList().First().TaskEnd);
				}

				// Run the test against another instance of the context
				using (var context = new TimesheetContext(options))
				{
					var repository = new TimesheetRepository(context);
					repository.Stop(idToStop);
				}

				// Use a separate instance of the context to verify that the end time was updated
				using (var context = new TimesheetContext(options))
				{
					Assert.True(AreDatesApproximatelyEqual((DateTime)context.TimesheetEntries.First().TaskEnd, DateTime.Now, 2));
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
					Assert.Throws<InvalidOperationException>(() => repository.Stop(1));
				}
			}
		}

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

		/// <summary>
		/// Determines if the specified <see cref="T:DateTime"/>s are equal within the given number of seconds.
		/// </summary>
		/// <returns><c>true</c>, if the DateTime objects are approximately equal within the specified tolerance, <c>false</c> otherwise.</returns>
		/// <param name="date1">The first DateTime object to compare.</param>
		/// <param name="date2">The second DateTime object to compare.</param>
		/// <param name="secondsTolerance">The number of seconds to use for the comparison tolerance.</param>
		private static bool AreDatesApproximatelyEqual(DateTime date1, DateTime date2, int secondsTolerance)
		{
			return date1.Ticks < (date2.Ticks + secondsTolerance * 1000);
		}
	}
}
