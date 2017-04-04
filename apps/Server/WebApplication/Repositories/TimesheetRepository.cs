﻿using System;
using System.Collections.Generic;
using WebApplication.DatabaseContext;
using WebApplication.Models;

namespace WebApplication.Repositories
{
	public class TimesheetRepository : ITimesheetRepository
	{
		/// <summary>
		/// The database context.
		/// </summary>
		private TimesheetContext context;

		public TimesheetRepository(TimesheetContext context)
		{
			this.context = context;
		}

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
