//Loader Component
import {TailSpin} from "react-loader-spinner"; //from react-loader-spinner

const Loader = () => {
    return (
        <div className='loader flex justify-center items-center h-screen'>
            <TailSpin
                visible={true}
                height="80"
                width="80"
                color="white"
                ariaLabel="tail-spin-loading"
                radius="1"
                wrapperStyle={{}}
                wrapperClass=""
            />
        </div>
    )
}

export default Loader
