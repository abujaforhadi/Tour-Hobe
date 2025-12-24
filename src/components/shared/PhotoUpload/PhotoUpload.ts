/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";



export const PhotoUpload = async (image: File ): Promise<any> => {
  const formData = new FormData();
  formData.append("image", image);

  const apiKey = process.env.NEXT_PUBLIC_IMGBB_KEY || process.env.VITE_IMGBB_KEY;

  if (!apiKey) {
    throw new Error("IMGBB API Key is missing. Set NEXT_PUBLIC_IMGBB_KEY or VITE_IMGBB_KEY.");
  }

  const { data } = await axios.post(
    `https://api.imgbb.com/1/upload?key=${apiKey}`,
    formData
  );

  console.log(data);

  return data;
};
