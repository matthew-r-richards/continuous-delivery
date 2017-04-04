using System;
using WebApplication.Controllers;
using Xunit;

namespace Controllers
{
	public class EntriesControllerFacts
	{
		public class Constructor
		{
			[Fact]
			public void Throws_Null_Exception_For_Null_Repository()
			{
				var ex = Assert.Throws<ArgumentNullException>(() => new EntriesController(null));
				Assert.Contains("repository", ex.Message);
			}
		}
	}
}
