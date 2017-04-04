using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication.Models
{
	public class TimesheetEntry
	{
		/// <summary>
		/// Gets or sets the entry ID.
		/// </summary>
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public long Id { get; set; }

		/// <summary>
		/// Gets or sets the name of the task.
		/// </summary>
		public string TaskName { get; set; }

		/// <summary>
		/// Gets or sets the task description.
		/// </summary>
		public string TaskDescription { get; set; }
	}
}
