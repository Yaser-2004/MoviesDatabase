import axios from "axios";
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom";
import Card from "../components/Card";
import { HiArrowSmLeft, HiArrowSmRight } from "react-icons/hi";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Loader from "../components/Loader";


const List = () => {

    const {id, lan, tid, title, pageNum, genre} = useParams(); //obtaining id(for movies), tid(for tv series), title(for search functionality), page number and genre from parameters
    const [movieList, setMovieList] = useState([]);
    const page = Number(pageNum) || 1;
    const [isLoading, setIsLoading] = useState(true); //loading state for loaders


    const fetchMovieList = async () => {

        const cacheKey = id ? `${genre}_movie_page_${page}` : tid ? `${genre}_tv_page_${page}` : lan ? `${lan}_lan_page_${page}` : `${title}_page_${page}`;  //caching key is created
        const cachedMovies = localStorage.getItem(cacheKey); //fetching movies available in local storage
    
        //if present in local storage return movies
        if (cachedMovies) {
            setMovieList(JSON.parse(cachedMovies));
            setIsLoading(false);
            console.log("Loaded movies list from cache");
            return;
        }

        // if not in local storage fetch from api
        try {
            let list;

            //for movies filtered on genre 
            if (id) {
                const response = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_APP_API_KEY}&with_genres=${id}&page=${page}`);
                list = response.data.results;
                //setMovieList(response.data.results);
            }

            //for movies filtered on languages
            if (lan) {
                const response = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_APP_API_KEY}&with_original_language=${lan}&page=${page}`);
                list = response.data.results;
                //setMovieList(response.data.results);
            }

            //for tv series filtered on genres
            if (tid) {
                const response = await axios.get(`https://api.themoviedb.org/3/discover/tv?api_key=${import.meta.env.VITE_APP_API_KEY}&with_genres=${tid}&page=${page}`);
                list = response.data.results;
                console.log("res -------> ",response);
                //setMovieList(response.data.results);
            }

            //for search functionality
            if (title) {
                const response = await axios.get(`https://api.themoviedb.org/3/search/multi?api_key=${import.meta.env.VITE_APP_API_KEY}&query=${title}&page=${page}`);

                const filteredResults = response.data.results.filter(
                    (result) => result.media_type === "movie" || result.media_type === "tv"
                );
                list = filteredResults;
                //console.log("res ------> ", filteredResults);

                //setMovieList(filteredResults);
            }

            localStorage.setItem(cacheKey, JSON.stringify(list)); //setting in local storage
            setMovieList(list);
            console.log("Fetched list from API and stored in cache");
        } catch (error) {
            //error handling
            if (tid) {toast.error("Error fetching tv series", { //if error in fetching tv series
                position: 'top-center'
            })} else {
                toast.error("Error fetching movies", { //if error in fetching movies
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
