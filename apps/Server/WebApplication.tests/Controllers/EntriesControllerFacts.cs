using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
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

		public class GetById
		{
			[Fact]
			public void Returns_Timesheet_Entry_If_Found()
			{
				// Create some test data
				var testData = new TimesheetEntry { Id = 1, TaskName = "Task 1", TaskDescription = "Task 1 Description" };

				// Mock out the repository to return the test data
				var repository = Substitute.For<ITimesheetRepository>();
				repository.Find(Arg.Any<long>()).Returns(testData);

				// Call the controller
				using (var controller = new EntriesController(repository))
				{
					var response = controller.GetById(1);

					// Check the result
					var result = response as ObjectResult;
					Assert.NotNull(result);
					var entry = result.Value as TimesheetEntry;
					Assert.NotNull(entry);
					Assert.Equal(1, entry.Id);
					Assert.Equal("Task 1", entry.TaskName);
					Assert.Equal("Task 1 Description", entry.TaskDescription);
				}
			}

			[Fact]
			public void Returns_NotFound_If_Timesheet_Entry_Does_Not_Exist()
			{
				// Mock out the repository to return null (entry not found)
				var repository = Substitute.For<ITimesheetRepository>();
				repository.Find(Arg.Any<long>()).Returns(null as TimesheetEntry);

				// Call the controller
				using (var controller = new EntriesController(repository))
				{
					var response = controller.GetById(-1);

					// Check the result
					var result = response as NotFoundResult;
					Assert.NotNull(result);
					Assert.Equal(404, result.StatusCode);
				}
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

		public class Add
		{
			[Fact]
			public void Adds_Entry_To_Database_And_Returns_Location_Of_New_Entry()
			{
				// Create the test entry
				var testData = new TimesheetEntry { TaskName = "New Task", TaskDescription = "New Task Description" };

				// Mock out the repository
				var repository = Substitute.For<ITimesheetRepository>();

				// Call the controller
				using (var controller = new EntriesController(repository))
				{
					var response = controller.Add(testData);

					// Check the repository call
					repository.Received().Add(Arg.Is<TimesheetEntry>(testData));

					// Check the response
					var result = response as CreatedAtRouteResult;
					Assert.NotNull(result);
					var entry = result.Value as TimesheetEntry;
					Assert.NotNull(entry);
					Assert.Equal(201, result.StatusCode);
					Assert.Equal("GetEntry", result.RouteName);
					Assert.Equal("New Task", entry.TaskName);
					Assert.Equal("New Task Description", entry.TaskDescription);
				}
			}
			[Fact]
			public void Returns_Bad_Request_If_Entry_Is_Null()
			{
				// Mock out the repository
				var repository = Substitute.For<ITimesheetRepository>();

				// Call the controller
				using (var controller = new EntriesController(repository))
				{
					var result = controller.Add(null);

					// Check the repository was not called
					repository.DidNotReceive().Add(Arg.Any<TimesheetEntry>());

					// Check the response
					var status = result as StatusCodeResult;
					Assert.NotNull(status);
					Assert.Equal(400, status.StatusCode);
				}
			}
		}

		public class Delete
		{
			[Fact]
			public void Removes_Timesheet_Entry_From_Database_If_It_Exists()
			{
				// Create the test entry
				var testData = new TimesheetEntry { Id = 1, TaskName = "Task", TaskDescription = "Task Description" };

				// Mock out the repository to return the test data (entry found)
				var repository = Substitute.For<ITimesheetRepository>();
				repository.Find(1).Returns(testData);

				// Call the controller
				using (var controller = new EntriesController(repository))
				{
					var result = controller.Delete(1);

					// Check the repository was called to find the entry
					repository.Received().Find(1);

					// Check the repository was called to delete the entry
					repository.Received().Delete(1);

					// Check the response
					var status = result as StatusCodeResult;
					Assert.NotNull(status);
					Assert.Equal(204, status.StatusCode);
				}
			}

			[Fact]
			public void Returns_NotFound_If_Timesheet_Entry_Does_Not_Exist()
			{
				// Mock out the repository to return null (entry not found)
				var repository = Substitute.For<ITimesheetRepository>();
				repository.Find(Arg.Any<long>()).Returns(null as TimesheetEntry);

				// Call the controller
				using (var controller = new EntriesController(repository))
				{
					var response = controller.Delete(-1);

					// Check the result
					var result = response as NotFoundResult;
					Assert.NotNull(result);
					Assert.Equal(404, result.StatusCode);

					// Check the repository was not called to delete the entry
					repository.DidNotReceive().Delete(Arg.Any<long>());
				}
			}
		}
	}
}
