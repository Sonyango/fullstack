<script setup>
import { PhotoIcon } from '@heroicons/vue/24/solid';
import { onMounted, ref } from 'vue';
import axiosClient from '../axios';

const showModal = ref(false);

function openModal() {
    showModal.value = true;
}

function closeModal() {
    showModal.value = false;
}

const images = ref([]);

async function copyImageUrl(url) {
    await navigator.clipboard.writeText(url);
}

function deleteImage(id) {
    if (!confirm('Are you sure you want to delete this image?')) {
        return;
    }

    axiosClient.delete(`/api/images/${id}`)
        .then(response => {
            images.value = images.value.filter(image => image.id !== id);
        })
}

onMounted(() => {
    axiosClient.get('/api/images')
        .then((response) => {
            console.log(response.data);
            images.value = response.data;
        })
});
</script>

<template>
    <header class="bg-white shadow-sm">
        <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 class="text-3xl font-bold tracking-tight text-gray-900">
                Images
            </h1>
        </div>
    </header>
    <main>
        <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <div v-for="image in images" :key="image.id" class="bg-white overflow-hidden shadow rounded-lg">
                    <img :src="image.url" alt="Image" class="w-full h-48 object-contain">
                    <div class="px-4 py-4">
                        <h3 class="text-lg font-semibold text-gray-900">{{ image.name }}</h3>
                        <p class="text-sm text-gray-500 mb-4">{{ image.label }}</p>
                        <div class="flex justify-between">
                            <button type="submit" @click="openModal"
                                class="rounded-md bg-green-600 px-3 py-1 text-sm/6 font-semibold text-white shadow-sm hover:bg-green-700 focus-visible:outline">
                                Edit
                            </button>
                            <button type="submit" @click="copyImageUrl(image.url)"
                                class="rounded-md bg-indigo-600 px-3 py-1 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                Copy Url
                            </button>
                            <button type="submit" @click="deleteImage(image.id)"
                                class="rounded-md bg-red-600 px-3 py-1 text-sm/6 font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-red-700">
                                Delete
                            </button>

                            <div v-if="showModal"
                                class="fixed inset-0 z-50 flex items-center justify-center bg-white-500 bg-opacity-50">
                                <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
                                    <div class="px-6 py-4">
                                        <!-- <h3 class="text-lg font-medium text-gray-900">Edit Image</h3> -->
                                        <p class="mt-2 text-sm text-gray-600">
                                            <PhotoIcon class="mx-auto size-12 text-gray-300" aria-hidden="true" />
                                        </p>
                                    </div>
                                    <div class="bg-gray-100 px-6 py-3 flex justify-center rounded-b-lg">
                                        <button @click="closeModal"
                                            class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 mr-2">
                                            Cancel
                                        </button>
                                        <button @click="closeModal"
                                            class="rounded-md bg-indigo-600 px-3 py-1 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped></style>