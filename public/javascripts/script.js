function addToCart(productId){
    $.ajax({
        url:"/add-to-cart/"+productId,
        type:"GET",
        success:(response)=>{
            if(response.status){
                let count=$("#cart-count").html()
                count=parseInt(count)+1
                $("#cart-count").html(count)
            }
        }

    })
}