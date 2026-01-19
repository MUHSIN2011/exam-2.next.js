"use client"
import { BookText, CirclePlus, Eye, EyeClosed, FilePenLine, Trash } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useDeleteNewsMutation, useGetNewsQuery, useUpdateNewsMutation } from '../api/api'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export interface INews {
    title: string,
    description: string,
    date: string,
    status: string,
    img: string,
    id: string
}
function page() {
    const [page, setPage] = useState(1);
    const limit = 6;

    const { data: news, isLoading, error } = useGetNewsQuery({ page, limit });
    const [deleteTodo, { isLoading: deleteLoading }] = useDeleteNewsMutation()
    const [updateNews] = useUpdateNewsMutation();

    const router = useRouter();

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (!user) {
            router.push("/");
            toast.success("You need to log in to your account first.")
        }
    }, [router]);

    if (isLoading) return (
        <div className='flex items-center justify-center h-[90vh]'>
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#FFA900] border-t-transparent"></div>
        </div>
    );
    if (error) return <div className='flex justify-center items-center h-[90vh]'>
        <h1 className='text-2xl'>Интернет нест ё хомуш кард шуд!</h1>
    </div>;

    const pages = [];

    for (let i = 1; i <= news?.pages; i++) {
        pages.push(i);
    }

    const EditStatus = async (e: any) => {
        const newStatus = e.status === "true" ? "false" : "true";

        try {
            await updateNews({
                id: e.id,
                data: {
                    ...e,
                    status: newStatus,
                },
            }).unwrap();
        } catch {
            console.error(error);
        }
    };

    const onDelete = async (id: string) => {
        try {
            await deleteTodo(id)
            toast.success('Successfully deleted');
        } catch  {
            toast.error('Delete error ❌');
        }
    };

    const onStatus = async (e: object) => {
        try {
            await EditStatus(e)
            toast.success('Successfully Status');
        } catch  {
            toast.error('Delete error ❌');
        }
    };

    return (
        <div className='max-w-340.5 m-auto py-3'>
            <section>
                <div className='flex justify-between'>
                    <h1 className=' text-4xl font-bold '>Новости</h1>
                    <Link href='/home/addnews' className='bg-[#FFA900] py-2 px-3 flex gap-2  rounded-2xl text-white'><CirclePlus />Добавить</Link>
                    <Toaster />
                </div>
                <div className='bg-[#FFA900] p-0.5 mt-3 max-w-40 '>
                </div>
                <div className='grid grid-cols-3 py-3 gap-4'>
                    {
                        news.data?.map((e: INews) => (
                            <div key={e.id} className='border hover:translate-y-2 duration-300 p-2 rounded-2xl '>
                                <div
                                    style={{ backgroundImage: `url("${e.img}")` }}
                                    className='w-full h-50 bg-cover bg-center  rounded-xl mb-2 flex p-2 relative'
                                >
                                    <p className='absolute top-2 left-2 flex gap-2 items-center text-xs font-medium text-black bg-white/50 backdrop-blur-md px-2 py-1 rounded-lg border border-white/20'>
                                        <BookText className='size-5' />
                                        {e.date}
                                    </p>
                                </div>
                                <div>
                                    <h1 className='text-2xl font-semibold'>{e.title} </h1>
                                    <p className='text-gray-400'>{e.description}</p>
                                    <div className='flex items-center justify-between'>
                                        <p className='text-[18px] font-semibold text-[#FFA900]  cursor-pointer'>Подробнее</p>
                                        <div className='flex gap-2 items-center '>
                                            <Trash onClick={() => onDelete(e.id)} className='border-[#FFE6B6] cursor-pointer dark:text-gray-500 dark:border-gray-500  text-[#FFA900] border-3 size-10 p-1.5 rounded-xl' />
                                            <FilePenLine
                                                onClick={() => router.push(`/home/${e.id}`)}
                                                className='border-[#FFE6B6] dark:text-gray-500 dark:border-gray-500 text-[#FFA900] border-3 cursor-pointer size-10 p-1.5 rounded-xl'
                                            />
                                            {e.status === "true" ? (
                                                <Eye
                                                    onClick={() => onStatus(e)}
                                                    className="border-[#FFE6B6] dark:text-gray-500 dark:border-gray-500  border-3 cursor-pointer text-[#FFA900] size-10 p-1.5 rounded-xl"
                                                />
                                            ) : (
                                                <EyeClosed
                                                    onClick={() => onStatus(e)}
                                                    className="border-[#FFE6B6] cursor-pointer dark:text-gray-500 dark:border-gray-500 text-[#FFA900] border-3 size-10 p-1.5 rounded-xl"
                                                />
                                            )}

                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className='flex gap-2 justify-end items-center mt-5'>
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className='px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50'
                        disabled={page === 1}
                    >
                        {'<'}
                    </button>

                    {pages.map((p) => (
                        <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`px-3 py-1 border rounded transition-colors ${page === p ? 'bg-[#FFA900] text-white' : 'hover:bg-gray-100'
                                }`}
                        >
                            {p}
                        </button>
                    ))}

                    <button
                        onClick={() => setPage(p => p + 1)}
                        className='px-3 py-1 border rounded hover:bg-gray-100'
                    >
                        {'>'}
                    </button>
                </div>
            </section>
        </div>
    )
}

export default page