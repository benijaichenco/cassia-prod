import { CommentType } from "../types";
import { authApi, publicApi } from "./apiClient";

export const authRegister = async (creds: {
  fName: string;
  lName: string;
  email: string;
  username: string;
  pwd: string;
}) => {
  return await publicApi({
    method: "PUT",
    url: "/auth/register",
    data: creds,
  });
};

export const authLogin = async (creds: { usernameOrEmail: string; password: string }) => {
  return await publicApi({
    method: "POST",
    url: "/auth/login",
    data: creds,
  });
};

export const authLogout = async () => {
  return await authApi({
    method: "POST",
    url: "/auth/logout",
  });
};

export const verifyToken = async (token: { token: string }) => {
  return await authApi({
    method: "POST",
    url: "/auth/verify-token",
    data: token,
  });
};

export const postComment = async (comment: CommentType) => {
  return await authApi({
    method: "PUT",
    url: "/comments/create",
    data: comment,
  });
};

export const deleteComment = async (commentId: string) => {
  return await authApi({
    method: "DELETE",
    url: `/comments/delete`,
    data: { commentId },
  });
};

export const getSingleFragrance = async (fragranceId: string) => {
  return await publicApi({
    method: "GET",
    url: `/fragrances/single/${fragranceId}`,
  });
};

export const fetchFragrances = async (
  index: number,
  sortField: string,
  sortOrder: string,
  search: string
) => {
  return await publicApi({
    method: "GET",
    url: `/fragrances?search=${search}&index=${index}&sortField=${sortField}&sortOrder=${sortOrder}`,
  });
};

export const postLike = async (
  likeType: string,
  targetType: string,
  targetId: string,
  userId: string
) => {
  return await authApi({
    method: "POST",
    url: `/likes/post-like`,
    data: { likeType, targetType, targetId, userId },
  });
};

export const fetchFotd = async () => {
  return await publicApi({
    method: "GET",
    url: `${import.meta.env.VITE_BACKEND_BASE_URL}/api/fragrances/fotd`,
  });
};
