import axiosInstance from '@/services/api';

export const getMyProfile = async () => {
    const { data } = await axiosInstance.get('/client/profile');
    return data.profile;
};

export const updateMyProfile = async (payload) => {
    const { data } = await axiosInstance.put('/client/profile', payload);
    return data.profile;
};

export const uploadMyProfileImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const { data } = await axiosInstance.post('/client/profile/image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return data.profile;
};

export const deleteMyProfileImage = async () => {
    const { data } = await axiosInstance.delete('/client/profile/image');
    return data.profile;
};
