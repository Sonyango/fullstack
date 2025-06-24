<script setup>
import { PhotoIcon } from '@heroicons/vue/24/solid';
import { onMounted, ref } from 'vue';
import axiosClient from '../axios';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline';
import  useUserStore  from '../store/user';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const currentUser = user.value;

const open = ref(false);
const selectedImage = ref(null);
const newImageFile = ref(null);
const newImagePreviewUrl = ref(null);


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

function handleEditFileChange(event) {
    const file = event.target.files[0];
    newImageFile.value = file;

    if (file) {
        newImagePreviewUrl.value = URL.createObjectURL(file);
    } else {
        newImagePreviewUrl.value = null;
    }
}

async function updateImage() {
    if (!selectedImage.value || !newImageFile.value) return;

    await axiosClient.delete(`/api/images/${selectedImage.value.id}`);

    const formData = new FormData();
    formData.append('image', newImageFile.value);
    formData.append('label', selectedImage.value.label);

    const response = await axiosClient.post('/api/images', formData);

    images.value = images.value
        .filter(img => img.id !== selectedImage.value.id)
        .concat(response.data);

    open.value = false;
    selectedImage.value = null;
    newImageFile.value = null;
    newImagePreviewUrl.value = null;
}

function closeModal() {
    open.value = false;
    selectedImage.value = null;
    newImageFile.value = null;
    newImagePreviewUrl.value = null;
}

onMounted(() => {
    if (!user.value) {
        userStore.fetchUser();
    }

    axiosClient.get('/api/images')
        .then((response) => {
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
                            <template v-if="currentUser && image.user_id == currentUser.id">
                                <button type="submit" @click="open = true; selectedImage = image"
                                    class="rounded-md bg-green-600 px-3 py-1 text-sm/6 font-semibold text-white shadow-sm hover:bg-green-700 focus-visible:outline">
                                    Edit
                                </button>
                                
                                <button type="submit" @click="deleteImage(image.id)"
                                    class="rounded-md bg-red-600 px-3 py-1 text-sm/6 font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-red-700">
                                    Delete
                                </button>
                            </template>
                            <button type="submit" @click="copyImageUrl(image.url)"
                                class="rounded-md bg-indigo-600 px-3 py-1 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                Copy Url
                            </button>

                        </div>
                    </div>
                </div>                              

                    <TransitionRoot as="template" :show="open">
                    <Dialog class="relative z-10" @close="closeModal">
                        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
                        <div class="fixed inset-0 bg-gray-500/75 transition-opacity" />
                        </TransitionChild>

                        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div class="sm:flex sm:items-start">
                                    <div class="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                                    <ExclamationTriangleIcon class="size-6 text-red-600" aria-hidden="true" />
                                    </div>
                                    <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <DialogTitle as="h3" class="text-base font-semibold text-gray-900">Update Existing Image</DialogTitle>

                                    <div class="mt-2 flex justify-between">
                                        <div class="rounded-lg border border-dashed border-gray-900/25 px-6 py-10 mr-2">
                                            <p>Existing image</p>
                                            <template v-if="selectedImage">
                                                <img :src="selectedImage.url" :alt="selectedImage.name" class="mt-2 max-h-32 max-w-full object-contain" />
                                            </template>
                                        </div>

                                        <div class="rounded-lg border border-dashed border-gray-900/25 px-6 py-10 ml-2">
                                            <p v-if="newImagePreviewUrl">Selected image</p>
                                            <template v-if="!newImagePreviewUrl">
                                                
                                                 <label for="file-upload"
                                                class="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:outline-hidden hover:text-indigo-500">
                                                <span>Upload file</span>
                                                <input id="file-upload" name="file-upload" type="file" @change="handleEditFileChange" class="sr-only" /> 
                                            </label>
                                            </template>
                                            <template v-else>
                                                <img :src="newImagePreviewUrl" alt="New Image Prevew" class="mt-2 max-h-32 max-w-full object-contain rounded-md" />
                                                <div class="text-sm text-gray-600">{{ newImageFile.name }}</div>
                                            </template>
                                            
                                           
                                        </div>
                                        
                                    </div>
                                    

                                    </div>
                                </div>
                                </div>
                                <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button type="button" 
                                    class="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-green-500 sm:ml-3 sm:w-auto"
                                    :disabled="!newImageFile"
                                    :class="{ 'opacity-40 cursor-not-allowed': !newImageFile }" 
                                    @click="updateImage">
                                    Update Image
                                </button>
                                <button type="button" 
                                class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto" 
                                @click="closeModal"
                                ref="cancelButtonRef">
                                    Cancel
                                </button>
                                </div>
                            </DialogPanel>
                            </TransitionChild>
                        </div>
                        </div>
                    </Dialog>
                    </TransitionRoot>
                            
            </div>
        </div>
    </main>
</template>

<style scoped></style>