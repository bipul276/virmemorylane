import React from "react";

const Hero = () => {
  const handleStartExploring = () => {
    const exploreSection = document.getElementById("explore-section");
    if (exploreSection) {
      exploreSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      className="relative w-full h-[90vh] flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/path-to-your-background.jpg')" }}
    >
      <div className="absolute inset-0 bg-white bg-opacity-60"></div>
      <div className="relative text-center max-w-2xl">
        <h2 className="text-5xl font-bold text-gray-900">
          We bring the past to life
        </h2>
        <p className="mt-4 text-gray-700">
          Explore how places have transformed over time with our AI-powered historical imaging.
        </p>
        <button
          onClick={handleStartExploring}
          className="mt-6 bg-orange-500 text-white px-6 py-3 rounded shadow-lg hover:bg-orange-600 transition"
        >
          Start Exploring
        </button>
      </div>
    </section>
  );
};

export default Hero;
