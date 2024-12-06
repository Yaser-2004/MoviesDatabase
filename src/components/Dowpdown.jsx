import { SlArrowDown } from "react-icons/sl";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Dowpdown = ({text, g, l, w}) => {

    const [hover, setHover] = useState(false); //hover state
    const [genres, setGenres] = useState([]); //fetching available movie genres
    const [seriesGenres, setSeriesGenres] = useState([]); //fetching available series genres
    const languages = ["English", "French", "German", "Hindi", "Italian", "Kannada", "Japanese", "Spanish"]; //available languages
    const lanCodes = ["en", "fr", "nl", "hi", "it", "kn", "ja", "es"];

    //fetching available genres in the starting
    useEffect(() => {
        //movie genres
        const fetchGenres = async () => {
            try {
                const response = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${import.meta.env.VITE_APP_API_KEY}`);
                setGenres(response.data.genres);
            } catch (error) {
                console.error("Error fetching movie genres", error);
            }
        }

        //series genres
        const fetchseriesGenres = async () => {
            try {
                const response = await axios.get(`https://api.themoviedb.org/3/genre/tv/list?api_key=${import.meta.env.VITE_APP_API_KEY}`);
                setSeriesGenres(response.data.genres);
            } catch (error) {
                console.error("Error fetching series genres", error);
            }
        }

        fetchGenres();
        fetchseriesGenres();
    }, [])
    

  return (
    <div className="dd relative flex gap-2 items-center text-white hover:cursor-pointer pb-2" onMouseEnter={() => {setHover(true)}} onMouseLeave={() => {setHover(false)}}>
      <p className="text-xl max-sm:text-sm font-semibold">{text}</p>
      <SlArrowDown className="text-xs mt-1" />


      <div className={`absolute ${hover ? 'block' : 'hidden'} flex flex-col gap-2 rounded-lg bg-gray-700 top-8 max-sm:top-6 pt-3 pl-2 mr-4 w-44 shadow-lg ${w ? 'max-sm:right-0' : null} shadow-slate-600 h-80 overflow-y-auto`}>
        {g ? genres.map((genre, i) => {
            return <Link key={i} to={`/movie/${genre.name}/${genre.id}`}><p className="border-b border-gray-800 pb-3 hover:opacity-80" >{genre.name}</p></Link>
        }) : null}

        {l ? languages.map((language, i) => {
            return <Link key={i} to={`/movie/language/${lanCodes[i]}`} ><p className="border-b border-gray-800 pb-3 hover:opacity-80" >{language}</p></Link>
        }) : null}

        {w ? seriesGenres.map((webS, i) => {
            return <Link key={i} to={`/tv/${webS.name}/${webS.id}`} ><p className="border-b border-gray-800 pb-3 hover:opacity-80" >{webS.name}</p></Link>
        }) : null}
      </div>
    </div>
  )
}

Dowpdown.propTypes = {
    text: PropTypes.string,
    g: PropTypes.bool,
    l: PropTypes.bool,
    w: PropTypes.bool
}

export default Dowpdown
