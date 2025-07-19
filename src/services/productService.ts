import  API  from '../utils/axios';
import { CreateProductDto, UpdateProductDto, CreateProductVariableDto, EditableProductVariableDto } from '../types/productType';

const getToken = () => localStorage.getItem("accessToken");

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const createProduct = async (productData: CreateProductDto) => {
  const response = await API.post('/products/add-a-product', productData, authHeader());
  return response.data;
};

export const getAllProducts = async () => {
  const response = await API.get('/products/view-all-products', authHeader());
  return response.data;
};

export const getProductById = async (productId: string) => {
  const response = await API.get(`/products/view-a-product/${productId}`, authHeader());
  return response.data;
};

export const updateProduct = async (productId: string, updateData:  Partial<UpdateProductDto>) => {
  const response = await API.put(`/products/update-a-product/${productId}`, updateData, authHeader());
  return response.data;
};

export const deleteProduct = async (productId: string) => {
  const response = await API.delete(`/products/remove-a-product/${productId}`, authHeader());
  return response.data;
};




// --- Product Variables ---

export const createProductVariable = async (
  productId: string,
  variableData: CreateProductVariableDto
) => {
  const response = await API.post(`/products/add-product-variables/${productId}`, variableData, authHeader());
  return response.data;
};

export const updateProductVariable = async (
  variableId: string,
  updateData: EditableProductVariableDto
) => {
  const response = await API.put(`/products/update-a-product-variable/${variableId}`, updateData, authHeader());
  return response.data;
};

export const deleteProductVariable = async (variableId: string) => {
  const response = await API.delete(`/products/remove-a-product-variable/${variableId}`, authHeader());
  return response.data;
};
