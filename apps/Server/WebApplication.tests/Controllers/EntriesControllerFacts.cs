using System;
using System.Collections.Generic;
using System.Linq;
using NSubstitute;
using WebApplication.Controllers;
using WebApplication.Models;
using WebApplication.Repositories;
using Xunit;

namespace Controllers
{
	public class EntriesControllerFacts
	{
		public class Constructor
		{
			[Fact]
			public void Throws_Null_Exception_For_Null_Repository()
			{
				var ex = Assert.Throws<ArgumentNullException>(() => new EntriesController(null));
				Assert.Contains("repository", ex.Message);
			}
		}

		public class GetAll
		{
			[Fact]
			public void Returns_Timesheet_Entries_From_Repository()
			{
				// Create some test data
				var testData = new List<TimesheetEntry>
				{
					new TimesheetEntry { Id = 1, TaskName = "Task 1", TaskDescription = "Task 1 Description" },
					new TimesheetEntry { Id = 2, TaskName = "Task 2", TaskDescription = "Task 2 Description" }
				};

				// Mock out the repository to return the test data
				var repository = Substitute.For<ITimesheetRepository>();
				repository.GetAll().Returns(testData);

				// Call the controller
				using (var controller = new EntriesController(repository))
				{
					var result = controller.GetAll();

					// Check the result
					Assert.Equal(2, result.Count());

					var resultList = result.ToList();

					// Check Entry 1
					Assert.Equal(1, resultList[0].Id);
					Assert.Equal("Task 1", resultList[0].TaskName);
					Assert.Equal("Task 1 Description", resultList[0].TaskDescription);

					// Check Entry 2
					Assert.Equal(2, resultList[1].Id);
					Assert.Equal("Task 2", resultList[1].TaskName);
					Assert.Equal("Task 2 Description", resultList[1].TaskDescription);
				}
			}

			[Fact]
			public void Returns_Empty_Collection_If_No_Timesheet_Entries_Exist()
			{
				// Mock out the repository to return an empty collection (no entries)
				var repository = Substitute.For<ITimesheetRepository>();
				repository.GetAll().Returns(new List<TimesheetEntry>());

				// Call the controller
				using (var controller = new EntriesController(repository))
				{
					var result = controller.GetAll();

					// Check the result
					Assert.Empty(result);
				}
			}
		}
	}
}
