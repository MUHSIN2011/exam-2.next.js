"use client"
import { Import } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useGetApplicationQuery } from '../api/api';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

function page() {
    const [page, setPage] = useState(1);
    const limit = 6;

    const { data: partnershipData, isLoading, error } = useGetApplicationQuery({ page, limit });

    const pages = [];

    for (let i = 1; i <= partnershipData?.pages; i++) {
        pages.push(i);
    }

    const [activeTab, setActiveTab] = useState("partnership");
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
    </div>;;

    return (
        <div className='max-w-340.5 m-auto py-3'>
            <Toaster />
            <section>
                <div className='flex justify-between'>
                    <h1 className=' text-4xl font-bold '>Заявки</h1>
                    <div className="bg-[#F4F4F5] dark:bg-black p-1 rounded-2xl inline-flex">
                        <button
                            onClick={() => setActiveTab("partnership")}
                            className={`py-2 px-3 rounded-xl transition-all duration-200 ${activeTab === "partnership"
                                ? "bg-[#FFFFFF] border dark:bg-[#1111] dark:text-white text-black"
                                : "text-gray-500 dark:border-gray-400"
                                }`}
                        >
                            На партнёрство
                        </button>

                        <button
                            onClick={() => setActiveTab("vacancies")}
                            className={`py-2 px-3 rounded-xl transition-all duration-200 ${activeTab === "vacancies"
                                ? "bg-[#FFFFFF] border dark:bg-[#1111] dark:text-white text-black"
                                : "text-gray-500 dark:border-gray-400"
                                }`}
                        >
                            На вакансии
                        </button>
                    </div>
                </div>
                <div className='bg-[#FFA900] p-0.5 mt-3 max-w-40 '>
                </div>

                <div className="w-full overflow-hidden rounded-2xl mt-5 ">
                    <table className="w-full border-collapse bg-white dark:bg-[#1111]">
                        <thead>
                            <tr className="bg-[#F4F4F5] dark:bg-[#1a1a1a] shadow-sm border-b  text-gray-800 dark:text-white text-sm">
                                <th className="px-4 py-4 text-left font-semibold">ФИО</th>
                                <th className="px-4 py-4 text-center font-semibold">Телефон</th>
                                <th className="px-4 py-4 text-center font-semibold">Email</th>
                                <th className="px-4 py-4 text-center font-semibold">Название компании</th>
                                <th className="px-4 py-4 text-center font-semibold">Дата</th>
                                <th className="px-4 py-4 text-center font-semibold">Статус</th>
                                <th className="px-4 py-4 text-center font-semibold">Предложение</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(activeTab === "partnership" ? partnershipData?.data : partnershipData?.data?.filter((item: any) => item.status === true || item.status === "true")
                            )?.map((e: any) => (
                                <tr key={e.id} className="border-b border-gray-100 ">
                                    <td className="px-4 py-4 text-black dark:text-white font-medium">{e.name}</td>
                                    <td className="px-4 py-4 text-center font-medium">{e.phone}</td>
                                    <td className="px-4 py-4 text-center font-medium">{e.email}</td>
                                    <td className="px-4 py-4 text-center font-medium">{e.company}</td>
                                    <td className="px-4 py-4 text-center font-medium">{e.date}</td>
                                    <td className="px-4 py-4 text-center font-medium">{e.status === "true" ? <span className='bg-green-400/90 py-1 px-3 text-white rounded-2xl '>Active</span> : <span className='bg-red-400/90 py-1 px-3 text-white rounded-2xl '>inactive</span>}</td>
                                    <td className="px-4 py-4 text-center">
                                        <button className="p-2 hover:bg-gray-200 rounded-lg">
                                            <Import className="size-5 text-orange-400" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


                <div className='flex gap-2 justify-end items-center mt-5'>
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className='px-3 py-1 border rounded-full hover:bg-gray-100 disabled:opacity-50'
                        disabled={page === 1}
                    >
                        {'<'}
                    </button>

                    {pages.map((p) => (
                        <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`px-3 py-1 border rounded-full transition-colors ${page === p ? 'bg-[#FFA900] text-white' : 'hover:bg-gray-100'
                                }`}
                        >
                            {p}
                        </button>
                    ))}

                    <button
                        onClick={() => setPage(p => p + 1)}
                        className='px-3 py-1 border rounded-full hover:bg-gray-100'
                    >
                        {'>'}
                    </button>
                </div>
            </section>
        </div>
    )
}

export default page