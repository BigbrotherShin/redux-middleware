import axios from 'axios';

export const getPosts = async () => {
  const response = await axios.get('http://localhost:4001/posts');
  return response.data;
};

export const getPostById = async id => {
  const response = await axios.get(`http://localhost:4001/posts/${id}`);
  return response.data;
};
