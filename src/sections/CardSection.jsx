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

    const {pageNum} = useParams();
    const page = Number(pageNum) || 1;
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchMovies = async () => {
        const cacheKey = `movies_page_${page}`;
        const cachedMovies = localStorage.getItem(cacheKey);
    
        if (cachedMovies) {
            setMovies(JSON.parse(cachedMovies));
            setIsLoading(false);
            console.log("Loaded movies from cache");
            return;
        }
    
        try {
            const response = await axios.get(
                `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}&api_key=${import.meta.env.VITE_APP_API_KEY}`
            );
    
            localStorage.setItem(cacheKey, JSON.stringify(response.data.results));
            setMovies(response.data.results);
            console.log("Fetched movies from API and stored in cache");
        } catch (error) {
            toast.error("Error fetching movies :(", {
                position: "top-center",
            });
            console.error("Error fetching movies: ", error);
        } finally {
            setIsLoading(false);
        }
    };
    

    useEffect(() => {
        setIsLoading(true);
        fetchMovies()
    }, [page])

    if (isLoading && page > 1) {
        return <Loader />
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
