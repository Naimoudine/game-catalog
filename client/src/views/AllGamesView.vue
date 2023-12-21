<script setup>
import { reactive, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useInfiniteQuery } from '@tanstack/vue-query';
import { useOrderStore } from '../stores/order';
import Navbar from '../components/Navbar.vue';

const router = useRouter();
const store = useOrderStore();

const orderBy = reactive({
    orderByDateDsc: null,
    orderByDateAsc: null,
    orderByRatingDsc: null,
    orderByRatingAsc: null
});

const todaysDate = new Date().toLocaleDateString('en-ca');

watch(orderBy, () => {
    refetch();
});

const fetchGames = async ({pageParam = 1}) => {
    if(orderBy.orderByDateDsc || store.orderBy.orderByDateDsc) {
        const res = await fetch(`https://api.rawg.io/api/games?key=${import.meta.env.VITE_API_KEY}&page=${pageParam}&ordering=-released&dates=2023-11-01,${todaysDate}`);
        const data = await res.json();
        return data;
    } else if(orderBy.orderByDateAsc) {
        const res = await fetch(`https://api.rawg.io/api/games?key=${import.meta.env.VITE_API_KEY}&page=${pageParam}&ordering=released`);
        const data = await res.json();
        return data;
    } else if(orderBy.orderByRatingDsc || store.orderBy.orderByRatingDsc) {
        const res = await fetch(`https://api.rawg.io/api/games?key=${import.meta.env.VITE_API_KEY}&page=${pageParam}&ordering=-rating`);
        const data = await res.json();
        return data;
    } else if(orderBy.orderByRatingAsc) {
        const res = await fetch(`https://api.rawg.io/api/games?key=${import.meta.env.VITE_API_KEY}&page=${pageParam}&ordering=rating`);
        const data = await res.json();
        return data;
    }
    const res = await fetch(`https://api.rawg.io/api/games?key=${import.meta.env.VITE_API_KEY}&page=${pageParam}&ordering=-released&dates=2023-11-01,${todaysDate}`);;
    const data = await res.json();
    return data;
};

const {data, fetchNextPage, isError, isFetching, isFetchingNextPage, refetch} = useInfiniteQuery({
    queryKey: ['games'],
    queryFn: fetchGames,
    getNextPageParam: (lastPage) => {
        return lastPage.next;
    }
});

const handleLoadMore = () => {
    fetchNextPage();
}

const handleOrderBy = (e) => {
    orderBy.orderByRatingAsc = false;
    orderBy.orderByRatingDsc = false;
    orderBy.orderByDateAsc = false;
    orderBy.orderByDateDsc = false;

    switch(e.currentTarget.value) {
        case "dateDsc":
            orderBy.orderByDateDsc = true;
            break;
        case "dateAsc":
            orderBy.orderByDateAsc = true;
            break;
        case "ratingDsc":
            orderBy.orderByRatingDsc = true;
            break;
        case "ratingAsc":
            orderBy.orderByRatingAsc = true;
            break;
    }
}

onMounted(() => {
   const selectedOption = document.querySelector('#orderByFilter');

   if(orderBy.orderByDateAsc || store.orderBy.orderByDateDsc) {
        selectedOption.value = 'dateDsc';
   } else if (orderBy.orderByDateDsc) {
        selectedOption.value = 'dateAsc';
   } else if (orderBy.orderByRatingDsc || store.orderBy.orderByRatingDsc) {
        selectedOption.value = 'ratingDsc';
   } else if (orderBy.orderByRatingAsc) {
        selectedOption.value = 'ratingAsc';
   } else {
    selectedOption.value = 'dateDsc';
   }
})

</script>

<template>
    <div class="container">
        <header>
            <Navbar />
        </header>
        <main>
            <h1>Video Games</h1>
            <div class="filters">
                <select name="orderByFilter" id="orderByFilter" @change="(e) => handleOrderBy(e)">
                    <option value="dateDsc">Release date newest to oldest</option>
                    <option value="dateAsc">Release date oldest to newest</option>
                    <option value="ratingAsc">Worst rated</option>
                    <option value="ratingDsc">Top rated</option>
                </select>
                <div v-if="isFetching" class="data-loading">
                    <img class="loader" src="../assets/images/Spinner-1s-200px.svg" alt="">
                    <span>Data loading</span>
                </div>
            </div>
            <div class="all-games">
                <div v-if="!isError" v-for="gameData in data?.pages" class="infinitScroll">
                    <div @click="router.push({path: `/games/${game.id}`})" v-for="game in gameData.results" :key="game.id" class="card" v-bind:style="{ 'background' : `url(${game.background_image}) center/cover` }">
                        <div class="card-gradiant"></div>
                        <div class="card-details">
                            <p class="card-title">{{ game.name }}</p>
                            <div class="card-tags">
                                <!-- <p v-for="tag in game?.tags.slice(0,3)" :key="game.id">{{ tag.name }}</p> -->
                            </div>
                            <p class="card-date">{{ game.released }}</p>
                        </div>
                    </div>
                </div>
                <p v-else class="error-msg"> seems like there's an error with the data. Please try later.</p>
                <button @click="handleLoadMore">
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
        margin-top: 2rem;
        padding: 0 1rem;
    }
    .filters {
        display: flex;
        padding-bottom: 1rem;
        
        select {
            padding: 0.5rem;
            border: none;
            border-radius: 5px;
            background-color: #e5e5e5;
        }
        .data-loading {
            display: flex;
            align-items: center;
            font-weight: 600;
        }
        .loader {
            margin-left: 25px;
        }
    }

    .all-games {
        margin: 1rem 0;
        display: flex;
        flex-direction: column;
        border-top:1px solid #666 ;
        padding: 1rem 0;
        .infinitScroll {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            margin: 1rem 0;
        }
        .card {
            position: relative;
            background-color: grey;
            height: 400px;
            width: 300px;
            cursor: pointer;
      
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

        .error-msg {
            margin: 1rem auto;
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
}
</style>