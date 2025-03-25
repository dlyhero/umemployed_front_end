import { FaBuilding, FaUserTie } from "react-icons/fa";

export default function NavLinks() {
  return (
    <ul className="hidden md:flex items-center gap-8">
      <li>
        <a
          href="/companies"
          className=" flex  items-center group"
        >
          <FaBuilding className="text-gray-600 group-hover:text-brand text-base transition-colors duration-300" />
          <span className="mt-0.5 text-base group-hover:text-brand transition-colors duration-300">
            Companies
          </span>
        </a>
      </li>
      <li>
        <a href="/jobs" className=" flex  items-center group">
          <FaUserTie className="text-gray-600 group-hover:text-brand text-base transition-colors duration-300" />
          <span className="mt-0.5 text-base group-hover:text-brand transition-colors duration-300">
            Hire Talent
          </span>
        </a>
      </li>
    </ul>
  );
}
