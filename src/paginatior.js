class Paginator {
    constructor({ model, resPerPage }) {
        if(!(model && resPerPage)) throw new Error('model, resPerPage must be defined');
        this.model = model;
        this.resPerPage = resPerPage;
    }

    async paginate({ page, attributes, include } ) {
        if(!page) throw new Error('page is not defined');
        attributes = attributes || [];
        include = include || [];
        const offset = page * this.resPerPage;
        const limit = offset + this.resPerPage;
        const data = await this.model.findAndCountAll({
                                            offset,
                                            limit,
                                            attributes,
                                            include
                                        });
        const hasNextPage = Math.ceil(data.count/this.resPerPage) > this.page;
        const result = {
            rows: data.rows,
            hasNextPage
        }

        return result
    }
}

module.exports = Paginator;