import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/api';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useMutation } from '../hooks/useMutation';

const ResetPassword: React.FC = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState('');
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Extract token from URL query parameters
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tokenParam = queryParams.get('token');
        if (tokenParam) {
            setToken(tokenParam);
        } else {
            setFormErrors({ token: 'Sıfırlama kodu eksik. Lütfen email\'deki bağlantıyı kullanın.' });
        }
    }, [location]);

    // Reset password mutation
    const resetPasswordMutation = useMutation(
        (data: { token: string; password: string }) => authService.resetPassword(data.token, data.password),
        {
            onSuccess: () => {
                setSuccess(true);
                // Redirect to login page after 3 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }
        }
    );

    const validateForm = (): boolean => {
        const errors: { [key: string]: string } = {};

        if (!token) {
            errors.token = 'Sıfırlama kodu eksik. Lütfen email\'deki bağlantıyı kullanın.';
        }

        if (!password) {
            errors.password = 'Şifre zorunludur';
        } else if (password.length < 6) {
            errors.password = 'Şifre en az 6 karakter olmalıdır';
        }

        if (password !== confirmPassword) {
            errors.confirmPassword = 'Şifreler eşleşmiyor';
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
            await resetPasswordMutation.mutateAsync({ token, password });
        } catch (err) {
            console.error('Reset password error:', err);
        }
    };

    return (
        <Layout>
            <div className="max-w-md mx-auto my-10 p-6">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-neutral-900">
                        Yeni Şifre Belirle
                    </h2>
                    <p className="mt-2 text-sm text-neutral-600">
                        Hesabın için yeni bir şifre oluştur
                    </p>
                </div>

                <Card>
                    {success ? (
                        <div className="space-y-6">
                            <div className="p-3 text-sm bg-green-50 text-green-700 rounded-md">
                                Şifren başarıyla değiştirildi. Giriş sayfasına yönlendiriliyorsun...
                            </div>
                            <div className="text-center">
                                <Link
                                    to="/login"
                                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                    Giriş Sayfasına Git
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {(formErrors.token || resetPasswordMutation.error) && (
                                <div className="p-3 text-sm bg-red-50 text-red-500 rounded-md">
                                    {formErrors.token || resetPasswordMutation.error?.message || 'Bir hata oluştu. Lütfen tekrar deneyin.'}
                                </div>
                            )}

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                                    Yeni Şifre
                                </label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Yeni şifrenizi girin"
                                    helperText="En az 6 karakter olmalıdır"
                                    error={formErrors.password}
                                    disabled={resetPasswordMutation.isPending}
                                    data-testid="password-input"
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700">
                                    Şifreyi Onayla
                                </label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Şifrenizi tekrar girin"
                                    error={formErrors.confirmPassword}
                                    disabled={resetPasswordMutation.isPending}
                                    data-testid="confirm-password-input"
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    fullWidth
                                    isLoading={resetPasswordMutation.isPending}
                                    disabled={resetPasswordMutation.isPending || !token}
                                    data-testid="reset-password-button"
                                >
                                    {resetPasswordMutation.isPending ? 'İşleniyor...' : 'Şifreyi Sıfırla'}
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

export default ResetPassword; 