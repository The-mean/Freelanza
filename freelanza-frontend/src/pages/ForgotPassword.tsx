import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (!email.trim()) {
            setError('Email is required');
            return;
        }

        try {
            setIsLoading(true);
            await authService.forgotPassword({ email });
            setSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-neutral-900">
                        Şifreni Sıfırla
                    </h2>
                    <p className="mt-2 text-sm text-neutral-600">
                        Şifreni sıfırlamak için email adresini gir
                    </p>
                </div>

                <Card className="mt-8">
                    {success ? (
                        <div className="space-y-6">
                            <div className="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-md text-sm">
                                Şifre sıfırlama talimatları email adresine gönderildi. Lütfen gelen kutunu kontrol et.
                            </div>
                            <div className="text-center">
                                <Link to="/login">
                                    <Button variant="primary">Giriş Sayfasına Dön</Button>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {error && (
                                <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-md text-sm">
                                    {error}
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
                                <Button
                                    type="submit"
                                    fullWidth
                                    isLoading={isLoading}
                                    className="py-2.5"
                                >
                                    Şifre Sıfırlama Bağlantısı Gönder
                                </Button>
                            </div>

                            <div className="text-center">
                                <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                                    Giriş sayfasına dön
                                </Link>
                            </div>
                        </form>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default ForgotPassword; 