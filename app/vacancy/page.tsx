"use client"
import { BookText, CirclePlus, Eye, EyeClosed, FilePenLine, MapPin, Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDeletevacancyMutation, useGetVacancyQuery, useUpdateVacancyMutation } from '../api/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export interface IVacancy {
    id: string;
    position: string;
    description: string;
    city: string;
    status: string;
}


function HomePage() {
    const [page, setPage] = useState(1);
    const limit = 6;

    const { data: vacancy, isLoading, error } = useGetVacancyQuery({ page, limit });
    const [deleteTodo] = useDeletevacancyMutation();
    const [updateVacancy] = useUpdateVacancyMutation();

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
    if (error) return <p>Хатогӣ рӯй дод!</p>;

    const pages = [1, 2, 3];

    const onDelete = async (id: string) => {
        try {
            await deleteTodo(id)
            toast.success('Successfully deleted');
        } catch (err) {
            toast.error('Delete error ❌');
        }
    };

    const EditStatus = async (e: IVacancy) => {
        const newStatus = e.status === "true" ? "false" : "true";

        try {
            await updateVacancy({
                id: e.id,
                data: {
                    ...e,
                    status: newStatus,
                },
            })
        } catch (err) {
            console.error("Ошибка при смене статуса", err);
        }
    };

    const onStatus = async (e: IVacancy) => {
        try {
            await EditStatus(e)
            toast.success('Successfully Status');
        } catch {
            toast.error('Delete error ❌');
        }
    };

    return (
        <div className='max-w-340.5 m-auto py-3'>
            <Toaster />
            <section>
                <div className='flex justify-between'>
                    <h1 className=' text-4xl font-bold'>Вакансии</h1>
                    <Link href='/vacancy/addvacancy' className='bg-[#FFA900] py-2 px-3 rounded-2xl flex gap-2 text-white'><CirclePlus />Добавить</Link>
                </div>
                <div className='bg-[#FFA900] p-0.5 mt-3 max-w-40 '>
                </div>
                <div className='grid grid-cols-3 py-3 gap-4'>
                    {
                        vacancy.data?.map((e: IVacancy) => (
                            <div key={e.id} className='border hover:translate-y-2 duration-300 p-2 rounded-2xl '>
                                <div
                                    className='flex py-2 justify-between'
                                >
                                    <p className='flex gap-2 items-center text-xs font-medium text-white bg-black backdrop-blur-md px-2 py-1 rounded-lg border border-white/20'>
                                        <BookText className='size-5' />
                                        {e.status === "true" ? "Опыт не нужен" : "Опыт от 1 года"}
                                    </p>
                                    <p className='flex gap-2 items-center text-xs font-medium text-black bg-white/50 backdrop-blur-md px-2 py-1 rounded-lg border border-white/20'>
                                        <MapPin className='size-5' />
                                        {e.city}
                                    </p>
                                </div>
                                <div>
                                    <h1 className='text-2xl font-semibold'>{e.position} </h1>
                                    <p className='text-gray-400'>{e.description}</p>
                                    <div className='flex items-center justify-between'>
                                        <p className='text-[18px] font-semibold text-[#FFA900]'>Подробнее</p>
                                        <div className='flex gap-2 items-center '>
                                            <Trash onClick={() => onDelete(e.id)} className='border-[#FFE6B6] cursor-pointer  text-[#FFA900] border-3 size-10 p-1.5 rounded-xl' />
                                            <FilePenLine onClick={() => router.push(`/vacancy/${e.id}`)} className='border-[#FFE6B6]  cursor-pointer text-[#FFA900]  border-3 size-10 p-1.5 rounded-xl' />
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

export default HomePage