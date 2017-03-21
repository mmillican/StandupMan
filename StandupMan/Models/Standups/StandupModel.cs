using Amazon.DynamoDBv2.DataModel;
using System;

namespace StandupMan.Models.Standups
{
    [DynamoDBTable("Standup")]
    public class StandupModel
    {
        [DynamoDBProperty("StandupId"), DynamoDBHashKey]
        public string Id { get; set; }

        [DynamoDBProperty("UserId")]
        public string UserId { get; set; }
        [DynamoDBProperty("Name")]
        public string Name { get; set; }
        [DynamoDBProperty("Email")]
        public string Email { get; set; }
        [DynamoDBProperty("FullName")]
        public string FullName { get; set; }
        
        [DynamoDBProperty("Date"), DynamoDBRangeKey]
        public string Date { get; set; }

        [DynamoDBProperty("Yesterday")]
        public string Yesterday { get; set; }
        [DynamoDBProperty("Today")]
        public string Today { get; set; }

        [DynamoDBProperty("Location")]
        public string Location { get; set; }
        [DynamoDBProperty("Roadblocks")]
        public string Roadblocks { get; set; }

        public void GenerateId()
        {
            Id = $"{UserId}_{Date}";
        }
    }

    public class PostStandupModel
    {
        public string UserId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }

        public string StandupDate { get; set; }

        public string Message { get; set; }
    }
}
