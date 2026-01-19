// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface IVacancy {
    id: string;
    position: string;
    description: string;
    city: string;
    status: string;
}

export interface INews {
    title: string,
    description: string,
    date: string,
    status: string,
    img: string,
    id: number
}


// Define a service using a base URL and expected endpoints
export const pokemonApi = createApi({
    reducerPath: 'pokemonApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001' }),
    tagTypes: ['Todo'],
    endpoints: (builder) => ({
        login: builder.query<any, any>({
            query: ({ email, password }) => `users?email=${email}&password=${password}`,
        }),
        getNews: builder.query<any, { page: number; limit: number }>({
            query: ({ page, limit }) => `news?_page=${page}&_per_page=${limit}`,
            providesTags: ['Todo'],
        }),
        DeleteNews: builder.mutation<void, string>({
            query: (id) => ({
                url: `news/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Todo'],
        }),
        AddNew: builder.mutation<void, INews>({
            query: (todo) => ({
                url: `news`,
                method: 'POST',
                body: todo,
            }),
            invalidatesTags: ['Todo'],
        }),
        updateNews: builder.mutation<void, { id: string | string[]; data: any }>({
            query: ({ id, data }) => ({
                url: `news/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Todo'],
        }),
        updateVacancy: builder.mutation<void, { id: string | string[]; data: any }>({
            query: ({ id, data }) => ({
                url: `vacancy/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Todo'],
        }),
        getNewsById: builder.query<any, string>({
            query: (id) => `news/${id}`,
            providesTags: (result, error, id) => [{ type: 'Todo', id }],
        }),
        getVacancyById: builder.query<any, string>({
            query: (id) => `vacancy/${id}`,
            providesTags: (result, error, id) => [{ type: 'Todo', id }],
        }),
        getVacancy: builder.query<any, { page: number; limit: number }>({
            query: ({ page, limit }) => `vacancy?_page=${page}&_per_page=${limit}`,
            providesTags: ['Todo'],
        }),
        Deletevacancy: builder.mutation<void, string>({
            query: (id) => ({
                url: `vacancy/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Todo'],
        }),
        Addvacancy: builder.mutation<void, IVacancy>({
            query: (todo) => ({
                url: `vacancy`,
                method: 'POST',
                body: todo,
            }),
            invalidatesTags: ['Todo'],
        }),
        getApplication: builder.query<any, { page: number; limit: number }>({
            query: ({ page, limit }) => `application?_page=${page}&_per_page=${limit}`,
            providesTags: ['Todo'],
        }),
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useLazyLoginQuery, useGetNewsQuery, useDeleteNewsMutation, useAddNewMutation, useUpdateNewsMutation, useGetNewsByIdQuery, useGetVacancyQuery, useDeletevacancyMutation, useAddvacancyMutation, useGetApplicationQuery, useGetVacancyByIdQuery, useUpdateVacancyMutation } = pokemonApi