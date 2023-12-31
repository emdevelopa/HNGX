"use client"
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect, useCallback } from 'react';
import { FaChevronRight } from "react-icons/fa";

export default function Featured() {
    const [movies, setMovies] = useState([]);
    const [favMovies, setFavMovies] = useState([]);
    const [favMovies2, setFavMovies2] = useState([]); // Array to store favorite movie IDs
    const [movieDetails, setMovieDetails] = useState({});
    const apiKey = '2d02ad9838a96f971164752877c1f7ec';

    useEffect(() => {
        const apiUrl = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`;

        fetch(apiUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setMovies(data.results);
            })
            .catch((error) => {
                console.error('There was a problem with the fetch operation:', error);
                // Display an error message to the user
            });
    }, [apiKey]);

  
    
    const fetchMovieDetails = useCallback((movieId) => {
        const apiUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`;
        
        fetch(apiUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                // Update the movieDetails state with the fetched data
                setMovieDetails((prevDetails) => ({
                    ...prevDetails,
                    [movieId]: data,
                }));
                if (Array.isArray(movies)) {
                    const movieDetails2 = movies.slice(0, 10);
                    setFavMovies2(movieDetails2)
                  } else {
                    console.log("movieDetails is not an array or is empty");
                  }
            })
            .catch((error) => {
                console.error('There was a problem with the fetch operation:', error);
            });
    
    }, [movies,apiKey]);
    
    useEffect(() => {
        // Fetch movie details for each movie in the initial movies list
        movies.forEach((movie) => {
            fetchMovieDetails(movie.id);
        });
    }, [movies, fetchMovieDetails]);
    

    const isMovieFavorited = (movieId) => {
        // Check if the movieId is in the favMovies array
        return favMovies.includes(movieId);
    };

    const toggleFavMovie = (movieId) => {
        if (isMovieFavorited(movieId)) {
            // If the movie is already favorited, remove it
            setFavMovies(favMovies.filter((id) => id !== movieId));
        } else {
            // If the movie is not favorited, add it to the list
            setFavMovies([...favMovies, movieId]);
        }
    };

  

    return (
        <>
            <section className="p-20 max-md-[650px]:p-5">
                <div className="flex justify-between">
                    <h1 className="font-bold text-[36px] max-md-[400px]:text-[20px]">Featured Movie</h1>
                    <div className="flex text-[#BE123C] items-center gap-x-4 max-md-[400px]:gap-x-1"><p>See more </p> <FaChevronRight /></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">

                    {favMovies2.map((movie) => (
                        
                        <div data-testid="movie-card" key={movie.id}>
                          
                            <div className="flex flex-col gap-2  relative">
                            <Link className='absolute h-[25em] w-full' href={`/movies#id=${movie.id}`}>
                                <div className='h-[25em] w-full z-10 absolute hover:bg-[#0000007d]'></div>
                            </Link>
                                <div data-testid="movie-poster" className='h-[25em] p-6 flex justify-between bg-cover bg-center bg-no-repeat relative'  style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movie.poster_path})` }}>
                                    <p className='bg-[#f3f4f680] z-30 rounded-[2em] w-[50%] h-[2em] flex justify-center items-center px-2'>Movie</p>
                                    <div className={`rounded-[50%] h-[2em] z-30 w-[2em] flex justify-center ${isMovieFavorited(movie.id) ? 'bg-red-600' : 'bg-[#f3f4f680]'}`} onClick={() => {
                                        toggleFavMovie(movie.id);
                                    }}>
                                        <Image src="Heart.svg" alt="searchIcon" height={0} width={20} style={{ width: "auto", height: "auto" }} />
                                    </div>
                                   
                                </div>
                                
                                <p data-testid="movie-release-date">{movieDetails[movie.id]?.production_companies[0].origin_country} {movieDetails[movie.id]?.release_date.substring(0,4)} </p>
                                <h2 data-testid="movie-title" className='font-bold text-[24px]'>{movie.title}</h2>
                                <div className="flex gap-8 justify-between">
                                    <div className="flex gap-2 items-center">
                                        <Image src="IMBD.svg" alt="imdb" width={40} height={40} style={{ width: "auto", height: "auto" }} />
                                        <p>86.0 / 100</p>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <Image src="tomato.svg" alt="tomato" width={20} height={50} style={{ width: "auto", height: "auto" }} />
                                        <p>{Math.floor(movieDetails[movie.id]?.vote_average * 10)}%   </p>
                                    </div>
                                </div>
                                <p className='font-bold'>{movieDetails[movie.id]?.genres?.map(genre => genre.name).join(', ')}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    )
}
