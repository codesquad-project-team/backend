class Paginator {
    constructor({ model, perPage }) {
        if(!(model && perPage)) throw new Error('model, resPerPage must be defined');
        this.model = model;
        this.perPage = perPage;
    }

    async paginate({ page, attributes, where, include, order } ) {
        if(!page || page === 0) throw new Error('page number must be defined minimum 1');
        attributes = attributes || [];
        include = include || [];
        order = order || [];
        where = where || {};
        const offset = (page - 1) * this.perPage;
        const limit = this.perPage;
        const data = await this.model.findAndCountAll({
                                            offset,
                                            limit,
                                            attributes,
                                            where,
                                            include,
                                            order
                                        });
        const hasNextPage = Math.ceil(data.count/this.perPage) > page;
        const result = {
            rows: data.rows,
            hasNextPage
        }

        return result;
    }
}

module.exports = Paginator;