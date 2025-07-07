import { useState } from "react";
import { register } from "../services/authService";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { TextFieldAtom } from "../components/atoms/TextFieldAtom";
import { ButtonAtom } from "../components/atoms/ButtonAtom";
import { TypographyAtom } from "../components/atoms/TypographyAtom";

export function RegisterPage() {
    const [form, setForm] = useState({ 
        username: "", 
        password: "", 
        confirmPassword: "",
        email: "",
        fullName: ""
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) navigate("/dashboard");
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!form.fullName.trim()) {
            newErrors.fullName = "Nama lengkap harus diisi";
        }

        if (!form.username.trim()) {
            newErrors.username = "Username harus diisi";
        } else if (form.username.length < 3) {
            newErrors.username = "Username minimal 3 karakter";
        }

        if (!form.email.trim()) {
            newErrors.email = "Email harus diisi";
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = "Format email tidak valid";
        }

        if (!form.password) {
            newErrors.password = "Password harus diisi";
        } else if (form.password.length < 6) {
            newErrors.password = "Password minimal 6 karakter";
        }

        if (!form.confirmPassword) {
            newErrors.confirmPassword = "Konfirmasi password harus diisi";
        } else if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = "Password tidak sama";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            // eslint-disable-next-line no-unused-vars
            const { confirmPassword, ...registerData } = form;
            await register(registerData);
            
            Swal.fire({
                title: "Berhasil!",
                text: "Registrasi berhasil! Silakan login dengan akun Anda.",
                icon: "success",
                confirmButtonText: "OK"
            }).then(() => {
                navigate("/login");
            });
        } catch (error) {
            console.error("Registration error:", error);
            Swal.fire({
                title: "Gagal!",
                text: error.response?.data?.message || "Terjadi kesalahan saat registrasi",
                icon: "error",
                confirmButtonText: "OK"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <TypographyAtom variant="h2" className="text-gray-900 font-bold">
                        Daftar Akun Baru
                    </TypographyAtom>
                    <TypographyAtom variant="body2" className="mt-2 text-gray-600">
                        Sudah punya akun?{" "}
                        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            Masuk di sini
                        </Link>
                    </TypographyAtom>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
                    <div className="space-y-4">
                        <TextFieldAtom
                            label="Nama Lengkap"
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            error={!!errors.fullName}
                            helperText={errors.fullName}
                            type="text"
                        />

                        <TextFieldAtom
                            label="Username"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            error={!!errors.username}
                            helperText={errors.username}
                            type="text"
                        />

                        <TextFieldAtom
                            label="Email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email}
                            type="email"
                        />

                        <TextFieldAtom
                            label="Password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            error={!!errors.password}
                            helperText={errors.password}
                            type="password"
                        />

                        <TextFieldAtom
                            label="Konfirmasi Password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                            type="password"
                        />
                    </div>

                    <div className="pt-4">
                        <ButtonAtom
                            type="submit"
                            color="blue"
                            className="w-full py-3"
                            disabled={isLoading}
                        >
                            {isLoading ? "Mendaftar..." : "Daftar"}
                        </ButtonAtom>
                    </div>
                </form>
            </div>
        </div>
    );
}