import axios from 'axios';

export const fetchContents = async () => {
  try {
    const response = await axios.get('https://closet-recruiting-api.azurewebsites.net/api/data');
    return response.data;
  } catch (error) {
    console.error('Error fetching contents:', error);
    return [];
  }
};