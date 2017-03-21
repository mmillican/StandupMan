using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using StandupMan.Models.Standups;
using Amazon.DynamoDBv2;
using Amazon.Runtime;
using Amazon;
using StandupMan.Configuration;
using Microsoft.Extensions.Options;
using Amazon.DynamoDBv2.DataModel;
using System.Text.RegularExpressions;
using System;

namespace StandupMan.Controllers
{
    [Route("standups")]
    public class StandupsController : Controller
    {
        private readonly AwsSettings _awsSettings;

        private readonly AmazonDynamoDBClient _dynamoClient;

        public StandupsController(IOptions<AwsSettings> awsOptions)
        {
            _awsSettings = awsOptions.Value;
            _dynamoClient = new AmazonDynamoDBClient(new BasicAWSCredentials(_awsSettings.AccessKey, _awsSettings.SecretKey), RegionEndpoint.USEast1);
        }

        //[HttpGet("find")]
        //public async Task<IActionResult> Find(string userId, DateTime date)
        //{

        //}

        [HttpPost("")]
        public async Task<IActionResult> Create([FromBody] PostStandupModel model)
        {
            var context = new DynamoDBContext(_dynamoClient);

            var standup = new StandupModel
            {
                UserId = model.UserId,
                Name = model.Name,
                Email = model.Email,
                FullName = model.FullName,
                Date = model.StandupDate
            };
            
            standup.GenerateId();

            var regex = new Regex(@"^\s*(?:yesterday)\s*:\s*(?'yesterday'[^\r\n]+)[\r\n]+\s*^\s*(?:today)\s*:\s*(?'today'[^\r\n]+)[\r\n]+\s*(?:location)\s*:\s*(?'location'[^\r\n]+)([\r\n]+\s*(?:roadblocks?\s*:\s*(?'roadblocks'[^\r\n]+)))?", RegexOptions.Multiline | RegexOptions.IgnoreCase);
            var match = regex.Match(model.Message);

            standup.Yesterday = match.Groups["yesterday"].Value;
            standup.Today = match.Groups["today"].Value;
            standup.Location = match.Groups["location"].Value;
            standup.Roadblocks = match.Groups["roadblocks"]?.Value;
            
            await context.SaveAsync(standup);

            return Created("", standup);
        }
    }
}