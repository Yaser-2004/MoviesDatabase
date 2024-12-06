import Card from "../components/Card"
import { useEffect, useState } from "react"
import axios from 'axios'
import { HiArrowSmLeft } from "react-icons/hi";
import { HiArrowSmRight} from "react-icons/hi";
import { Link, useParams } from "react-router-dom";
import 'react-loading-skeleton/dist/skeleton.css'
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Loader from "../components/Loader";


const CardSection = () => {

    const {pageNum} = useParams(); //obtaiting the page number from parameters
    const page = Number(pageNum) || 1; //page number is converted to number and if it is not provided then it is set to 1
    const [movies, setMovies] = useState([]); //movies array is created
    const [isLoading, setIsLoading] = useState(true); //loading state is created

    //function to fetch movies from API
    const fetchMovies = async () => {
        const cacheKey = `movies_page_${page}`; //caching key is created
        const cachedMovies = localStorage.getItem(cacheKey); //cached movies retrieving from local storage
    
        //if movies are cached then they are returned
        if (cachedMovies) {
            setMovies(JSON.parse(cachedMovies));
            setIsLoading(false); //loading state is set to false to stop loading as soon as movies are fetched
            console.log("Loaded movies from cache"); //not necessarily needed
            return;
        }
    
        //if movies are not cached then fetched from API
        try {
            const response = await axios.get(
                `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}&api_key=${import.meta.env.VITE_APP_API_KEY}`
            );
    
            localStorage.setItem(cacheKey, JSON.stringify(response.data.results)); //after fetching movies cached in local storage
            setMovies(response.data.results); //movies set to the state
            console.log("Fetched movies from API and stored in cache");
        } catch (error) {
            //toast for any error during fetching movies
            toast.error("Error fetching movies :(", {
                position: "top-center",
            });
            console.error("Error fetching movies: ", error);
        } finally {
            setIsLoading(false); //after everything loading set to false
        }
    };
    

    useEffect(() => {
        setIsLoading(true); //for every new page, loading set to true
        fetchMovies()
    }, [page])

    if (isLoading && page > 1) {
        return <Loader /> //Loader for page>1, coz one loader is there for the home page initially
    }

  return (
    <>
    <ToastContainer /> 
    <div className="CardSection flex gap-10 max-sm:gap-6 flex-wrap justify-center items-center mt-20 max-sm:mt-10 pb-20">
      {movies.map((movie, i) => {
        return <Card key={i} image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} title={movie.original_title+" ("+movie.release_date.slice(0, 4)+")"} id={movie.id} />;
      })}
    </div>

    <div className="text-white flex gap-4 items-center justify-center pb-20 text-xl">
        <Link className={`${page<=1 ? "hidden" : "block"} mt-1 text-2xl`} to={page > 1 ? `/page/${page-1}` : "/"}><HiArrowSmLeft /></Link>
        <p className="bg-gray-900 pl-4 pr-4 pt-2 pb-2 rounded-xl">Page {page}</p>
        <Link className="mt-1 text-2xl" to={`/page/${page+1}`} ><HiArrowSmRight /></Link>
    </div>
    </>
  )
}

export default CardSection
