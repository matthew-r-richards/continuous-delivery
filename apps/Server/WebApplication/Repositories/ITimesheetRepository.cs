using System.Collections.Generic;
using WebApplication.Models;

namespace WebApplication.Repositories
{
	public interface ITimesheetRepository
	{
		IEnumerable<TimesheetEntry> GetAll();
	}
}