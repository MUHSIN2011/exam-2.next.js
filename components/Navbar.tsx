"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BriefcaseBusiness, CircleUser, DoorOpen, Mails, Newspaper } from "lucide-react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from 'next/navigation'; // Инро истифода баред
import toast, { Toaster } from "react-hot-toast";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();

    if (pathname === "/") {
        return null;
    }
    const handleLogout = () => {
        setTimeout(() => {
            toast.success('Successfully Log Out')
        }, 1500);
        localStorage.removeItem("user");
        router.push("/");
    };

    return (
        <nav className="max-w-340.5 flex justify-between m-auto py-2">
            <Toaster />
            <div className="flex items-center font-semibold gap-20">
                <Image
                    src="/img/Frame 1261154809.png"
                    alt="Logo"
                    width={150}
                    height={50}
                    priority
                />

                <Link
                    href="/home"
                    className={`flex items-center cursor-pointer gap-1 ${pathname === '/home' || pathname === '/home/addnews'
                        ? 'text-[#FFA900]'
                        : 'text-black dark:text-white'
                        }`}
                >
                    <Mails />
                    <p>Новости</p>
                </Link>


                <Link href="/vacancy" className={`flex items-center cursor-pointer gap-1 ${pathname === '/vacancy' || pathname === '/vacancy/addvacancy'
                    ? 'text-[#FFA900]'
                    : 'text-black dark:text-white'}`}>
                    <BriefcaseBusiness />
                    <p>Вакансии</p>
                </Link>

                <Link href="/applications" className={`flex items-center cursor-pointer gap-1 ${pathname === '/applications'
                    ? 'text-[#FFA900]'
                    : 'text-black dark:text-white'}`}>
                    <Newspaper />
                    <p>Заявки</p>
                </Link>
            </div>

            <div className="flex gap-5 items-center">
                <DropdownMenu>
                    <DropdownMenuTrigger><CircleUser /></DropdownMenuTrigger>
                    <DropdownMenuContent className="w-40">
                        <DropdownMenuLabel>
                            <div className="flex items-center gap-3">
                                <CircleUser />
                                <div>
                                    <h1 className="font-semibold">Admin</h1>
                                    <p>914049999</p>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 font-semibold">
                            <div onClick={() => handleLogout()} className="flex items-center gap-1">
                                <DoorOpen className="text-red-600" />
                                Get Out
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <AnimatedThemeToggler />
            </div>
        </nav >
    );
}