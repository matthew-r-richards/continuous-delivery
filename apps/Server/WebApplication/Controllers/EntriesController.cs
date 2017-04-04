using System;
using Microsoft.AspNetCore.Mvc;
using WebApplication.Repositories;

namespace WebApplication.Controllers
{
	[Route("api/[controller]")]
	public class EntriesController
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
	}
}
