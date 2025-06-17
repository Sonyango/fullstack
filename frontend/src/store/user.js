import axiosClient from "../axios";
import { defineStore } from 'pinia';

const useUserStore = defineStore('user', {
    state: () => ({
        user: null,
    }),
    actions: {
        fetchUser () {
          return axiosClient.get('/api/user')
                .then(({ data }) => {
                    console.log('User data fetched:', data)
                    this.user = data
                })
        }
    },
})

export default useUserStore;