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
			this.repository = repository ?? throw new ArgumentNullException(nameof(repository));
		}

		/// <summary>
		/// Gets the Timesheet Entry with the specified Id.
		/// </summary>
		/// <returns>A <see cref="T:WebApplication.Model.TimesheetEntry"/>.</returns>
		/// <param name="id">The Id of the Timesheet Entry to get.</param>
		/// <response code="200">Entry found</response>
		/// <response code="404">Entry not found</response>
		[HttpGet("{id}", Name = "GetEntry")]
		[ProducesResponseType(typeof(TimesheetEntry), 200)]
		[ProducesResponseType(typeof(void), 404)]
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
		/// <response code="200">Success</response>
		[HttpGet]
		public IEnumerable<TimesheetEntry> GetAll()
		{
			return this.repository.GetAll();
		}

		/// <summary>
		/// Add the specified Timesheet Entry.
		/// </summary>
		/// <returns>The created <see cref="T:WebApplication.Model.TimesheetEntry"/>.</returns>
		/// <param name="entry">The Timesheet Entry to add.</param>
		/// <response code="201">Entry created</response>
		/// <response code="400">Invalid Entry supplied</response>
		[HttpPost]
		[ProducesResponseType(typeof(TimesheetEntry), 201)]
		[ProducesResponseType(typeof(void), 400)]
		public IActionResult Add([FromBody]TimesheetEntry entry)
		{
			if (entry == null)
			{
				return BadRequest();
			}

			this.repository.Add(entry);

			return CreatedAtRoute("GetEntry", new { id = entry.Id }, entry);
		}

		/// <summary>
		/// Delete the specified Timesheet Entry.
		/// </summary>
		/// <returns>No content.</returns>
		/// <param name="id">The ID of the Timesheet Entry to delete.</param>
		/// <response code="204">Entry deleted</response>
		/// <response code="404">Entry not found</response>
		[HttpDelete("{id}")]
		public IActionResult Delete(long id)
		{
			var entry = this.repository.Find(id);
			if (entry == null)
			{
				return NotFound();
			}

			this.repository.Delete(id);
			return NoContent();
		}
	}
}
