import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState<'FREELANCER' | 'CLIENT'>('FREELANCER');
    const [formError, setFormError] = useState('');
    const { register, isLoading, error } = useAuthContext();
    const navigate = useNavigate();

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

        if (password.length < 8) {
            setFormError('Password must be at least 8 characters');
            return;
        }

        if (password !== confirmPassword) {
            setFormError('Passwords do not match');
            return;
        }

        try {
            await register({ email, password, role });
            navigate('/dashboard');
        } catch (err) {
            // Error is handled by the useAuth hook and displayed via the error state
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-neutral-900">
                        Freelanza'ya Kaydol
                    </h2>
                    <p className="mt-2 text-sm text-neutral-600">
                        Zaten hesabın var mı?{' '}
                        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                            Giriş yap
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
                            <Input
                                label="Şifre"
                                type="password"
                                id="password"
                                name="password"
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                helperText="En az 8 karakter olmalıdır"
                            />
                        </div>

                        <div>
                            <Input
                                label="Şifreyi Onayla"
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                autoComplete="new-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                                Hesap Türü
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    className={`py-2 px-4 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${role === 'FREELANCER'
                                            ? 'bg-primary-50 border-primary-500 text-primary-700'
                                            : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                                        }`}
                                    onClick={() => setRole('FREELANCER')}
                                >
                                    Freelancer
                                </button>
                                <button
                                    type="button"
                                    className={`py-2 px-4 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${role === 'CLIENT'
                                            ? 'bg-primary-50 border-primary-500 text-primary-700'
                                            : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                                        }`}
                                    onClick={() => setRole('CLIENT')}
                                >
                                    İşveren
                                </button>
                            </div>
                        </div>

                        <div>
                            <Button
                                type="submit"
                                fullWidth
                                isLoading={isLoading}
                                className="py-2.5"
                            >
                                Kaydol
                            </Button>
                        </div>

                        <div className="text-sm text-center text-neutral-600">
                            Kaydolarak, Freelanza'nın{' '}
                            <Link to="/terms" className="font-medium text-primary-600 hover:text-primary-500">
                                Kullanım Şartları
                            </Link>{' '}
                            ve{' '}
                            <Link to="/privacy" className="font-medium text-primary-600 hover:text-primary-500">
                                Gizlilik Politikası
                            </Link>
                            'nı kabul etmiş olursunuz.
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Register; 