"use client";
import Image from "next/image";
import Link from "next/link";

const Destination = () => {
  const destinations = [
    {
      image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29",
      title: "San Francisco Tech Hub",
      description: "Hire from Silicon Valley's top engineering talent pool",
      link: "/hiring/san-francisco"
    },
    {
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9",
      title: "New York Finance Network",
      description: "Find financial experts in the world's business capital",
      link: "/hiring/new-york"
    },
    {
      image: "https://images.unsplash.com/photo-1513804277540-45c1f0e533a9", 
      title: "Austin Creative Community",
      description: "Connect with designers and marketing professionals",
      link: "/hiring/austin"
    },
    {
      image: "https://images.unsplash.com/photo-1494522855154-9297ac14b55f",
      title: "Chicago Business Leaders",
      description: "Recruit experienced executives and operations specialists",
      link: "/hiring/chicago"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className=" mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Global Hiring Destinations</h2>
          <p className="text-lg text-gray-600 max-w-3xl">
            Tap into specialized talent pools from world-class business hubs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination, index) => (
            <Link 
              key={index}
              href={destination.link}
              className="group relative h-[400px] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
            >
              <Image
                src={`${destination.image}?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80`}
                alt={destination.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                quality={100}
                unoptimized={true} // Add this if you're still having issues
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{destination.title}</h3>
                <p className="text-lg mb-4">{destination.description}</p>
                <span className="text-white font-medium hover:underline">
                  Explore talent →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Destination;