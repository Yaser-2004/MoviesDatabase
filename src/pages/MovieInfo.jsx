import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Loader from "../components/Loader";


const MovieInfo = () => {

    const {id, tid} = useParams(); //fetching id(movies id) and tid(tv series id) from url parameters
    const [movieInfo, setMovieInfo] = useState({}); 
    const [director, setDirector] = useState({}); //show director
    const [actors, setActors] = useState([]); //show actors
    const [numberOfSeasons, setNumberOfSeasons] = useState(1); // no. of seasons for tv series
    const [isLoading, setIsLoading] = useState(true);
    const [trailerUrl, setTrailerUrl] = useState(""); //url for trailer

    const fetchMovieDetails = async () => {
        //fetching movie and series details from api
        try {

            //for movies
            if (id) {
                const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${import.meta.env.VITE_APP_API_KEY}`);
                setMovieInfo(response.data);
            }

            //for tv series
            if (tid) {
                const response = await axios.get(`https://api.themoviedb.org/3/tv/${tid}?api_key=${import.meta.env.VITE_APP_API_KEY}`);
                setMovieInfo(response.data);
                setNumberOfSeasons(response.data.number_of_seasons);
            }
            //console.log("movie info: ----> ", movieInfo);
            
        } catch (error) {
            toast.error("Error fetching details", {
                position: 'top-center'
            })
            console.log(error);
        }
    }

    //fetching the credits(for actors and directors) from api
    const fetchCredits = async () => {
        try {
            let response;
            if (id) response = await axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${import.meta.env.VITE_APP_API_KEY}`);
            if (tid) response = await axios.get(`https://api.themoviedb.org/3/tv/${tid}/credits?api_key=${import.meta.env.VITE_APP_API_KEY}`);

            //finding the director from the crew
            const resultDirector = response.data.crew.find((crewMember) => (crewMember.job === "Director") || (crewMember.known_for_department === "Directing"));
            
            //if director available
            if (resultDirector) {
                setDirector(resultDirector);
            } else {
                console.log("Director not found");  
            }

            //filetring the cast to get the actors
            const resultActor = response.data.cast
                                                .filter((actor) => actor.known_for_department === "Acting")
                                                .sort((a, b) => a.order - b.order) //sorting the top 3 actors 
                                                .slice(0, 3);
            
            //if actors available
            if (resultActor) {
                setActors(resultActor);
            } else {
                console.log("Actors not found");
            }
            
            
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    } 

    //fetching show trailer
    const fetchTrailer = async (id) => {
        try {
            let response;

            if (id) response = await axios.get(`https://api.themoviedb.org/3/movie/${id}/videos?&api_key=${import.meta.env.VITE_APP_API_KEY}`);
            if (tid) response = await axios.get(`https://api.themoviedb.org/3/tv/${id}/videos?&api_key=${import.meta.env.VITE_APP_API_KEY}`);
            console.log("-------->", response);
            

            //finding the trailer from the result
            const trailer = response.data.results.find((video) => (
                video.type === 'Trailer' && video.site === 'YouTube' //video type trailer
            ));
            if (trailer) setTrailerUrl(`https://www.youtube.com/embed/${trailer.key}`); //setting the trailer url
        } catch (error) {
            console.log("Error fetching trailer: ", error);
        }
    }

    useEffect(() => {
        fetchTrailer(id ? id : tid); //trailer for movie or tv series
        fetchMovieDetails();
        fetchCredits();
        //fetchDirector();
    }, [id, tid])

    if (isLoading) {
        return <Loader />; 
    }
    

  return (
    <div className="flex flex-col items-center  justify-center text-white max-sm:text-sm max-sm:p-2">
        <ToastContainer />
      <div className="movieCard bg-gray-900 p-6 flex flex-col max-sm:flex-col max-sm:p-6 gap-6 w-2/3 max-sm:w-full relative pt-10 pb-10 mt-20 mb-20 max-sm:mb-2 max-sm:mt-2">
        <div className="flex gap-6 max-sm:flex-col">
            {movieInfo.poster_path ? (
                <div className="max-sm:flex max-sm:justify-center"><img src={`https://image.tmdb.org/t/p/w500${movieInfo.poster_path}`} alt="" className="max-sm:w-40 h-64 max-w-60 border border-gray-700" /></div>
            ) : <p>No Image Available</p>}
            <div>
                <h2 className="font-bold text-3xl max-sm:text-xl">{movieInfo.title || movieInfo.name} <span className="font-thin text-base">({(movieInfo.release_date || movieInfo.first_air_date)?.slice(0, 4)})</span></h2>
                <div className="flex gap-1 mb-4 border-b pb-4 border-gray-700">
                    {movieInfo.genres?.map((genre, i) => {
                        return <p key={i} className="font-thin text-sm">{genre.name}{i<(movieInfo.genres?.length)-1 ? ", " : ""}</p>
                    })}
                </div>
                <p className="rating text-base font-thin mb-2"><span className="font-semibold">Rating:</span> {movieInfo.vote_average}/10 from {movieInfo.vote_count} users</p>
                <p className="mb-4 font-thin">{movieInfo.overview}</p>
                <p className="text-2xl max-sm:text-xl font-semibold mb-4 pb-4 border-gray-700 border-b">{movieInfo.tagline}</p>

                {tid ? <p className="font-thin">
                    <span className="font-semibold">Season: </span>
                    {numberOfSeasons}
                </p> : null}
                {Object.entries(director).length > 0 ? <p className="font-thin">
                    <span className="font-semibold">Director: </span>
                    {director?.name}
                </p> : null}
                {actors.length > 0 ? <div className="font-thin flex items-center gap-1">
                    
                    <div className="flex flex-wrap gap-1">
                    <span className="font-semibold">Actors: </span>
                        {actors.map((actor, i) => {
                            return <p key={i}>{actor.name}{i<(actors?.length)-1 ? ", " : ""}</p>
                        })}
                    </div>
                </div> : null}
            </div>
        </div>
        {trailerUrl ? (
            <div className="video-container mt-10 max-sm:mt-4">
            <iframe
                src={trailerUrl}
                title="Movie Trailer"
                className="w-full h-[28rem] max-sm:h-56"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
            </div>
        ) : (
            <p>Trailer not available</p>
        )}
      </div>
    </div>
  )
}

export default MovieInfo
