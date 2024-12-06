//import axios from "axios"
import PropTypes from "prop-types";
import { Link } from "react-router-dom";


const Card = ({image, title, id, tid}) => {

  return (
    <div className="Card rounded-xl max-sm:rounded-sm flex flex-col items-center h-[26rem] max-sm:h-72 w-52 max-sm:w-32 bg-gray-900 pb-4">
        <div className="h-auto w-full hover:opacity-70 transition-all ease-in-out hover:cursor-pointer duration-200">
            {id ? <Link to={`/movie/${id}`}><img src={image} alt="" className='rounded-t-xl max-sm:rounded-t-sm' /></Link> : null}
            {tid ? <Link to={`/tv/${tid}`}><img src={image} alt="" className='rounded-t-xl max-sm:rounded-t-sm' /></Link> : null}
        </div>
        <div className="h-auto w-full text-center text-white font-semibold hover:opacity-70 transition-all ease-in-out hover:cursor-pointer duration-200 max-sm:my-2">
            <Link to={`/movie/${id}`}><p className='text-lg max-sm:text-sm p-2'>{title}</p></Link>
        </div>
    </div>
  )
}

Card.propTypes = {
    image: PropTypes.string,
    title: PropTypes.string,
    id: PropTypes.number,
    tid: PropTypes.number,
}

export default Card
