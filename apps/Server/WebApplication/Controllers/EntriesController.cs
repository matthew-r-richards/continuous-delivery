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
		/// Gets the Timesheet Entry with the specified Id.
		/// </summary>
		/// <returns>A <see cref="T:WebApplication.Model.TimesheetEntry"/>.</returns>
		/// <param name="id">The Id of the Timesheet Entry to get.</param>
		[HttpGet("{id}", Name = "GetEntry")]
		public IActionResult GetById(long id)
		{
			var entry = this.repository.Find(id);
			if (entry == null)
			{
				return NotFound();
			}

			return new ObjectResult(entry);
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
