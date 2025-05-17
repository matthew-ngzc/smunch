<template>
    <h1>View All Merchants Page</h1>
    <div v-for="merchant in merchants" :key="merchant.id">
        <router-link :to ="{ name : 'OrderMerchant' , params: { id:merchant.id } }">
            <h2>{{ merchant.title  }}</h2>
        </router-link>
    </div>
    
</template>

<script>
export default {
    data() {
        return {
            merchants: [ 
                { title: "Braek", id: 1 },
                { title: "Floursh", id: 2 },
                { title: "Koufu", id: 3 },
                { title: "Onalu", id: 4 } 
            ]
        }
    }
}
</script>


<style>

</style>
