import axiosApi from '@/core/interceptore/axiosApi';

export async function uploadProfilePicture(file: File) {
    const formData = new FormData();
    formData.append('picture', file);

    const response = await axiosApi.put('/users/upload/picture', formData) as { path: string };

    return response;
}