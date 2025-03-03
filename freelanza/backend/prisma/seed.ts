import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

async function main() {
    console.log('🌱 Veritabanına örnek veriler ekleniyor...');

    // Kategorileri oluştur
    const categories = [
        { name: 'Web Geliştirme', icon: '💻' },
        { name: 'Mobil Uygulama', icon: '📱' },
        { name: 'Grafik Tasarım', icon: '🎨' },
        { name: 'İçerik Yazarlığı', icon: '✍️' },
        { name: 'SEO', icon: '🔍' },
        { name: 'Pazarlama', icon: '📈' },
        { name: 'Video Prodüksiyon', icon: '🎬' },
        { name: 'Veri Analizi', icon: '📊' },
    ];

    console.log('Kategoriler oluşturuluyor...');
    for (const category of categories) {
        await prisma.category.upsert({
            where: { name: category.name },
            update: {},
            create: {
                name: category.name,
                icon: category.icon,
            },
        });
    }

    // Becerileri oluştur
    const skills = [
        'JavaScript', 'React', 'Node.js', 'TypeScript', 'HTML', 'CSS',
        'Python', 'Java', 'Swift', 'Kotlin', 'Flutter', 'React Native',
        'Photoshop', 'Illustrator', 'Figma', 'UI/UX', 'WordPress',
        'SEO', 'İçerik Yazarlığı', 'Copywriting', 'Social Media', 'Video Editing',
        'Data Analysis', 'SQL', 'Excel', 'Digital Marketing'
    ];

    console.log('Beceriler oluşturuluyor...');
    for (const skillName of skills) {
        await prisma.skill.upsert({
            where: { name: skillName },
            update: {},
            create: {
                name: skillName,
            },
        });
    }

    // İşveren hesabı oluştur
    console.log('İşveren kullanıcı oluşturuluyor...');
    const employerPassword = await hashPassword('password123');
    const employer = await prisma.user.upsert({
        where: { email: 'employer@example.com' },
        update: {},
        create: {
            email: 'employer@example.com',
            hashedPassword: employerPassword,
            role: UserRole.CLIENT,
            status: UserStatus.ACTIVE,
            emailVerified: true,
            clientProfile: {
                create: {
                    companyName: 'Acme Corporation',
                    contactName: 'Ahmet Yılmaz',
                    contactTitle: 'İK Direktörü',
                    description: 'Yazılım geliştirme ve dijital dönüşüm hizmetleri sunan bir teknoloji şirketi.',
                    location: 'İstanbul, Türkiye',
                    website: 'https://example.com',
                },
            },
        },
    });

    // Freelancer hesapları oluştur
    console.log('Freelancer kullanıcılar oluşturuluyor...');
    const freelancerPassword = await hashPassword('password123');

    // Freelancer 1
    const freelancer1 = await prisma.user.upsert({
        where: { email: 'freelancer1@example.com' },
        update: {},
        create: {
            email: 'freelancer1@example.com',
            hashedPassword: freelancerPassword,
            role: UserRole.FREELANCER,
            status: UserStatus.ACTIVE,
            emailVerified: true,
            profile: {
                create: {
                    firstName: 'Zeynep',
                    lastName: 'Kaya',
                    title: 'Full Stack Geliştirici',
                    bio: '5+ yıllık deneyime sahip, React ve Node.js uzmanı full stack geliştiriciyim.',
                    hourlyRate: 250,
                    location: 'İzmir, Türkiye',
                    website: 'https://zeynepdeveloper.com',
                    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
                },
            },
        },
    });

    // Freelancer 2
    const freelancer2 = await prisma.user.upsert({
        where: { email: 'freelancer2@example.com' },
        update: {},
        create: {
            email: 'freelancer2@example.com',
            hashedPassword: freelancerPassword,
            role: UserRole.FREELANCER,
            status: UserStatus.ACTIVE,
            emailVerified: true,
            profile: {
                create: {
                    firstName: 'Mehmet',
                    lastName: 'Demir',
                    title: 'UI/UX Tasarımcı',
                    bio: 'Kullanıcı odaklı tasarımlar ve akıcı kullanıcı deneyimleri oluşturan tutkulu bir tasarımcıyım.',
                    hourlyRate: 200,
                    location: 'Ankara, Türkiye',
                    website: 'https://mehmetdesigns.com',
                    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
                },
            },
        },
    });

    // Beceri ilişkilerini kur (freelancer'lara beceri ekle)
    console.log('Freelancer beceri ilişkileri kuruluyor...');

    // Zeynep'in becerileri
    const zeynepSkills = ['JavaScript', 'React', 'Node.js', 'TypeScript', 'HTML', 'CSS'];
    const zeynepSkillsData = await Promise.all(
        zeynepSkills.map(name => prisma.skill.findUnique({ where: { name } }))
    );

    for (const skill of zeynepSkillsData) {
        if (skill) {
            await prisma.profile.update({
                where: { userId: freelancer1.id },
                data: {
                    skills: {
                        connect: { id: skill.id },
                    },
                },
            });
        }
    }

    // Mehmet'in becerileri
    const mehmetSkills = ['UI/UX', 'Figma', 'Photoshop', 'Illustrator'];
    const mehmetSkillsData = await Promise.all(
        mehmetSkills.map(name => prisma.skill.findUnique({ where: { name } }))
    );

    for (const skill of mehmetSkillsData) {
        if (skill) {
            await prisma.profile.update({
                where: { userId: freelancer2.id },
                data: {
                    skills: {
                        connect: { id: skill.id },
                    },
                },
            });
        }
    }

    // İş ilanları oluştur
    console.log('İş ilanları oluşturuluyor...');

    // İş ilanı 1
    const job1 = await prisma.jobPosting.create({
        data: {
            title: 'E-ticaret Web Sitesi Geliştirme',
            description: 'Moda ürünleri satacak olan e-ticaret sitemiz için modern ve kullanıcı dostu bir web sitesi geliştirmesi yapılacak. Site responsive olmalı ve hızlı yüklenmelidir.',
            creatorId: employer.id,
            budgetType: 'FIXED',
            budget: 15000,
            isRemote: true,
            experience: 'INTERMEDIATE',
            status: 'OPEN',
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 gün sonra
            location: 'Uzaktan',
        },
    });

    // İş ilanı 2
    const job2 = await prisma.jobPosting.create({
        data: {
            title: 'Mobil Uygulama UI Tasarımı',
            description: 'Fitness takibi yapacak olan bir mobil uygulama için UI tasarımları yaptırmak istiyoruz. Tasarımlar modern ve kullanıcı dostu olmalıdır.',
            creatorId: employer.id,
            budgetType: 'FIXED',
            budget: 7500,
            isRemote: true,
            experience: 'EXPERT',
            status: 'OPEN',
            deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 gün sonra
            location: 'Uzaktan',
        },
    });

    // İş beceri ilişkilerini kur
    console.log('İş ilanı beceri ilişkileri kuruluyor...');

    // İş ilanı 1 için beceriler
    const job1Skills = ['React', 'Node.js', 'JavaScript', 'HTML', 'CSS'];
    const job1SkillsData = await Promise.all(
        job1Skills.map(name => prisma.skill.findUnique({ where: { name } }))
    );

    for (const skill of job1SkillsData) {
        if (skill) {
            await prisma.jobSkill.create({
                data: {
                    jobId: job1.id,
                    skillId: skill.id,
                },
            });
        }
    }

    // İş ilanı 2 için beceriler
    const job2Skills = ['UI/UX', 'Figma', 'Photoshop'];
    const job2SkillsData = await Promise.all(
        job2Skills.map(name => prisma.skill.findUnique({ where: { name } }))
    );

    for (const skill of job2SkillsData) {
        if (skill) {
            await prisma.jobSkill.create({
                data: {
                    jobId: job2.id,
                    skillId: skill.id,
                },
            });
        }
    }

    // Örnek teklif oluştur
    console.log('Teklifler oluşturuluyor...');

    await prisma.proposal.create({
        data: {
            jobId: job1.id,
            freelancerId: freelancer1.id,
            bid: 14000,
            coverLetter: 'Merhaba, bu projede size yardımcı olmak isterim. 5 yıllık deneyimim ve benzer projeler üzerindeki geçmiş çalışmalarım sayesinde sizin için en iyi e-ticaret çözümünü sunabilirim.',
            deliveryTime: 25, // Gün cinsinden
            status: 'PENDING',
        },
    });

    console.log('✅ Örnek veriler başarıyla eklendi!');
}

main()
    .catch((e) => {
        console.error('Hata:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 