"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, } from "react";

import { useForm } from "react-hook-form";
import {
    useGetVacancyByIdQuery,
    useUpdateVacancyMutation,
} from "@/app/api/api";
import { CornerUpLeft, Link as LinkIcon, Menu, } from "lucide-react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

export interface IVacancy {
  id: string;
  position: string;
  description: string;
  city: string;
  status: string;
  phone?: string;
  email?: string;
}

function EditVacancyPage() {
    const { editvacancy } = useParams<string>();

    const router = useRouter();

    const [updateVacancy, { isLoading: updating, }] = useUpdateVacancyMutation();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<IVacancy>();


    const { data } = useGetVacancyByIdQuery(editvacancy);

    useEffect(() => {
        if (data) {
            reset({
                position: data.position ?? "",
                description: data.description ?? "",
                city: data.city ?? "",
                status: data.status ?? "true",
            });
        }
    }, [data, reset]);


    const onSubmit = async (formData: IVacancy) => {
        try {
            await updateVacancy({
                id: editvacancy,
                data: {
                    ...formData,
                },
            }).unwrap();

            toast.success("Successfully Edit")
            router.push("/vacancy");
        } catch (err) {
            console.error(err);
            toast.success("Ошибка при обновлении");
        }
    };


    return (
        <div className='bg-white min-h-screen p-4'>
            <Toaster />
            <div className='max-w-[450px] m-auto my-3'>
                <Link href="/vacancy" className='flex items-center gap-3 mb-6'>
                    <CornerUpLeft className='border-[#FFA900] border-2 rounded-full size-10 p-2 text-[#FFA900]' />
                    <h1 className='text-3xl font-bold'>Добавить новость</h1>
                </Link>

                <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <input
                            {...register("position", { required: true })}
                            placeholder="Название"
                            className={`border p-3 rounded-xl w-full outline-none focus:border-[#FFA900] ${errors.title ? 'border-red-500' : ''}`}
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message as string}</p>}
                    </div>

                    <textarea
                        {...register("description")}
                        placeholder="Краткое описание"
                        className="border p-3 rounded-xl w-full min-h-[100px] outline-none focus:border-[#FFA900]"
                    />

                    <input
                        {...register("city")}
                        placeholder="city"
                        className='border rounded-xl py-3 px-4 outline-none focus:border-[#FFA900]'
                        type="text"

                    />

                    <div className='flex justify-between items-center my-2'>
                        <h1 className='text-2xl font-semibold'>Статус</h1>
                        <div className='flex gap-2'>
                            <label className='border-[#FFA900] border-2 rounded-xl py-2 px-4 flex items-center gap-2 cursor-pointer'>
                                <input {...register("status")} type="radio" value="true" defaultChecked className='accent-[#FFA900]' />
                                <span>Показать</span>
                            </label>
                            <label className='border-[#FFA900] border-2 rounded-xl py-2 px-4 flex items-center gap-2 cursor-pointer'>
                                <input {...register("status")} type="radio" value="false" className='accent-[#FFA900]' />
                                <span>Скрыть</span>
                            </label>
                        </div>
                    </div>

                    <div className='flex flex-col  rounded-xl overflow-hidden shadow'>
                        <div className='flex gap-5 p-3 border-b bg-gray-50  items-center'>
                            <h1 className='text-[16px] text-gray-400'>Normal</h1>
                            <div className='flex gap-5 items-center'>
                                <span className='font-bold text-lg cursor-pointer'>B</span>
                                <span className='italic text-lg cursor-pointer'>I</span>
                                <span className='underline text-lg cursor-pointer'>U</span>
                                <LinkIcon className='size-5' />
                                <Menu className='size-5' />
                            </div>
                        </div>
                        <textarea
                            className='w-full min-h-[120px] py-3 px-4 outline-none'
                            placeholder='Контент новости...'
                        />
                    </div>

                    <div className="w-full mt-4 ">
                        <div className="flex gap-4 w-full mt-8">
                            <button
                                type="submit"
                                disabled={updating}
                                className="bg-[#FFA900] text-white py-3 w-[50%] rounded-full font-bold hover:bg-[#e69900] disabled:bg-gray-400"
                            >
                                {updating ? "Загрузка..." : "Сохранить"}

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

export default EditVacancyPage;