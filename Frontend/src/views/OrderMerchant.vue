<template>
    <div v-if="merchant">
        <h1>Merchant Order Page</h1>
        <p>this page is for the {{ merchant.title }}</p>
        <p>The merchant id is {{ $route.params.id }}</p>
    </div>
    <div v-else>
        <p>Loading job details...</p>
    </div>
</template>

<script>
export default {
    // REIWEN: Change this to a prop later 
    // Video #8 timestamp 34:30
    data() {
        return {
            merchant: null
        }
    },
    mounted() {

        const id = this.$route.params.id
        console.log("merchant id:", id)

        fetch(`http://localhost:3000/orders/${id}`)
            .then(res => res.json())
            .then(data => this.merchant = data)
            .catch(err => console.log(err.message))
    }

}
</script>


<style>

</style>
