import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const ResetPassword: React.FC = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Extract token from URL query parameters
        const queryParams = new URLSearchParams(location.search);
        const tokenParam = queryParams.get('token');
        if (tokenParam) {
            setToken(tokenParam);
        } else {
            setError('Reset token is missing. Please use the link from your email.');
        }
    }, [location]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!token) {
            setError('Reset token is missing. Please use the link from your email.');
            return;
        }

        if (!password) {
            setError('Password is required');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            setIsLoading(true);
            await authService.resetPassword({ token, password });
            setSuccess(true);
            // Redirect to login page after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);
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
                        Yeni Şifre Belirle
                    </h2>
                    <p className="mt-2 text-sm text-neutral-600">
                        Hesabın için yeni bir şifre oluştur
                    </p>
                </div>

                <Card className="mt-8">
                    {success ? (
                        <div className="space-y-6">
                            <div className="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-md text-sm">
                                Şifren başarıyla değiştirildi. Giriş sayfasına yönlendiriliyorsun...
                            </div>
                            <div className="text-center">
                                <Link to="/login">
                                    <Button variant="primary">Giriş Sayfasına Git</Button>
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
                                    label="Yeni Şifre"
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
                                <Button
                                    type="submit"
                                    fullWidth
                                    isLoading={isLoading}
                                    className="py-2.5"
                                    disabled={!token}
                                >
                                    Şifreyi Sıfırla
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

export default ResetPassword; 