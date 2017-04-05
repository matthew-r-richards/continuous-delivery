using System.Collections.Generic;
using WebApplication.Models;

namespace WebApplication.Repositories
{
	public interface ITimesheetRepository
	{
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

		/// <summary>
		/// Finds the Timesheet Entry with the specified Id.
		/// </summary>
		/// <returns>A <see cref="T:WebApplication.Model.TimesheetEntry"/> if found, null otherwise.</returns>
		/// <param name="id">The Id of the Entry.</param>
		TimesheetEntry Find(long id);

		/// <summary>
		/// Gets all Timesheet Entries.
		/// </summary>
		/// <returns>A collection of <see cref="T:WebApplication.Model.TimesheetEntry"/>.</returns>
		IEnumerable<TimesheetEntry> GetAll();
	}
}