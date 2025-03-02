import React from 'react';

export const HowItWorks = () => {
    const steps = [
        {
            icon: '👤',
            title: 'Profil Oluştur',
            description: 'CV\'nizi yükleyin ve becerilerinizi sergileyin. İşverenler sizi kolayca bulabilsin.'
        },
        {
            icon: '📋',
            title: 'İş İlanlarını Keşfedin',
            description: 'Size uygun iş ilanlarını inceleyin ve teklif verin.'
        },
        {
            icon: '💬',
            title: 'İşverenle Görüşün',
            description: 'Projeyi detaylandırın, beklentileri netleştirin ve anlaşmaya varın.'
        },
        {
            icon: '✅',
            title: 'İşi Tamamlayın',
            description: 'Kaliteli iş teslimatı yapın, güvenilir ödeme sistemi ile ücretinizi alın.'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                    <div className="text-5xl mb-4">{step.icon}</div>
                    <div className="relative mb-6">
                        <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-semibold">
                            {index + 1}
                        </div>
                        {index < steps.length - 1 && (
                            <div className="hidden lg:block absolute top-6 left-12 w-full h-0.5 bg-gray-200"></div>
                        )}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                </div>
            ))}
        </div>
    );
}; 