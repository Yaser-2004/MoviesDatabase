import axios from "axios";
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom";
import Card from "../components/Card";
import { HiArrowSmLeft, HiArrowSmRight } from "react-icons/hi";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Loader from "../components/Loader";


const List = () => {

    const {id, lan, tid, title, pageNum, genre} = useParams();
    const [movieList, setMovieList] = useState([]);
    const page = Number(pageNum) || 1;
    const [isLoading, setIsLoading] = useState(true);


    const fetchMovieList = async () => {
        try {
            if (id) {
                const response = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=f626527768d4e789af98c53f48a0d3bd&with_genres=${id}&page=${page}`);
                setMovieList(response.data.results);
            }

            if (lan) {
                const response = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=f626527768d4e789af98c53f48a0d3bd&with_original_language=${lan}&page=${page}`);
                setMovieList(response.data.results);
            }

            if (tid) {
                const response = await axios.get(`https://api.themoviedb.org/3/discover/tv?api_key=f626527768d4e789af98c53f48a0d3bd&with_genres=${tid}&page=${page}`);
                console.log("res -------> ",response);
                setMovieList(response.data.results);
            }

            if (title) {
                const response = await axios.get(`https://api.themoviedb.org/3/search/multi?api_key=f626527768d4e789af98c53f48a0d3bd&query=${title}&page=${page}`);

                const filteredResults = response.data.results.filter(
                    (result) => result.media_type === "movie" || result.media_type === "tv"
                );
                //console.log("res ------> ", filteredResults);

                setMovieList(filteredResults);
            }
        } catch (error) {
            if (tid) {toast.error("Error fetching tv series", {
                position: 'top-center'
            })} else {
                toast.error("Error fetching movies", {
                    position: 'top-center'
                })
            }

            console.error(error)
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        setIsLoading(true);
        fetchMovieList();
    }, [page]);

    if (isLoading) {
        return <Loader />
    }

  return (
    <div className="flex flex-col items-center">
        <ToastContainer />
        <div className="text-white pt-20 flex flex-wrap gap-10 max-sm:gap-6 pb-20 max-sm:pb-10 justify-center">
        {movieList.map((movie, i) => {
            return (movie.media_type === 'tv' || tid ? 
                <Card key={i} image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} title={movie.name+" ("+movie.first_air_date.slice(0, 4)+")"} tid={movie.id} /> :
                <Card key={i} image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} title={movie.original_title+" ("+movie.release_date.slice(0, 4)+")"} id={movie.id} />
            )
        })}
        </div>

        <div className="text-white flex gap-4 items-center text-xl pb-20">
        <Link className={`${page<=1 ? "hidden" : "block"} mt-1 text-2xl`} to={id ? `/movie/${genre}/${id}/page/${page-1}` : `/tv/${genre}/${tid}/page/${page-1}`} ><HiArrowSmLeft /></Link>
        <p className="bg-gray-900 pl-4 pr-4 pt-2 pb-2 rounded-xl">Page {page}</p>
        <Link className="mt-1 text-2xl" to={id ? `/movie/${genre}/${id}/page/${page+1}` : tid ? `/tv/${genre}/${tid}/page/${page+1}` : `/movie/language/${lan}/page/${page+1}` } ><HiArrowSmRight /></Link>
        </div>
    </div>
  )
}

export default List
