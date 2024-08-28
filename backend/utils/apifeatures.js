//Now we are adding the functionalities in our website and also adding the seach functionalites and the pagination and sorting by the price 

class ApiFeature{
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr
    }

   //Adding the search feature in the website
   
   seach(){
        const keyword = this.queryStr.keyword ? {
            name:{
                $regex : this.queryStr.keyword,
                $option : "i"
            }
        } : {}

        this.query = this.query.find(...keyword);
        return this;
   }

   //Now adding the next feature in the code 

   addfeature(){
    
   }

   addingMoreFeature(){
    
   }
}

module.exports = ApiFeature;