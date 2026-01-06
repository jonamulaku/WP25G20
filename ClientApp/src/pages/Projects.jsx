import CarnivalImg from "@/assets/images/carnival.png";

export default function Projects() {
    return (
        <>
            {/* CONTAINER */}
            <div className="pl-[144px] max-md:pl-[20px]">

                {/* CONTENT BUTTON */}
                <div className="text-[15px] text-[#515151]">

                    <p>
                        Home <span className="text-[10px]">{">"}</span>{" "}
                        <span className="text-[#14b85a]">Projects</span>
                    </p>

                    <h1 className="text-[#14b85a]">Our Works</h1>

                    <p className="mb-[38px]">
                        Dynamic marketing solutions to drive community engagement and social
                        purpose
                    </p>

                    <button
                        className="w-[180px] h-[45px] rounded-[50px] 
                                   bg-[#14b85a] border border-[#14b85a] 
                                   text-white cursor-pointer
                                   max-md:w-[120px] max-md:h-[36px]"
                    >
                        All
                    </button>

                    <button
                        className="w-[180px] h-[45px] rounded-[50px] 
                                   bg-transparent border border-[#14b85a] 
                                   text-[#14b85a] cursor-pointer
                                   max-md:w-[120px] max-md:h-[36px]"
                    >
                        Education
                    </button>

                    <button
                        className="w-[180px] h-[45px] rounded-[50px] 
                                   bg-transparent border border-[#14b85a] 
                                   text-[#14b85a] cursor-pointer
                                   max-md:w-[120px] max-md:h-[36px]"
                    >
                        Corporate
                    </button>
                </div>

                {/* GRID */}
                <div
                    className="grid grid-cols-4 gap-[20px] mt-[90px] mr-[144px]
                               max-md:grid-cols-1 max-md:gap-[12px]
                               max-md:mt-[20px] max-md:mr-0
                               max-md:pl-[18px] max-md:pr-[20px]"
                >

                    {/* ITEM 1 */}
                    <div className="border border-[#e7f2e8] rounded-[17px] text-center">
                        <div>
                            <img src={CarnivalImg} alt="pic" className="w-full" />
                            <h1 className="text-[#14b85a] text-[23px] max-md:mb-[5px]">
                                Lorem ipsum
                            </h1>
                            <p className="pb-[24px] max-md:pb-0">
                                Lorem ipsum dolor
                            </p>
                        </div>
                    </div>

                    {/* ITEM 2 */}
                    <div className="border border-[#e7f2e8] rounded-[17px] text-center">
                        <div>
                            <img src={CarnivalImg} alt="pic" className="w-full" />
                            <h1 className="text-[#14b85a] text-[23px] max-md:mb-[5px]">
                                Lorem ipsum
                            </h1>
                            <p className="pb-[24px] max-md:pb-0">
                                Lorem ipsum dolor
                            </p>
                        </div>
                    </div>

                    {/* ITEM 3 */}
                    <div className="border border-[#e7f2e8] rounded-[17px] text-center">
                        <div>
                            <img src={CarnivalImg} alt="pic" className="w-full" />
                            <h1 className="text-[#14b85a] text-[23px] max-md:mb-[5px]">
                                Lorem ipsum
                            </h1>
                            <p className="pb-[24px] max-md:pb-0">
                                Lorem ipsum dolor
                            </p>
                        </div>
                    </div>

                    {/* ITEM 4 */}
                    <div className="border border-[#e7f2e8] rounded-[17px] text-center">
                        <div>
                            <img src={CarnivalImg} alt="pic" className="w-full" />
                            <h1 className="text-[#14b85a] text-[23px] max-md:mb-[5px]">
                                Lorem ipsum
                            </h1>
                            <p className="pb-[24px] max-md:pb-0">
                                Lorem ipsum dolor
                            </p>
                        </div>
                    </div>

                    {/* ITEM 5 */}
                    <div className="border border-[#e7f2e8] rounded-[17px] text-center">
                        <div>
                            <img src={CarnivalImg} alt="pic" className="w-full" />
                            <h1 className="text-[#14b85a] text-[23px] max-md:mb-[5px]">
                                Lorem ipsum
                            </h1>
                            <p className="pb-[24px] max-md:pb-0">
                                Lorem ipsum dolor
                            </p>
                        </div>
                    </div>

                    {/* ITEM 6 */}
                    <div className="border border-[#e7f2e8] rounded-[17px] text-center">
                        <div>
                            <img src={CarnivalImg} alt="pic" className="w-full" />
                            <h1 className="text-[#14b85a] text-[23px] max-md:mb-[5px]">
                                Lorem ipsum
                            </h1>
                            <p className="pb-[24px] max-md:pb-0">
                                Lorem ipsum dolor
                            </p>
                        </div>
                    </div>

                    {/* ITEM 7 */}
                    <div className="border border-[#e7f2e8] rounded-[17px] text-center">
                        <div>
                            <img src={CarnivalImg} alt="pic" className="w-full" />
                            <h1 className="text-[#14b85a] text-[23px] max-md:mb-[5px]">
                                Lorem ipsum
                            </h1>
                            <p className="pb-[24px] max-md:pb-0">
                                Lorem ipsum dolor
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
