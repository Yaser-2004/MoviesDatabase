import { useState } from "react";
import Dowpdown from "../components/Dowpdown"
import { IoIosSearch } from "react-icons/io";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const Nav = () => {

    const [query, setQuery] = useState(""); //query from search bar
    const [shows, setShows] = useState([]); //shows from api

    const handleSearch = async (e) => {
        setQuery(e.target.value); //set query from search bar
        if(e.target.value.trim()) { //trim white spaces
            try {
                const response = await axios.get(`https://api.themoviedb.org/3/search/multi?api_key=${import.meta.env.VITE_APP_API_KEY}&query=${e.target.value}`);

                //filtering the response to get movies and tv series
                const filteredResults = response.data.results.filter(
                    (result) => result.media_type === "movie" || result.media_type === "tv"
                );
                console.log("res ------> ", filteredResults);
                setShows(filteredResults); //set the filetered results to shows state
            } catch (error) {
                //error handling
                toast.error("Error searching the query", {
                    position: 'top-center'
                })
                console.error(error);
            }
        } else {
            setShows([]); //clear the shows state if the search bar is empty
        }
    }

  return (
    <>
        <ToastContainer />
        <div className="Nav flex max-sm:flex-col max-sm:gap-10 justify-between text-white items-center p-10">
            <p className="flex-auto text-3xl font-bold">MoviesDB</p>
            <div className="flex-auto relative max-sm:w-full">
                <form action="" className="w-full flex items-center">
                <input type="text" placeholder="What do you want to search" value={query} onChange={handleSearch} className={`w-11/12 ${shows.length > 0 ? 'rounded-tl-xl max-sm:rounded-tl-lg' : 'rounded-l-xl max-sm:rounded-l-lg'} max-sm:text-xs h-12 max-sm:h-8 pl-4 max-sm:pl-1 text-black`} />
                <ul className={`absolute z-10 top-12 bg-gray-100 text-gray-500 w-full pl-4 pb-4 rounded-b-xl ${shows.length > 8 ? 'h-80' : ''} ${shows.length == 0 ? 'hidden' : ''} overflow-y-auto`}>
                    {shows.map((show, i) => {
                        return <Link key={i} to={show.media_type === 'movie' ? `/movie/${show.id}` : `/tv/${show.id}`}><li className="pb-2 pt-2 border-b hover:cursor-pointer hover:text-black">{show.title || show.name}</li></Link>
                    })}
                </ul>
                <Link className={`h-12 bg-gray-400 ${shows.length>0 ? 'rounded-tr-xl max-sm:rounded-tr-lg' : 'rounded-r-xl max-sm:rounded-r-lg'} w-14 max-sm:w-12 max-sm:h-8 text-3xl max-sm:text-2xl flex justify-center items-center`} to={`/${query}`}><IoIosSearch /></Link>
                </form>
            </div>
        </div>

        <div className="Dropdowns flex gap-6 items-center mt-10 max-sm:mt-3 bg-gray-900 pt-4 pb-4 pl-10 max-sm:pl-4">
            <Dowpdown text="Genre" g={true} l={false} w={false} />
            <Dowpdown text="Language" g={false} l={true} w={false} />
            <Dowpdown text="Web Series" g={false} l={false} w={true} />
        </div>
    </>
  )
}

export default Nav
