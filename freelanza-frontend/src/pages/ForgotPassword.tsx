import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/api';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useMutation } from '../hooks/useMutation';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [formError, setFormError] = useState('');
    const [success, setSuccess] = useState(false);

    const forgotPasswordMutation = useMutation(
        (email: string) => authService.forgotPassword(email),
        {
            onSuccess: () => {
                setSuccess(true);
            }
        }
    );

    const validateForm = (): boolean => {
        if (!email.trim()) {
            setFormError('Email adresi zorunludur');
            return false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setFormError('Geçerli bir email adresi giriniz');
            return false;
        }

        setFormError('');
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await forgotPasswordMutation.mutateAsync(email);
        } catch (err) {
            console.error('Forgot password error:', err);
        }
    };

    return (
        <Layout>
            <div className="max-w-md mx-auto my-10 p-6">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-neutral-900">
                        Şifreni Sıfırla
                    </h2>
                    <p className="mt-2 text-sm text-neutral-600">
                        Şifreni sıfırlamak için email adresini gir
                    </p>
                </div>

                <Card>
                    {success ? (
                        <div className="space-y-6">
                            <div className="p-3 text-sm bg-green-50 text-green-700 rounded-md">
                                Şifre sıfırlama bağlantısı email adresine gönderildi. Lütfen email kutunu kontrol et.
                            </div>
                            <div className="text-center">
                                <Link
                                    to="/login"
                                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                    Giriş Sayfasına Dön
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {(formError || forgotPasswordMutation.error) && (
                                <div className="p-3 text-sm bg-red-50 text-red-500 rounded-md">
                                    {formError || forgotPasswordMutation.error?.message || 'Bir hata oluştu. Lütfen tekrar deneyin.'}
                                </div>
                            )}

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
                                    disabled={forgotPasswordMutation.isPending}
                                    data-testid="email-input"
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    fullWidth
                                    isLoading={forgotPasswordMutation.isPending}
                                    disabled={forgotPasswordMutation.isPending}
                                    data-testid="forgot-password-button"
                                >
                                    {forgotPasswordMutation.isPending ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}
                                </Button>
                            </div>

                            <div className="text-center">
                                <Link to="/login" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                                    Giriş Sayfasına Dön
                                </Link>
                            </div>
                        </form>
                    )}
                </Card>
            </div>
        </Layout>
    );
};

export default ForgotPassword; 