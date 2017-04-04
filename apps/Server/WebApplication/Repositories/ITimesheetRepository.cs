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

		/// <summary>
		/// Add the specified entry.
		/// </summary>
		/// <param name="entry">The <see cref="T:WebApplication.Model.TimesheetEntry"/> to add.</param>
		void Add(TimesheetEntry entry);

		/// <summary>
		/// Delete the entry with the specified Id.
		/// </summary>
		/// <param name="Id">The Id of the <see cref="T:WebApplication.Model.TimesheetEntry"/> to delete.</param>
		void Delete(long Id);
	}
}