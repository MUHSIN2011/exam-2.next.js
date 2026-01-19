"use client";
import { useRouter } from "next/navigation";
import { useLazyLoginQuery } from "./api/api";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";

export default function Home() {
  const router = useRouter();
  const [trigger, { isFetching }] = useLazyLoginQuery();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData: any) => {
    try {
      const result = await trigger({
        email: formData.email,
        password: formData.password
      }).unwrap();

      if (result.length > 0) {
        toast.success('Хуш омадед!');
        localStorage.setItem("user", JSON.stringify(result[0]));

        setTimeout(() => {
          router.push("/home");
        }, 1500);
      } else {
        toast.error('Email ё парол хато аст!');
      }
    } catch (err) {
      toast.error('Хатогии сервер!');
    }
  };

  return (
    <div className="flex justify-center h-[90vh] items-center ">
      <Toaster />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 w-80 text-center">
        <div className="m-auto mb-4">
          <Image src="/img/Frame 1261154809.png" alt="Logo" width={200} height={200} />
        </div>

        {/* Email Input */}
        <div className="flex flex-col text-left">
          <input
            {...register("email")}
            className={`border ${errors.email ? 'border-red-500' : 'border-gray-300'} text-black py-2 px-3 rounded-xl`}
            placeholder="Email"
            type="email"
          />
          <p className="text-red-500 text-xs mt-1 ml-2">{errors.email?.message?.toString()}</p>
        </div>

        {/* Password Input */}
        <div className="flex flex-col text-left">
          <input
            {...register("password")}
            className={`border ${errors.password ? 'border-red-500' : 'border-gray-300'} text-black py-2 px-3 rounded-xl`}
            placeholder="Пароль"
            type="password"
          />
          <p className="text-red-500 text-xs mt-1 ml-2">{errors.password?.message?.toString()}</p>
        </div>

        <button
          disabled={isFetching}
          type="submit"
          className="bg-[#FFA900] py-2 px-3 w-full rounded-2xl text-white mt-4 disabled:bg-gray-400"
        >
          {isFetching ? "Дар ҳоли санҷиш..." : "Войти"}
        </button>
      </form>
    </div>
  );
}