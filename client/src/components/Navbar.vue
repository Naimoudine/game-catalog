<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router"

const searchQuery = ref("");
const router = useRouter();
const route = useRoute();

const handleSearch = () => {
    if(route.name === "searchView") {
        router.replace({path:'/search', query: { search : searchQuery.value } })
    }
    router.push({path:'/search', query: { search : searchQuery.value } })
}
</script>

<template>
    <nav class="nav">
        <router-link class="nav-logo" to="/">GameCatalog</router-link>
        <div class="nav-searchbar">
            <img src="../assets/images/search.svg" alt="">
            <input class="nav-search" type="search" name="q" v-model.trim="searchQuery" @keyup.enter="handleSearch">
        </div>
    </nav>
</template>

<style scoped lang="scss">
a {
  text-decoration: none;
  color: #fff;
}
.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
    padding: 1rem 4rem;
    background-color: #000;
    color: #fff;

    @media (max-width: 550px) {
        padding: 1rem;
    }

    .nav-logo {
        font-size: 1.5rem;
        font-weight: 500;

        @media (max-width: 550px) {
            font-size: 1.2rem;
            font-weight: 500;
        }
    }
    .nav-searchbar {
        display: flex;
        align-items: center;
        background: #fff;
        padding: 0.2rem  0.5rem;
        border-radius: 25px;


        & input {
            width: 150px;
            border: none;
            margin-left: 0.2rem;

            @media (max-width: 550px) {
                min-width: 10px;
                width: 100%;
            }
        }
        
    }
}
</style>