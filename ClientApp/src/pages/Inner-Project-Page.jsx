import StrategicIcon from "@/assets/icons/strategic.svg";

import Image1 from "@/assets/images/image 1.png";
import Image14 from "@/assets/images/image 14.png";
import Image15 from "@/assets/images/image 15.png";
import Image16 from "@/assets/images/image 16.png";
import Image17 from "@/assets/images/image 17.png";
import Image18 from "@/assets/images/image 18.png";
import Image19 from "@/assets/images/image 19.png";
import Image20 from "@/assets/images/image 20.png";
import Image21 from "@/assets/images/image 21.png";

export default function ProjectDetails() {
    return (
        <>
            {/* SECTION ONE */}
            <div className="flex gap-[100px] px-[144px] max-md:flex-col max-md:px-[18px]">

                <div className="main-content">

                    <p className="text-[15px] text-[#515151]">
                        Home <span className="text-[10px]">{">"}</span> Projects{" "}
                        <span className="text-[10px]">{">"}</span>{" "}
                        <span className="text-[#14b85a]">Carnival</span>
                    </p>

                    <h1 className="text-[#14b85a] tracking-wide">
                        Carnival
                    </h1>

                    <p className="text-[15px] text-[#515151]">
                        Lorem ipsum dolor sit amet consectetur. Eget tempus sed nullam aliquam
                        enim malesuada sagittis placerat. Viverra vitae sit vel aliquet tellus
                        mauris erat. Nisl orci tortor sed sem. Vitae ornare non magna proin
                        quam. Sapien vestibulum gravida convallis venenatis commodo. Nulla dui
                        massa nulla vitae neque pharetra. Ornare cras sit a scelerisque at et
                        hendrerit.
                    </p>

                    <p className="text-[15px] text-[#515151]">
                        Massa tortor faucibus faucibus pharetra blandit. Porttitor luctus
                        volutpat ultrices ullamcorper vel. Vitae facilisis nulla diam varius.
                        Duis dui lacinia malesuada ante dapibus volutpat velit commodo. Metus
                        proin gravida massa.
                    </p>

                    <button
                        className="w-[182px] h-[48px] rounded-[20px]
                                   border-2 border-[#14b85a]
                                   flex items-center justify-center gap-[12px]
                                   text-[#14b85a] cursor-pointer mt-[29px]"
                    >
                        {/* SVG PRESERVED */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="28"
                            viewBox="0 0 24 28"
                            fill="none"
                        >
                            <path
                                d="M12 25.4546C9.21523 25.4546 6.54451 24.2478 4.57538 22.0996C2.60625 19.9515 1.5 17.038 1.5 14C1.5 10.9621 2.60625 8.04858 4.57538 5.90044C6.54451 3.7523 9.21523 2.54548 12 2.54548C14.7848 2.54548 17.4555 3.7523 19.4246 5.90044C21.3938 8.04858 22.5 10.9621 22.5 14C22.5 17.038 21.3938 19.9515 19.4246 22.0996C17.4555 24.2478 14.7848 25.4546 12 25.4546Z"
                                fill="#15B75A"
                            />
                        </svg>
                        Watch Video
                    </button>
                </div>

                <img
                    src={Image1}
                    alt="pic"
                    className="max-md:h-[250px] max-md:mt-[-60px]"
                />
            </div>

            {/* SERVICES */}
            <div
                className="w-full h-[250px] bg-[url('@/assets/images/test.png')]
                           mt-[140px] mb-[116px]"
            >
                <div className="flex pt-[50px] pl-[144px] max-md:block max-md:pl-[29px]">

                    <div className="flex-[0.3] max-md:flex max-md:gap-[19px]">
                        <img src={StrategicIcon} alt="icon" className="max-md:w-[75px]" />
                        <h2 className="text-[#14b85a] text-[40px] font-bold">
                            Our Services
                        </h2>
                    </div>

                    <div className="flex flex-1">

                        <div className="flex-[0.5] text-[#666665]">
                            <ul>
                                <li>Video Production</li>
                                <li>Graphic Design</li>
                                <li>Above the line media</li>
                                <li>Digital marketing</li>
                                <li>Strategic campaign planning</li>
                                <li>Public relations</li>
                            </ul>
                        </div>

                        <div className="text-[#666665]">
                            <ul>
                                <li>Design and branding</li>
                                <li>Onsite design production</li>
                                <li>Cinematography</li>
                                <li>Charitable partnerships</li>
                                <li>Community affairs</li>
                            </ul>
                        </div>

                    </div>
                </div>
            </div>

            {/* EVENTS */}
            <div className="flex gap-[90px] mx-[144px] mt-[480px] max-md:flex-col max-md:m-0">

                <div className="border-[3px] border-[#e7f2e8] rounded-[20px] text-center pb-[15px] max-md:border-none">
                    <img src={Image14} alt="pic" className="mt-[-400px] max-md:m-0 max-md:w-[350px]" />
                    <h2 className="text-[#14b85a] text-[35px] text-left pl-[40px]">
                        Lorem ipsum dolor sit <br /> amet
                    </h2>
                    <p className="text-[#515151] text-left px-[40px]">
                        Lorem ipsum dolor sit amet consectetur. Arcu quis massa neque sociis.
                        Vitae in purus velit eu.
                    </p>
                </div>

                <div className="border-[3px] border-[#e7f2e8] rounded-[20px] text-center pb-[15px] max-md:border-none">
                    <img src={Image15} alt="pic" className="mt-[-400px] max-md:m-0 max-md:w-[350px]" />
                    <h2 className="text-[#14b85a] text-[35px] text-left pl-[40px]">
                        Lorem ipsum dolor
                    </h2>
                    <p className="text-[#515151] text-left px-[40px]">
                        Lorem ipsum dolor sit amet consectetur.
                    </p>
                </div>

            </div>

            {/* GALLERY */}
            <div className="relative pl-[144px] mt-[80px] max-md:pl-0">

                <div className="absolute left-[300px] top-0 right-0 bottom-[-50px] bg-[#f1f7ef] border-[3px] border-[#e1e6de] -z-10 max-md:hidden"></div>

                <h2 className="text-[#14b85a] my-[40px] max-md:ml-[20px]">
                    Gallery
                </h2>

                <div className="grid grid-cols-4 gap-[20px] mb-[30px] max-md:grid-cols-2 max-md:gap-[12px]">

                    <img src={Image16} alt="Img" />
                    <img src={Image17} alt="Img" />
                    <img src={Image18} alt="Img" />
                    <img src={Image19} alt="Img" />
                    <img src={Image20} alt="Img" />
                    <img src={Image21} alt="Img" />

                </div>
            </div>

            {/* BUTTONS */}
            <div className="flex justify-center gap-[215px] mt-[100px] max-md:gap-[15px]">
                <button className="w-[250px] h-[45px] rounded-[50px] border-2 border-[#14b85a] text-[#14b85a]">
                    Back to Projects
                </button>
                <button className="w-[250px] h-[45px] rounded-[50px] border-2 border-[#14b85a] text-[#14b85a]">
                    What's new
                </button>
            </div>
        </>
    );
}
