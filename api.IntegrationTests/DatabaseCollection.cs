namespace api.IntegrationTests;
using Xunit;

[CollectionDefinition("DatabaseCollection")]
public class DatabaseCollection : ICollectionFixture<CustomWebApplicationFactory>
{
  
}