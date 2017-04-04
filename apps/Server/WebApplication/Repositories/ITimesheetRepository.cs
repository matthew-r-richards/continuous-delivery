using System.Collections.Generic;
using WebApplication.Models;

namespace WebApplication.Repositories
{
	public interface ITimesheetRepository
	{
		/// <summary>
		/// Gets all Timesheet Entries.
		/// </summary>
		/// <returns>A collection of <see cref="T:WebApplication.Model.TimesheetEntry"/>.</returns>
		IEnumerable<TimesheetEntry> GetAll();
	}
}