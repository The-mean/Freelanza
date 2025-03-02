import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formError, setFormError] = useState('');
    const { login, isLoading, error } = useAuthContext();
    const navigate = useNavigate();
    const location = useLocation();

    // Get the redirect path from location state or default to dashboard
    const from = (location.state as any)?.from?.pathname || '/dashboard';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');

        // Simple validation
        if (!email.trim()) {
            setFormError('Email is required');
            return;
        }

        if (!password) {
            setFormError('Password is required');
            return;
        }

        try {
            await login({ email, password });
            navigate(from, { replace: true });
        } catch (err) {
            // Error is handled by the useAuth hook and displayed via the error state
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-neutral-900">
                        Freelanza'ya Giriş Yap
                    </h2>
                    <p className="mt-2 text-sm text-neutral-600">
                        Hesabın yok mu?{' '}
                        <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                            Hemen kaydol
                        </Link>
                    </p>
                </div>

                <Card className="mt-8">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {(formError || error) && (
                            <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-md text-sm">
                                {formError || error}
                            </div>
                        )}

                        <div>
                            <Input
                                label="Email Adresi"
                                type="email"
                                id="email"
                                name="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="ornek@email.com"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <Input
                                    label="Şifre"
                                    type="password"
                                    id="password"
                                    name="password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="text-right mt-1">
                                <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                                    Şifreni mi unuttun?
                                </Link>
                            </div>
                        </div>

                        <div>
                            <Button
                                type="submit"
                                fullWidth
                                isLoading={isLoading}
                                className="py-2.5"
                            >
                                Giriş Yap
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Login; 