using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using WebApplication.Models;
using WebApplication.Repositories;

namespace WebApplication.Controllers
{
	[Route("api/[controller]")]
	public class EntriesController : Controller
	{
		private readonly ITimesheetRepository repository;

		/// <summary>
		/// Initializes a new instance of the <see cref="T:WebApplication.Controllers.EntriesController"/> class.
		/// </summary>
		/// <param name="repository">The <see cref="T:WebApplication.Repositories.ITimesheetRepository"/> implementation to use.</param>
		/// <exception cref="ArgumentNullException">If the repository argument is null.</exception>
		public EntriesController(ITimesheetRepository repository)
		{
			if (repository == null)
			{
				throw new ArgumentNullException(nameof(repository));
			}

			this.repository = repository;
		}

		/// <summary>
		/// Gets all Timesheet Entries.
		/// </summary>
		/// <returns>A collection of <see cref="T:WebApplication.Model.TimesheetEntry"/>.</returns>
		[HttpGet]
		public IEnumerable<TimesheetEntry> GetAll()
		{
			return this.repository.GetAll();
		}
	}
}
