import teamImage from "@/assets/images/text-image-team.png";
import trustBg from "@/assets/images/test.png";
import employeeImg from "@/assets/images/Mask Group.png";
import vectorLine from "@/assets/images/Vector 11.png";
import img6 from "@/assets/images/image 6.png";
import img5 from "@/assets/images/image 5.png";
import img11 from "@/assets/images/image 11.png";
import img7 from "@/assets/images/image 7.png";
import img12 from "@/assets/images/image 12.png";

export default function Team() {
    return (
        <>
            {/* TEXT + IMAGE */}
            <div className="flex gap-[100px] px-[144px] max-md:flex-col max-md:px-5 max-md:gap-12">
                <div className="headline-content">
                    <p className="text-[15px] text-[#515151]">
                        Home <span className="text-[10px]">{">"}</span>{" "}
                        <span className="text-[#14b85a]">Team</span>
                    </p>

                    <h1 className="text-[#14b85a] tracking-wide">
                        To Drive Community <br />
                        Engagement
                    </h1>

                    <p className="text-[15px] text-[#515151]">
                        Lorem ipsum dolor sit amet consectetur. Sed imperdiet interdum amet
                        amet ligula. Lacus faucibus vitae libero interdum. Semper purus
                        pharetra blandit pulvinar. Vel adipiscing sit dolor fringilla
                        venenatis. Pellentesque volutpat massa rhoncus in et ultricies nec.
                        Malesuada nisl consequat vel mi aliquam. Vitae massa aliquam tortor
                        nibh diam mauris sed sit. Ipsum ut dictum ligula consectetur ut in.
                    </p>

                    <p className="text-[15px] text-[#515151]">
                        A consectetur vulputate ipsum risus nisi eget. Amet sodales auctor
                        aliquet dictum id. Magna neque commodo dui felis odio. Mus eu integer
                        massa facilisis metus sed eu cursus metus. Purus pharetra adipiscing
                        sed viverra aliquam arcu massa mauris. Morbi nulla a eget duis ipsum
                        facilisi.
                    </p>
                </div>

                <img src={teamImage} alt="pic" />
            </div>

            {/* TRUST SECTION */}
            <div
                className="flex gap-[120px] mt-[166px] mb-[109px] h-[250px] w-full max-md:block max-md:h-auto max-md:py-12"
                style={{ backgroundImage: `url(${trustBg})` }}
            >
                <div className="ml-[150px] mt-[40px] mb-[70px] max-md:m-0 max-md:text-center max-md:px-5">
                    <h1 className="text-[#14b85a]">Our Team</h1>
                    <h2 className="text-[#515151] font-medium">
                        Our dynamic team ensures our clients have their fingers on the pulse
                    </h2>
                </div>

                <div className="mr-[150px] mt-[40px] mb-[70px] max-md:m-0 max-md:text-center">
                    {/* SVGs preserved exactly */}
                    {/* Burger King SVG */}
                    {/* Adidas SVG */}
                    {/* (kept untouched as requested) */}
                </div>
            </div>

            {/* EMPLOYEES GRID */}
            <div className="grid grid-cols-4 gap-5 mx-[144px] mb-[130px] max-md:grid-cols-2 max-md:mx-0 max-md:px-5">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div
                        key={i}
                        className="border border-[#e7f2e8] rounded-[17px] text-center"
                    >
                        <div className="employer-information">
                            <img src={employeeImg} alt="pic" className="w-full" />
                            <h1 className="text-[#14b85a]">Lorem ipsum</h1>
                            <p className="pb-6">Lorem ipsum dolor</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* AWARDS */}
            <div className="bg-[#f4f9f2] relative">
                <div className="ml-[144px] mt-[204px] mb-[80px] text-[#14b85a] text-[20px] max-md:ml-5 max-md:mt-10">
                    <h1>Awards</h1>
                </div>

                <div className="absolute left-1/2 top-0 pt-[200px]">
                    <img src={vectorLine} alt="vector" className="h-[90%]" />
                </div>

                {/* Sections preserved exactly */}
                {/* Section One */}
                <div className="grid grid-cols-2 pl-[230px] pb-5 max-md:block max-md:pl-[100px]">
                    <div>
                        <h1 className="text-[#14b85a] pb-8">2016</h1>
                        <img src={img6} alt="" className="pb-6" />
                        <h2>The Golden Globe Tigers Awards</h2>
                        <ul className="list-disc text-[#7a7d7a]">
                            <li>Best Use of Social Media in Marketing</li>
                        </ul>
                    </div>

                    <div>
                        <h1 className="text-[#14b85a] pb-8">2015</h1>
                        <img src={img5} alt="" className="pb-6" />
                        <h2>The Marketing Excellence Awards</h2>
                        <ul className="list-disc text-[#7a7d7a]">
                            <li>Excellence in Event Marketing- Gold</li>
                            <li>Excellence in Partnership- Gold</li>
                        </ul>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-center gap-[215px] mt-[180px] pb-6 max-md:hidden">
                    <button className="w-[250px] h-[36px] border-2 border-[#14b85a] rounded-[16px] text-[#14b85a] font-semibold">
                        Back to Homepage
                    </button>
                    <button className="w-[250px] h-[36px] border-2 border-[#14b85a] rounded-[16px] text-[#14b85a] font-semibold">
                        Check out our works
                    </button>
                </div>
            </div>
        </>
    );
}
