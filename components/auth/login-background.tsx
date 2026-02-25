"use client"

import { motion } from "framer-motion"

interface LoginBackgroundProps {
    imagePath: string
    blur?: boolean
}

export function LoginBackground({ imagePath, blur = false }: LoginBackgroundProps) {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-zinc-950">
            {/* Base Image */}
            <motion.div
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0"
            >
                <img
                    src={imagePath}
                    alt="Background"
                    className={`w-full h-full object-cover ${blur ? 'blur-sm scale-105' : ''}`}
                />
            </motion.div>

            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-white/10" />

            {/* Subtle light effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -mr-64 -mt-64 opacity-30" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px] -ml-40 -mb-40 opacity-20" />
        </div>
    )
}
