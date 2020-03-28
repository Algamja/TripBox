using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TT.Controllers
{
    public class AccountController : Controller
    {
        // GET: /<controller>/
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult SignUp()
        {
            return View();
        }

        [Route("loginSubmit")]
        public IActionResult Submit(string id, string password)
        {
            if (string.IsNullOrEmpty(id) || string.IsNullOrEmpty(password))
            {
                return new JsonResult(0);
            }
            else
            {
                if (id.Equals("admin") && password.Equals("1234"))
                {
                    return new JsonResult(1);
                }
                else if (id.Equals("kjm") && password.Equals("1234"))
                {
                    return new JsonResult(1);
                }
            }
            //1외의 모든 값은 로그인 실패
            return new JsonResult(0);
        }
    }
}
