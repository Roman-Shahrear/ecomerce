class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }
    // search feature
    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i",
            },
        }
        : {};

        this.query = this.query.find({...keyword});
        return this;
    }

    filter() {
        const queryCopy = {...this.queryStr}

        // Removing some field for category
        const removeFields = ["keyword", "page", "limit"];

        removeFields.forEach(key=> delete queryCopy[key]);

        //filter for Price and Rating
        
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, key=>`$${key}`);


        this.query = this.query.find(JSON.parse(queryStr));
       
        return this;
    }

    //For Pagination or page navigation feature
    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;    //Suppose have you 50 products and wants to show perpage 10 roducts means (50 -- 10)

        const skip = resultPerPage * (currentPage - 1);
        
        this.query = this.query.limit(resultPerPage).skip(skip);
        
        return this;
    }
}


module.exports = ApiFeatures;