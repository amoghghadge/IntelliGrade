export default function Footer() {
  return (
    <footer className="mt-auto mb-0 w-[100%] bg-[#0B6FFF] text-white">
      <div className="max-w-screen-xl mx-auto py-8 px-4 sm:px-6 lg:px-8 ml-[13%]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h2 className="text-lg font-bold">IntelliGrade</h2>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="/">IntelliGrade</a>
              </li>
              <li>About</li>
              <li>Pricing</li>
              <li>Contact</li>
            </ul>
          </div>
          <div className="hidden md:block">
            <h2 className="text-lg font-bold">IntelliGrade</h2>
          </div>
          <div>
            <h2 className="text-lg font-bold">Pricing</h2>
          </div>
          <div>
            <h2 className="text-lg font-bold">Contact us</h2>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="signin" className="hover:underline">
                  Email
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/ivan-zheng-5532b8267/"
                  className="hover:underline"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-bold">Join our newsletter</h2>
            <form className="flex mt-4">
              <input
                type="email"
                placeholder="Email address"
                className="mr-2 p-2 rounded-lg border-2 border-white bg-transparent text-white placeholder-white focus:outline-none focus:border-white"
              />
              <button
                type="submit"
                className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
}
