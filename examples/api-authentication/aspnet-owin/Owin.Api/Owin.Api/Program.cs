using Microsoft.Owin.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Owin.Api
{
    class Program
    {
        static void Main(string[] args)
        {
            // Start OWIN host 
            var server = WebApp.Start<Startup>(url: "http://localhost:1337/");
            Console.WriteLine("Web API listening at http://localhost:1337/");
            Console.WriteLine("Press ENTER to terminate");
            Console.ReadLine(); 
        }
    }
}
