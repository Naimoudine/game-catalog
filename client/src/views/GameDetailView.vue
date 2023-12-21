<script setup>
import { onMounted, ref } from 'vue';
import { useRoute} from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';

const route = useRoute();
const scrollLeft = ref(0);
const scrollWidth = ref();

const fetchSlectedGame = async () => {
    const res = await fetch(`https://api.rawg.io/api/games/${route.params.id}?key=${import.meta.env.VITE_API_KEY}`);
    const data = await res.json();
    return data;
}

const fetchSelectedGameScreenshots = async() => {
    const res = await fetch(`https://api.rawg.io/api/games/${route.params.id}/screenshots?key=${import.meta.env.VITE_API_KEY}`);
    const data = await res.json();
    return data.results;

}

const {data} = useQuery({
    queryKey: ['slectedGame'],
    queryFn: fetchSlectedGame
})

const {data: screenshots} = useQuery({
    queryKey:  ['selectedScreenshots'],
    queryFn: fetchSelectedGameScreenshots
})

const handleLeftButton = () => {
    const firstImg = document.querySelectorAll('.game-details-gallery-content > img')[0];
    const firstImgWidth = firstImg.clientWidth + 14;
    document.querySelector('.game-details-gallery-content').scrollLeft -= firstImgWidth;
}
const handleRightButton = () => {
    const firstImg = document.querySelectorAll('.game-details-gallery-content > img')[0];
    const firstImgWidth = firstImg.clientWidth + 14;
    document.querySelector('.game-details-gallery-content').scrollLeft += firstImgWidth;
}

onMounted(async () => {
    const sliderContent = document.querySelector('.game-details-gallery-content');
    
    if (sliderContent) {
        
        scrollLeft.value = sliderContent.scrollLeft;

        sliderContent.addEventListener('scroll', () => {
            scrollLeft.value = sliderContent.scrollLeft;
            scrollWidth.value = sliderContent.scrollWidth - sliderContent.clientWidth;
        });
    }

});


</script>

<template>
    <div class="container">
        <header>
            <Navbar />
        </header>
        <main>
            <div class="game-details">
                <div class="game-details-header" v-bind:style="{ 'background' : `url(${data?.background_image}) cover` }">
                    <div class="game-details-header-content">
                        <img :src="data?.background_image" alt="">
                        <div class="game-details-header-text">
                            <h1>{{ data?.name }}</h1>
                            <div class="game-details-rating">
                                <img src="../assets/images/star.svg" alt="">
                                <p>: {{ data?.rating }}</p>
                            </div>
                            <div class="game-details-released">
                                <p>Released date:</p>
                                <p>{{ data?.released }}</p>
                            </div>
                            <div class="game-details-tags">
                                <p>Tags: </p>
                                <p class="game-details-tag" v-for="tag in data?.tags">{{ tag.name }}, </p>
                            </div>
                            <div class="game-details-platforms">
                                <p>Platforms: </p>
                                <p class="game-details-platform" v-for="platform in data?.platforms"> {{ platform.platform.name }},</p>
                            </div>
                        </div>
                    </div>
                </div>
                <section class="game-details-gallery">
                    <div class="game-details-gallery-header">
                        <h2>Gallery</h2>
                        <div class="game-details-gallery-header-buttons">
                            <button class="left" @click="handleLeftButton"><svg width="50px" height="50px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13 9L10.3003 11.6997V11.6997C10.1344 11.8656 10.1344 12.1344 10.3003 12.3003V12.3003L13 15" :stroke="[scrollLeft === 0 ? '#323232' : '#fff']" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg></button>
                            <button class="rigth" @click="handleRightButton"><svg width="50px" height="50px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 15L13.6997 12.3003V12.3003C13.8656 12.1344 13.8656 11.8656 13.6997 11.6997V11.6997L11 9" :stroke="[scrollLeft === scrollWidth ? '#323232' : '#fff']" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg></button>
                        </div>
                    </div>

                    <div class="game-details-gallery-content">
                        <img v-for="screenshot in screenshots" :key="screenshot.id" class="game-details-gallery-content-img" :src="screenshot.image" alt="">
                    </div>
                </section>
                <section class="game-details-body">
                    <h2>About</h2>
                    <div class="game-details-body-content">
                        <p>{{ data?.description_raw }}</p>
                        <a :href="data?.website" target="_blank" :style="[data?.website ? {'display': ''} : {'display': 'none'}]">Go to website <img src="../assets/images/arrow-right.svg" alt=""></a>
                    </div>
                </section>
            </div>
        </main>
        <Footer />
    </div>
</template>

<style lang="scss" scoped>
main {
    .game-details-header {
        display: flex;
        flex-direction: row;
        gap: 1.5rem;
        padding:4rem;
        backdrop-filter: blur(100px);

        @media (max-width: 933px) {
            flex-direction: column;
        }

        @media (max-width: 550px) {
            padding: 2rem 1rem;
        }


        .game-details-header-content {
            display: flex;
            flex-direction: row;
            gap: 1rem;

            @media (max-width: 933px) {
            flex-direction: column;
            }
        }

        .game-details-header-content img {
            height: 300px;
            width: auto;

            @media (max-width: 1024px) {
                height: 250px;
            }
        }

        .game-details-header-text {
            display: flex;
            flex-direction: column;
            gap: 1rem;

            @media (max-width: 1024px) {
                gap: 0.5rem;
            }

            @media (max-width: 933px) {
                font-size: 1rem
            }

            h1 {
                @media (max-width: 933px) {
                    font-size: 1.5rem
                }
            }
        }

        .game-details-rating {
            display: flex;
            align-items: center;
            gap: 0.2rem;
            img {
                height: 20px;
                width: auto;
            }
        }

        .game-details-released {
            display: flex;
            gap: 0.2rem;
        }

        .game-details-released > p:first-child {
            font-weight: 600;
        }

        .game-details-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.25rem; 

            p {
                white-space: nowrap;
                text-decoration: underline;
            }

            p:first-child {
                text-decoration: none;
            }
        }

        .game-details-tags p:first-child {
            font-weight: 600;
        }  

        .game-details-platforms {
            display: flex;
            flex-wrap: wrap;
            gap: 0.2rem;
        }

        .game-details-platforms > p:first-child {
            font-weight: 600;
        }
    }

    .game-details-gallery {
        display: flex;
        flex-direction: column;
        background: #000;
        padding: 1rem 4rem;

        @media (max-width: 550px) {
            padding: 1rem;
        }

        h2 {
            color: #fff;
        }

        .game-details-gallery-header {
            display: flex;
            justify-content: space-between;

            button {
                background: none;
                border: none;
                padding: 0;
            }
        }

        .game-details-gallery-content {
            display: flex;
            gap: 1rem;
            max-height: 200px;
            margin: 1rem 0;
            overflow: hidden;
            scroll-behavior: smooth;
            .game-details-gallery-content-img {
                height: 200px;
                width: auto;
                border-radius: 10px;
            }
        }
    }

    .game-details-body {
        padding: 4rem 4rem;

        @media (max-width: 550px) {
            padding: 2rem 1rem;
        }


        .game-details-body-content {
            margin-top: 1rem;

            a {
                border: none;
                display: block;
                margin-top: 2rem;
                color: #000;
                display: flex;
                align-items: center;
                font-weight: 600;
                text-decoration: none;
                cursor: pointer;
                img {
                    margin-left: 0.5rem;
                }
            }

        }
    }
}
</style>