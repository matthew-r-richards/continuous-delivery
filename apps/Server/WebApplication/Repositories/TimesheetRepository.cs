using System;
using System.Collections.Generic;
using WebApplication.Models;

namespace WebApplication.Repositories
{
	public class TimesheetRepository : ITimesheetRepository
	{
		/// <summary>
		/// Gets all Timesheet Entries.
		/// </summary>
		/// <returns>A collection of <see cref="T:WebApplication.Model.TimesheetEntry"/>.</returns>
		public IEnumerable<TimesheetEntry> GetAll()
		{
			throw new NotImplementedException();
		}
	}
}
