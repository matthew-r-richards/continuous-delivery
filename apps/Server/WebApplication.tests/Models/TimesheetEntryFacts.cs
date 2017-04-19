using System;
using WebApplication.Models;
using Xunit;

namespace Models
{
	public class TimesheetEntryFacts
	{
		public class Constructor
		{
			[Fact]
			public void Sets_TaskStart_To_Current_Time()
			{
				var entry = new TimesheetEntry();
				Assert.True(AreDatesApproximatelyEqual(entry.TaskStart, DateTime.Now, 5));
			}

			[Fact]
			public void Sets_TaskEnd_To_Null()
			{
				var entry = new TimesheetEntry();
				Assert.Null(entry.TaskEnd);
			}
		}

		/// <summary>
		/// Determines if the specified <see cref="T:DateTime"/>s are equal within the given number of seconds.
		/// </summary>
		/// <returns><c>true</c>, if the DateTime objects are approximately equal within the specified tolerance, <c>false</c> otherwise.</returns>
		/// <param name="date1">The first DateTime object to compare.</param>
		/// <param name="date2">The second DateTime object to compare.</param>
		/// <param name="secondsTolerance">The number of seconds to use for the comparison tolerance.</param>
		private static bool AreDatesApproximatelyEqual(DateTime date1, DateTime date2, int secondsTolerance)
		{
			return date1.Ticks < (date2.Ticks + secondsTolerance * 1000);
		}
	}
}
