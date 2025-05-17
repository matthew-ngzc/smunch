<template>
    <h1>View All Merchants Page</h1>
    <div v-if="merchants.length">
        <div v-for="merchant in merchants" :key="merchant.id">
            <router-link :to ="{ name : 'orderMerchant' , params: { id:merchant.id } }">
                <h2>{{ merchant.title  }}</h2>
            </router-link>
        </div>
    </div>
    <div v-else>
        <p>Loding all merchants available...</p>
    </div>
    
</template>

<script>
export default {
    data() {
        return {
            merchants: []
        }
    },
    mounted() {
        fetch('http://localhost:3000/orders')
            .then( res => res.json() )
            .then( data => this.merchants = data )
            .catch(err => console.log(err.message))
    }
}
</script>


<style>

</style>
