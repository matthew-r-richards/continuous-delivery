﻿using System;
using System.Collections.Generic;
using System.Linq;
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

		/// <summary>
		/// Initializes a new instance of the <see cref="T:WebApplication.Repositories.TimesheetRepository"/> class.
		/// </summary>
		/// <param name="context">The database Context to use.</param>
		public TimesheetRepository(TimesheetContext context)
		{
			if (context == null)
			{
				throw new ArgumentNullException(nameof(context));
			}

			this.context = context;
		}

		/// <summary>
		/// Add the specified entry.
		/// </summary>
		/// <param name="entry">The <see cref="T:WebApplication.Model.TimesheetEntry"/> to add.</param>
		public void Add(TimesheetEntry entry)
		{
			this.context.TimesheetEntries.Add(entry);
			this.context.SaveChanges();
		}

		/// <summary>
		/// Delete the entry with the specified Id.
		/// </summary>
		/// <param name="Id">The Id of the <see cref="T:WebApplication.Model.TimesheetEntry"/> to delete.</param>
		/// <exception cref="InvalidOperationException">The entry to delete does not exist.</exception>
		public void Delete(long Id)
		{
			var entry = this.context.TimesheetEntries.First(te => te.Id == Id);
			this.context.Remove(entry);
			this.context.SaveChanges();
		}

		/// <summary>
		/// Gets all Timesheet Entries.
		/// </summary>
		/// <returns>A collection of <see cref="T:WebApplication.Model.TimesheetEntry"/>.</returns>
		public IEnumerable<TimesheetEntry> GetAll()
		{
			return this.context.TimesheetEntries;
		}
	}
}
