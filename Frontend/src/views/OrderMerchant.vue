<template>
    <h1>Merchant Order Page</h1>
    <p>this page is for the specific merchant</p>
    <p>The job id is {{ id  }}</p>
</template>

<script>
export default {
    // REIWEN: Change this to a prop later 
    // Video #8 timestamp 34:30
    data(){
        return {
            id: this.$route.params.id
        }
    }

}
</script>


<style>

</style>
