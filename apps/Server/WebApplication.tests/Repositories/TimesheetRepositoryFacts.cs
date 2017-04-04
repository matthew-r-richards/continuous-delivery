using System;
using System.Collections.Generic;
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
			}

			[Fact]
			public void Returns_Empty_Collection_If_No_Timesheet_Entries_Exist()
			{
			}

			private void AddTestData(IEnumerable<TimesheetEntry> data)
			{
				
			}
		}
	}
}
