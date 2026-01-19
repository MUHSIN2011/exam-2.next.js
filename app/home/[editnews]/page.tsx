"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

import { useForm } from "react-hook-form";
import {
    useGetNewsByIdQuery,
    useUpdateNewsMutation,
} from "@/app/api/api";
import { CornerUpLeft, Link as LinkIcon, Menu, Upload, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";

function EditNewsPage() {
    const { editnews } = useParams();
    console.log(editnews);

    const router = useRouter();

    const [updateNews, { isLoading: updating, }] = useUpdateNewsMutation();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };


    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const [image, setImage] = useState<string | null>(null);

    const { data, isLoading } = useGetNewsByIdQuery(editnews as string);

    useEffect(() => {
        if (data) {
            reset({
                title: data.title ?? "",
                description: data.description ?? "",
                date: data.date ?? "",
                status: data.status ?? "show",
            });
            setImage(data.img ?? null);
        }
    }, [data, reset]);


    const onSubmit = async (formData: any) => {
        try {
            await updateNews({
                id: editnews as string,
                data: {
                    ...formData,
                    img: image,
                },
            }).unwrap();

            toast.success("Successfully Edit")
            router.push("/home");
        } catch (err) {
            console.error(err);
            alert("Ошибка при обновлении");
        }
    };


    return (
        <div className='bg-white min-h-screen p-4'>
            <Toaster />
            <div className='max-w-[450px] m-auto my-3'>
                <Link href="/home" className='flex items-center gap-3 mb-6'>
                    <CornerUpLeft className='border-[#FFA900] border-2 rounded-full size-10 p-2 text-[#FFA900]' />
                    <h1 className='text-3xl font-bold'>Добавить новость</h1>
                </Link>

                <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <input
                            {...register("title", { required: true })}
                            placeholder="Название"
                            className={`border p-3 rounded-xl w-full outline-none focus:border-[#FFA900] ${errors.title ? 'border-red-500' : ''}`}
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message as string}</p>}
                    </div>

                    <textarea
                        {...register("description")}
                        placeholder="Краткое описание"
                        className="border p-3 rounded-xl w-full min-h-[80px] outline-none focus:border-[#FFA900]"
                    />

                    <input
                        {...register("date")}
                        className='border rounded-xl py-3 px-4 outline-none focus:border-[#FFA900]'
                        type="date"

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
                        <div
                            onClick={() => !image && fileInputRef.current?.click()}
                            className={`relative shadow w-full h-70 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all ${image ? "border-none" : "border-gray-200 bg-[#F9F9F9]"
                                }`}
                        >
                            {image ? (
                                <div className="relative w-full h-full">
                                    <Image src={image} alt="Preview" fill className="object-cover shadow rounded-3xl" />
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removeImage(); }}
                                        className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full shadow-lg z-10"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <div className="bg-[#FFA900] p-4 rounded-2xl mb-4 shadow-md text-white">
                                        <Upload size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold">Загрузить фото</h3>
                                    <p className='text-gray-500'>Размер файла не более 5 МБ</p>
                                </div>
                            )}
                        </div>

                        <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />

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

export default EditNewsPage;