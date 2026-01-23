using System;
using Microsoft.AspNetCore.Mvc;

namespace RPSLS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RpslsController : ControllerBase
    {
        private static readonly string[] Choices =
        {
            "Rock",
            "Paper",
            "Scissors",
            "Lizard",
            "Spock"
        };

        [HttpGet]
        [Route("Cpu")]
        public string Cpu()
        {
            var random = new Random();
            return Choices[random.Next(Choices.Length)];
        }

        [HttpGet]
        [Route("Play/{playerChoice}")]
        public string Play(string playerChoice)
        {
            var random = new Random();
            var cpuChoice = Choices[random.Next(Choices.Length)];
            var result = GetResult(playerChoice, cpuChoice);

            return $"Player: {playerChoice} | CPU: {cpuChoice} | Result: {result}";
        }

        private string GetResult(string player, string cpu)
        {
            
            if (player == cpu)
            {
                return "Tie";
            }

            if (player == "Rock" && (cpu == "Scissors" || cpu == "Lizard"))
            {
                return "Win";
            }
            else if (player == "Paper" && (cpu == "Rock" || cpu == "Spock"))
            {
                return "Win";
            }
            else if (player == "Scissors" && (cpu == "Paper" || cpu == "Lizard"))
            {
                return "Win";
            }
            else if (player == "Lizard" && (cpu == "Spock" || cpu == "Paper"))
            {
                return "Win";
            }
            else if (player == "Spock" && (cpu == "Scissors" || cpu == "Rock"))
            {
                return "Win";
            }

            return "Lose";
        }

    }
}

