<script setup>
import { onMounted, computed} from "vue";
import { useRouter } from 'vue-router';
import { useQuery } from "@tanstack/vue-query";
import { useOrderStore } from '../stores/order';
import axios from "axios";
import Navbar from '../components/Navbar.vue';
import Footer from "../components/Footer.vue";

const store = useOrderStore();
const router = useRouter();
const todaysDate = new Date().toLocaleDateString('fr-CA');

const fetchTopRatedGames = async () => {
  try {
    const res = await axios.get('/api/games', { params: { ordering: '-rating' } });
    return res.data.results;
  } catch (error) {
    console.error('Error fetching top rated games:', error);
    throw error; // Propager l'erreur pour la gestion dans le composant
  }
};

const fetchLatestReleasedGames = async () => {
  try {
    const res = await axios.get('/api/games', { params: { ordering: '-released', dates: `2023-11-01,${todaysDate}` } });
    return res.data.results;
  } catch (error) {
    console.error('Error fetching latest released games:', error);
    throw error; // Propager l'erreur pour la gestion dans le composant
  }
};

const { data: latestReleasedGames, isFetching: latestReleasedFetching } = useQuery({
  queryKey: ['latestReleased'],
  queryFn: fetchLatestReleasedGames,
});

const { data: topRatedGames, isFetching: topRatingFetching } = useQuery({
  queryKey: ['topReleased'],
  queryFn: fetchTopRatedGames,
});

const handleLatestReleased = () => {
  store.orderBy.orderByDateDsc = true;
  store.orderBy.orderByRatingDsc = false;
};

const handleTopRated = () => {
  store.orderBy.orderByRatingDsc = true;
  store.orderBy.orderByDateDsc = false;
};

</script>

<template>
  <div class="container">
    <header>
      <Navbar />
    </header>
    <main>
      <section class="new-release">
        <div class="new-release-cta">
          <h2>Latest release</h2>
          <router-link to="/games" @click="handleLatestReleased">View all</router-link>
        </div>
        <div class="new-release-content">
          <div v-if="latestReleasedFetching" class="new-release-loading">
            <img class="loader" src="../assets/images/Spinner-1s-200px.svg" alt="">
            <span>Data loading</span>
          </div>
          <div v-else @click="router.push({path: `/games/${game.id}`})" v-for="game in latestReleasedGames?.slice(0,6)" :key="game.id" class="card" v-bind:style="{ 'background' : `url(${game.background_image}) center/cover` }">
            <div class="card-gradiant"></div>
            <div class="card-details">
              <p class="card-title">{{ game.name }}</p>
              <div class="card-tags">
                <p v-for="tag in game.genres.slice(0,3)" :key="game.id">{{ tag.name }}</p>
              </div>
              <p class="card-date">{{ game.released }}</p>
            </div>
          </div>
        </div>
      </section>
      <section class="top-rating">
        <div class="top-rating-cta">
          <h2>Top rating</h2>
          <router-link to="/games" @click="handleTopRated">View all</router-link>
        </div>
        <div class="top-rating-content">
          <div v-if="topRatingFetching" class="top-rating-loading">
            <img class="loader" src="../assets/images/Spinner-1s-200px.svg" alt="">
            <span>Data loading</span>
          </div>
          <div v-else @click="router.push({path: `/games/${game.id}`})" v-for="game in topRatedGames?.slice(0,6)" :key="game.id" class="card" v-bind:style="{ 'background' : `url(${game.background_image}) center/cover` }">
            <div class="card-gradiant"></div>
            <div class="card-details">
              <p class="card-title">{{ game.name }}</p>
              <div class="card-tags">
                <p v-for="tag in game.genres.slice(0,3)" :key="game.id">{{ tag.name }}</p>
              </div>
              <p class="card-date">{{ game.released }}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
</template>

<style lang="scss" scoped>
main {
  padding: 0 4rem;

  @media (max-width: 824px) {
    padding: 0 3rem;
  }

  @media (max-width: 550px) {
    padding: 0 1rem;
  }

  .new-release {
    margin-top: 4rem;

    @media (max-width: 550px) {
      margin-top: 2rem;
    }
    .new-release-cta {
      display: flex;
      align-items: center;
      justify-content: space-between;

    }

    .new-release-loading {
      display: flex;
      align-items: center;
      font-weight: 600;
      margin: auto;
    }

    .new-release-content {
      margin-top: 2rem;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      gap: 1rem;

      @media (max-width: 1024px) {
        flex-wrap: wrap;
      }
    }
}

.card {
      position: relative;
      background-color: grey;
      height: 400px;
      width: 300px;
      cursor: pointer;

      @media (max-width: 1024px) {
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

.top-rating {
  margin-top: 4rem;

  .top-rating-cta {
      display: flex;
      align-items: center;
      justify-content: space-between;
  }

  .top-rating-loading {
      display: flex;
      align-items: center;
      font-weight: 600;
      margin: auto;
    }

  .top-rating-content {
      margin-top: 2rem;
      display: flex;
      flex-wrap: nowrap;
      gap: 1rem;
    
      @media (max-width: 1024px) {
        flex-wrap: wrap;
      }

  }
}
}

</style>
