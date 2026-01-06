import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div
            className="flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/background.png')" }}
        >
            <div className="bg-black/10 backdrop-blur-md rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/20">
                {/* Logo */}
                <div className="flex flex-col items-center mb-6">
                    <img
                        src="/images/Logo.png"
                        alt="Logo"
                        className="h-16 w-auto object-contain mb-4 drop-shadow-lg"
                    />
                    <h1 className="text-2xl font-semibold text-white">
                        {title}
                    </h1>
                    <p className="text-sm text-gray-300 mt-1">{description}</p>
                </div>

                {/* Form */}
                <div className="text-white">{children}</div>
            </div>
        </div>
    );
}
