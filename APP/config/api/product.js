import client from "../HttpCLient";

export const menusApi = async (restaurantId) => {
    try {
        const response = await client.get(`/${restaurantId}`);
        return response.data
    } catch (err) {
        throw new Error(err)
    }
}

export const categoriesApi = async (restaurantId, menuIds) => {
    try {
        const response = await client.get(`/${restaurantId}/${menuIds.join(',')}`);
        return response.data;
    } catch (err) {
        throw new Error(err)
    }
}
export const productsApi = async (restaurantId, categoryIds) => {
    try {
        const response = await client.post(`/products/${restaurantId}`, { categoryIds });
        return response.data;
    } catch (err) {
        throw new Error(err)
    }
}