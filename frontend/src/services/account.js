import axiosInstance from '@/services/api';

export const requestPasswordChangeCode = async () => {
  const { data } = await axiosInstance.post('/client/password/change/request');
  return data;
};

export const confirmPasswordChange = async ({ code, newPassword }) => {
  const { data } = await axiosInstance.post('/client/password/change/confirm', {
    code,
    newPassword,
  });
  return data;
};
