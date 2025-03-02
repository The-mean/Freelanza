import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const { login, isLoading, error, isAuthenticated } = useAuthContext();
    const navigate = useNavigate();
    const location = useLocation();

    // Get the redirect path from location state or default to dashboard
    const from = (location.state as any)?.from?.pathname || '/dashboard';

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    const validateForm = (): boolean => {
        const errors: { [key: string]: string } = {};

        if (!email.trim()) {
            errors.email = 'Email adresi zorunludur';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Geçerli bir email adresi giriniz';
        }

        if (!password) {
            errors.password = 'Şifre zorunludur';
        } else if (password.length < 6) {
            errors.password = 'Şifre en az 6 karakter olmalıdır';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await login({ email, password });
            // Auth context will handle the redirection on success
        } catch (err) {
            // Error is handled by the useAuth hook
            console.error('Login error:', err);
        }
    };

    return (
        <Layout>
            <div className="max-w-md mx-auto my-10 p-6">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-neutral-900">
                        Freelanza'ya Giriş Yap
                    </h2>
                    <p className="mt-2 text-sm text-neutral-600">
                        Hesabın yok mu?{' '}
                        <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                            Hemen kaydol
                        </Link>
                    </p>
                </div>

                <Card>
                    {error && (
                        <div className="p-3 mb-4 text-sm bg-red-50 text-red-500 rounded-md">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                                Email Adresi
                            </label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email adresinizi girin"
                                error={formErrors.email}
                                disabled={isLoading}
                                data-testid="email-input"
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between">
                                <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                                    Şifre
                                </label>
                                <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                                    Şifremi Unuttum
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Şifrenizi girin"
                                error={formErrors.password}
                                disabled={isLoading}
                                data-testid="password-input"
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Button
                                type="submit"
                                variant="primary"
                                fullWidth
                                isLoading={isLoading}
                                disabled={isLoading}
                                data-testid="login-button"
                            >
                                {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </Layout>
    );
};

export default Login; 