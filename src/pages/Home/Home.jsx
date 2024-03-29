import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, Outlet } from 'react-router-dom'
import { getTrendingMovies } from 'services/movies'
import MoviesList from 'components/MoviesList/MoviesList'
import Loader from 'components/Loader/Loader'
import BasicPagination from 'components/BasicPagination/BasicPagination'
import ScrollToTop from 'components/ScrollToTop/ScrollToTop'

import css from 'pages/Home/Home.module.css'


const Home = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    // const location = useLocation();
    // const backLinkHref = useRef(location.state?.from ?? '/');
    // console.log(backLinkHref.current);
    // console.log(location);

    useEffect(() => {
        const setNumberPage = (currentPage) => { 
            if (currentPage > 1) { 
                setSearchParams({ page: currentPage });
            }
        }

        setNumberPage(page);
        getMovies(page);
    }, [page, setSearchParams]);

    useEffect(() => {
        const urlPage = searchParams.get('page');
        if (urlPage) {
            setPage(Number(urlPage));
        }         
    }, [searchParams]);

    const changePage = (_, page) => {
        setPage(page);
    }

    const getMovies = async (page) => { 
        try {
            setIsLoading(true);
            const response = await (getTrendingMovies(page))
            setMovies(() => page > 1 ? [...response.results] : response.results);
            setTotalPages(response.total_pages >= 500 ? 500 : response.total_pages);
        } catch (error) {
            // change:
           setError(error);
        } finally { 
           setIsLoading(false);
        }
    }

    return (
        <Suspense fallback={<Loader />}>
            <section>
                {error && <h1>{error}</h1>}
                {isLoading ? <Loader /> :
                    <>
                        <Outlet />
                        <h1 className={css.title}>Trending movies</h1>
                        <MoviesList movies={movies} page={page} />
                        <div className={css.paginationWrapper}>
                            <BasicPagination count={totalPages} changePage={changePage} currentPage={page} />
                        </div>
                        <ScrollToTop />
                    </>
                }
            </section>
        </Suspense>
    );
}


export default Home;
