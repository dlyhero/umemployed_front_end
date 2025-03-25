import React from "react";

const Companies = () => {
  const companies = [
    {
      id: 661,
      name: "UmEmployed",
      logo: "https://umemployeds1.blob.core.windows.net/umemployedcont1/company/logos/logo-white_nOWQZ0i.png",
      industry: "Technology",
      link: "/company/info/661/",
    },
  ];

  return (
    <div className="container max-w-7xl mx-auto px-4 lg:px-6 py-12">
      {/* Section Header */}
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
          Top Hiring Companies
        </h2>
        <p className="text-gray-500 mt-2 text-base max-w-xl mx-auto">
          Discover opportunities from companies actively hiring on our platform.
        </p>
      </div>

      {/* Companies List */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
        {companies.map((company) => (
          <a
            key={company.id}
            className="bg-white w-full h-[250px] rounded-lg p-1 duration-200 group block border border-gray-200"
            href={company.link}
          >
            <div className="flex flex-col h-full">
              <div className="w-full h-[120px] rounded-md bg-gray-100 group-hover:bg-white duration-200 relative overflow-hidden">
                <div className="absolute w-full h-full blur-3xl opacity-0 group-hover:opacity-100 duration-200">
                  <div className="absolute left-[50%] w-[50%] aspect-square bg-orange-400 rounded-full opacity-50"></div>
                  <div className="absolute left-0 w-[50%] top-[60%] aspect-square bg-yellow-400 rounded-full opacity-50"></div>
                </div>
                <div className="absolute rounded-lg overflow-hidden top-6 w-full flex flex-row justify-center">
                  <img
                    src={company.logo}
                    alt={`${company.name} Logo`}
                    className="w-[60px] h-[60px] object-cover rounded-full"
                  />
                </div>
              </div>
              <div className="h-[120px] group-hover:h-32 w-full duration-200 p-3 md:p-4 z-10">
                <div className="w-fit p-1.5 rounded-md bg-gray-100 flex flex-row items-center gap-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 text-[#1e90ff]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                    ></path>
                  </svg>
                  <div className="text-xs font-medium">{company.industry}</div>
                </div>
                <h3 className="text-lg font-bold tracking-tight mt-3 truncate">
                  {company.name}
                </h3>
                <div className="text-[#1e90ff] font-medium h-0 opacity-0 group-hover:opacity-100 group-hover:h-5 duration-[300ms] hover:text-black group-hover:mt-3 flex items-center gap-1">
                  <div>Visit Company</div>
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 512 512"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="48"
                      d="m268 112 144 144-144 144m124-144H100"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Call to Action Button */}
      <div className="mt-12 text-center">
        <a
          href="/company/companies/"
          className="inline-block bg-[#1e90ff] hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-full transition transform hover:scale-105 duration-300"
        >
          Explore All Companies
        </a>
      </div>
    </div>
  );
};

export default Companies;
