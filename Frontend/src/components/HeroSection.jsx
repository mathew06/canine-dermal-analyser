import video1 from "../assets/video5.mp4"
import video2 from "../assets/video6.mp4"
const HeroSection = () => {
    return (
        <div className="flex flex-col items-center mt-6 lg:mt-20">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide">
                <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-transparent bg-clip-text">Canine Dermal Analyser </span> for Skin Disease Detection <span className="bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">{" "}in Dogs</span>
            </h1>
            <p className="mt-10 text-lg text-center text-neutral-500 max-w-4xl">
                Early identification of skin disease in dogs from lesion images with the help of Artificial Intelligence.
            </p>
            <div className="flex justify-center my-10">
                <a href="/upload" className="bg-blue-600 hover:bg-blue-800 hover:text-gray-200 py-3 px-4 mx-3 rounded-md">
                    Upload an image
                </a>
            </div>
            <div className="flex mt-10 justify-center">
                <video autoPlay loop muted className="rounded-lg w-1/2 border border-blue-700 shadow-blue-400 mx-2 my-4">
                    <source src={video1} type="video/mp4" />
                    Your browser does not support video tag.
                </video>
                <video autoPlay loop muted className="rounded-lg w-1/2 border border-blue-700 shadow-blue-400 mx-2 my-4">
                    <source src={video2} type="video/mp4" />
                    Your browser does not support video tag.
                </video>
            </div>
        </div>
    )
};

export default HeroSection;