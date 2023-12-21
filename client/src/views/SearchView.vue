<script setup>
import { onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuery, useInfiniteQuery } from '@tanstack/vue-query';
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';

const route = useRoute();
const router = useRouter();

const fetchSearch = async ({pageParam = 1}) => {
    const res = await fetch(`https://api.rawg.io/api/games?key=${import.meta.env.VITE_API_KEY}&search=${route.query.search}&page=${pageParam}`);
    const data = await res.json();
    return data;
};

const {data, fetchNextPage, isError, isFetching, isFetchingNextPage, refetch} = useInfiniteQuery({
    queryKey: ['search'],
    queryFn: fetchSearch,
    getNextPageParam: (lastPage) => {
        return lastPage.next;
    }
});

const {data: searchData} = useQuery({
    queryFn: fetchSearch
})

watch(route, () => {
    refetch();
})

const handleLoadMore = () => {
    fetchNextPage();
}

onMounted(() => {
    console.log(data)
})
</script>

<template>
    <div class="container">
        <header>
            <Navbar />
        </header>
        <main>
            <div class="search-header">
                <h3 v-if="route.query.search">{{ searchData?.count }} results for "<span class="searchQuery">{{ route.query.search }}</span>"</h3>
                <div v-if="isFetching" class="data-loading">
                    <img class="loader" src="../assets/images/Spinner-1s-200px.svg" alt="">
                    <span>Data loading</span>
                </div>
            </div>
            <div class="search-content">
                <p v-if="isError" class="error-msg">Seems like there's an error with the data. Please try later.</p>
                <p class="no-data-found" v-if="!route.query.search &&!isError">There is no results for "{{ route.query.search }} " </p>
                <div v-else class="infinitScroll" v-for="data in data?.pages">
                    <div v-if="!isError" @click="router.push({path:`/games/${game.id}`})" v-for="game in data?.results" class="card" v-bind:style="{ 'background' : `url(${game.background_image}) center/cover`}">
                    <div class="card-gradiant"></div>
                    <div class="card-details">
                        <p class="card-title">{{ game?.name }}</p>
                        <div class="card-tags">
                            <!-- <p v-for="tag in game?.tags.slice(0,3)" :key="game.id">{{ tag.name }}</p> -->
                        </div>
                        <p class="card-date">{{ game?.released }}</p>
                    </div>
                </div>
                </div>
                <button v-if="route.query.search && !isError" @click="handleLoadMore">
                    <img v-if="isFetchingNextPage" src="../assets/images/Rolling-1s-200px.svg" alt=""> 
                    <span v-else>Load more</span>
                </button>
            </div>
        </main>
    </div>
</template>

<style lang="scss" scoped>
    main {
        margin-top: 4rem;
        padding: 0 4rem;

        @media (max-width: 550px) {
            padding: 0 1rem;
            margin-top: 2rem;
        }

        .search-header {
            display: flex;
            align-items: center;

            h3 {
            color: #666;
            }

            .data-loading {
                display: flex;
                align-items: center;
                font-weight: 600;
                margin-left: 1rem;
            }
        }

        .search-content {
            margin-top: 1rem;
            padding: 2rem 0; 
            border-top: 1px solid grey;
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;

            .error-msg {
                font-size: 1.5rem;
                margin: 0 auto;
            }
            .no-data-found {
                margin: 0 auto;
                font-size: 1.5rem;
                font-weight: 500;
            }

            .infinitScroll {
                display: flex;
                flex-wrap: wrap;
                gap: 1rem;
            }

            button {
                margin: 0 auto;
                padding: 0.5rem 2.5rem;
                background-color: #000;
                border: none;
                border-radius: 5px;

                span {
                    color: #fff;
                }
            }
        }

        .searchQuery {
            font-weight: 600;
        }

        .card {
            position: relative;
            background-color: grey;
            height: 400px;
            width: 300px;
            cursor: pointer;
            
            @media (max-width: 550px) {
                width: 100%;
            }
            
            .card-gradiant {
                height: 100%;
                width: 100%;
                background: rgb(0,0,0);
                background: linear-gradient(360deg, rgba(0,0,0,1) 0%, rgba(255,255,255,0) 100%);
                z-index: 10;
            } 

            .card-details {
                position: absolute;
                bottom: 15px;
                left: 10px;
            }

            .card-title {
                color: white;
                font-size: 1.25rem;
                z-index: 100;
            }

            .card-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 1rem;
                padding: 0.5rem 0;
            }

            .card-tags p {
                color: white;
                font-size: 0.75rem;
                border: 1px solid #fff;
                padding: 0.25rem;
            }

            .card-date {
                color: white;
                font-size: 0.825rem;
                z-index: 100;
            }
        }
    }

</style>