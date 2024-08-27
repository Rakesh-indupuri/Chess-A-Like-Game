import { useNavigate } from "react-router-dom"
export const HomePage=()=>{
    const navigate=useNavigate()
    return(
        <div className="h-screen flex flex-col justify-center items-center">
            <div className=" font  font-chivo flex justify-center text-3xl">
                Welcome to Chess A-like Game. Click below button to Proceed.
            </div>            
            <button className="mt-2 flex justify-center font font-libre py-2.5 px-5 me-2 mb-2 text-lg font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 
            focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            onClick={()=>navigate("/game")}>
                Play Game
            </button>
            <div className="mt-4">
                <button 
                    className="text-blue-500 underline"
                    onClick={() => navigate("/rules")}
                >
                    Learn Rules
                </button>
            </div>
        </div>
    )
}