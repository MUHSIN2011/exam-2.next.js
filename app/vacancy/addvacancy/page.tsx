"use client";
import { useForm } from "react-hook-form";
import { CornerUpLeft, Menu, Link as LinkIcon,  } from 'lucide-react'
import Link from 'next/link';
import { useAddvacancyMutation } from '@/app/api/api';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from "react-hot-toast";


function AddNewsPage() {
    const router = useRouter();
    const [addvacancy, { isLoading: addLoading }]= useAddvacancyMutation();

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data: any) => {

        try {
            const payload = {
                ...data,
            };

            await addvacancy(payload).unwrap();
            toast.success("Новость успешно добавлена!");
            router.push('/home');
        } catch (err) {
            console.error("Ошибка при добавлении:", err);
            alert("Хатогӣ ҳангоми сабт!");
        }
    };

    return (
        <div className='bg-white min-h-[90vh] p-4'>
            <Toaster />
            <div className='max-w-112.5 m-auto my-3'>
                <Link href="/vacancy" className='flex items-center gap-3 mb-6'>
                    <CornerUpLeft className='border-[#FFA900] border-2 rounded-full size-10 p-2 text-[#FFA900]' />
                    <h1 className='text-3xl font-bold'>Добавить вакансию</h1>
                </Link>

                <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <input
                            {...register("position", { required: "Заголовок обязательно!" })}
                            placeholder="Название"
                            className={`border p-3 rounded-xl w-full outline-none focus:border-[#FFA900] ${errors.title ? 'border-red-500' : ''}`}
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message as string}</p>}
                    </div>

                    <textarea
                        {...register("description", { required: "Описание обязательно!" })}
                        placeholder="Краткое описание"
                        className="border p-3 rounded-xl w-full min-h-20 outline-none focus:border-[#FFA900]"
                    />

                    <input
                        {...register("city")}
                        className='border rounded-xl py-3 px-4 outline-none focus:border-[#FFA900]'
                        type="text"
                        placeholder="City"
                        
                    />

                    <div className='flex justify-between items-center my-2'>
                        <h1 className='text-2xl font-semibold'>Статус</h1>
                        <div className='flex gap-2'>
                            <label className='border-[#FFA900] border-2 rounded-xl py-2 px-4 flex items-center gap-2 cursor-pointer'>
                                <input {...register("status")} type="radio" value="show" defaultChecked className='accent-[#FFA900]' />
                                <span>Показать</span>
                            </label>
                            <label className='border-[#FFA900] border-2 rounded-xl py-2 px-4 flex items-center gap-2 cursor-pointer'>
                                <input {...register("status")} type="radio" value="hide" className='accent-[#FFA900]' />
                                <span>Скрыть</span>
                            </label>
                        </div>
                    </div>

                    <div className='flex flex-col border rounded-xl overflow-hidden'>
                        <div className='flex gap-5 p-3 border-b bg-gray-50 items-center'>
                            <h1 className='text-[16px] text-gray-500'>Normal</h1>
                            <div className='flex gap-5 items-center'>
                                <span className='font-bold text-lg cursor-pointer'>B</span>
                                <span className='italic text-lg cursor-pointer'>I</span>
                                <span className='underline text-lg cursor-pointer'>U</span>
                                <LinkIcon className='size-5' />
                                <Menu className='size-5' />
                            </div>
                        </div>
                        <textarea
                            className='w-full min-h-30 py-3 px-4 outline-none'
                            placeholder='Контент новости...'
                        />
                    </div>

                    <div className="w-full">
                        <div className="flex gap-4 w-full">
                            <button
                                type="submit"
                                disabled={addLoading}
                                className="bg-[#FFA900] text-white py-3 w-[50%] rounded-full font-bold hover:bg-[#e69900] disabled:bg-gray-400"
                            >
                                {addLoading ? "Загрузка..." : "Сохранить"}
                            </button>
                            <Link href="/home" className="flex-1 border-2 border-[#FFA900] text-[#FFA900] py-3 rounded-full font-bold hover:bg-orange-50 text-center">
                                Отмена
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddNewsPage;