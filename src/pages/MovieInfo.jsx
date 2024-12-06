import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Loader from "../components/Loader";


const MovieInfo = () => {

    const {id, tid} = useParams();
    const [movieInfo, setMovieInfo] = useState({});
    const [director, setDirector] = useState({});
    const [actors, setActors] = useState([]);
    const [numberOfSeasons, setNumberOfSeasons] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const fetchMovieDetails = async () => {
        try {
            if (id) {
                const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=f626527768d4e789af98c53f48a0d3bd`);
                setMovieInfo(response.data);
            }

            if (tid) {
                const response = await axios.get(`https://api.themoviedb.org/3/tv/${tid}?api_key=f626527768d4e789af98c53f48a0d3bd`);
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

    const fetchCredits = async () => {
        try {
            let response;
            if (id) response = await axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=f626527768d4e789af98c53f48a0d3bd`);
            if (tid) response = await axios.get(`https://api.themoviedb.org/3/tv/${tid}/credits?api_key=f626527768d4e789af98c53f48a0d3bd`);

            const resultDirector = response.data.crew.find((crewMember) => (crewMember.job === "Director") || (crewMember.known_for_department === "Directing"));
            
            if (resultDirector) {
                setDirector(resultDirector);
            } else {
                console.log("Director not found");  
            }

            const resultActor = response.data.cast
                                                .filter((actor) => actor.known_for_department === "Acting")
                                                .sort((a, b) => a.order - b.order)
                                                .slice(0, 3);
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

    useEffect(() => {
        fetchMovieDetails();
        fetchCredits();
        //fetchDirector();
    }, [id, tid])

    if (isLoading) {
        return <Loader />; 
    }
    

  return (
    <div className="flex flex-col items-center sm:h-screen justify-center text-white max-sm:text-sm max-sm:p-2">
        <ToastContainer />
      <div className="movieCard bg-gray-900 p-6 flex max-sm:flex-col max-sm:p-6 gap-6 w-2/3 max-sm:w-full pr-14 relative">
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
                
                <div className="flex max-sm:flex-wrap gap-1">
                <span className="font-semibold">Actors: </span>
                    {actors.map((actor, i) => {
                        return <p key={i}>{actor.name}{i<(actors?.length)-1 ? ", " : ""}</p>
                    })}
                </div>
            </div> : null}
        </div>
      </div>
    </div>
  )
}

export default MovieInfo
