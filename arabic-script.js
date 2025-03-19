// مبدل السمات
const themeButtons = document.querySelectorAll('.theme-btn');
const body = document.body;

// تعيين السمة النشطة عند التحميل
document.addEventListener('DOMContentLoaded', () => {
    setupTheme();
    setupInteractions();
});

function setupTheme() {
    // الافتراضي إلى السمة-1 إذا لم يتم تخزين أي سمة
    const savedTheme = localStorage.getItem('selectedTheme') || 'theme-1';
    
    // تعيين فئة الجسم إلى السمة المختارة
    body.className = savedTheme;
    
    // تحديث الزر النشط
    themeButtons.forEach(button => {
        if (button.dataset.theme === savedTheme) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

function setupInteractions() {
    // أحداث نقر زر السمة
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedTheme = button.dataset.theme;
            
            // تحديث فئة الجسم
            body.className = selectedTheme;
            
            // الحفظ في التخزين المحلي
            localStorage.setItem('selectedTheme', selectedTheme);
            
            // تحديث الزر النشط
            themeButtons.forEach(btn => {
                if (btn === button) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            // تحديث تخطيط لسمات محددة تحتاج إلى تعديلات إضافية
            handleThemeSpecificLayouts(selectedTheme);
        });
    });

    // تبديل التنقل المحمول
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileNavToggle && navLinks) {
        mobileNavToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // إغلاق قائمة المحمول عند النقر على رابط
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            });
        });
    }

    // زر العودة إلى الأعلى
    const backToTopButton = document.querySelector('.back-to-top');

    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
    }

    // التمرير السلس لروابط التنقل
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                // تعديل الإزاحة لسمات مختلفة وعناصر التحكم
                const themeSelector = document.querySelector('.top-controls');
                const themeHeight = themeSelector ? themeSelector.offsetHeight : 0;
                const navHeight = document.querySelector('nav') ? document.querySelector('nav').offsetHeight : 0;
                const offset = themeHeight + navHeight;
                
                window.scrollTo({
                    top: target.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // معالج إرسال النموذج
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // التحقق البسيط من صحة النموذج
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            if (name && email && subject && message) {
                // في تطبيق حقيقي، سترسل هذه البيانات إلى خادم
                const successMessage = 'شكرًا لرسالتك! سأعود إليك قريبًا.';
                
                alert(successMessage);
                contactForm.reset();
            } else {
                const errorMessage = 'يرجى ملء جميع الحقول.';
                
                alert(errorMessage);
            }
        });
    }

    // إضافة تحريك إلى عناصر الجدول الزمني - إذا كانت موجودة في السمة الحالية
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.timeline-item').forEach(item => {
        item.style.opacity = 0;
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(item);
    });

    // إضافة تحريك إلى أشرطة المهارات - إذا كانت موجودة في السمة الحالية
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBars = entry.target.querySelectorAll('.skill-progress');
                skillBars.forEach(bar => {
                    const width = bar.style.width;
                    bar.style.width = 0;
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                });
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.skill-category').forEach(category => {
        skillObserver.observe(category);
    });
}

// معالجة تعديلات التخطيط الخاصة بالسمة
function handleThemeSpecificLayouts(theme) {
    // للسمة 2 (تخطيط التنقل الجانبي)
    if (theme === 'theme-2') {
        // لف المحتوى الرئيسي في حاوية مرنة للتنقل الجانبي
        if (!document.querySelector('.main-content')) {
            const nav = document.querySelector('nav');
            const contentSections = document.querySelectorAll('section');
            
            // إنشاء غلاف للمحتوى
            const contentWrapper = document.createElement('div');
            contentWrapper.className = 'content-wrapper';
            
            // نقل جميع الأقسام إلى غلاف المحتوى
            contentSections.forEach(section => {
                contentWrapper.appendChild(section);
            });
            
            // إنشاء حاوية المحتوى الرئيسي
            const mainContent = document.createElement('div');
            mainContent.className = 'main-content';
            
            // إدراج التنقل وغلاف المحتوى في المحتوى الرئيسي
            const navParent = nav.parentNode;
            navParent.insertBefore(mainContent, nav);
            mainContent.appendChild(nav);
            mainContent.appendChild(contentWrapper);
        }
    }
    
    // للسمة 4 (بطاقات التصميم المادي)
    if (theme === 'theme-4') {
        // إضافة بنية بطاقة التصميم المادي إلى عناصر الجدول الزمني
        document.querySelectorAll('.timeline-content').forEach(item => {
            if (!item.querySelector('.timeline-header')) {
                const title = item.querySelector('.timeline-title');
                const date = item.querySelector('.timeline-date');
                const location = item.querySelector('.timeline-location');
                const content = item.querySelector('p');
                
                // إنشاء رأس وجسم
                const header = document.createElement('div');
                header.className = 'timeline-header';
                
                const body = document.createElement('div');
                body.className = 'timeline-body';
                
                // نقل العناصر إلى الرأس والجسم
                if (title) header.appendChild(title.cloneNode(true));
                if (date) header.appendChild(date.cloneNode(true));
                if (location) body.appendChild(location.cloneNode(true));
                if (content) body.appendChild(content.cloneNode(true));
                
                // مسح المحتوى الأصلي
                item.innerHTML = '';
                
                // إضافة بنية جديدة
                item.appendChild(header);
                item.appendChild(body);
            }
        });
    }
    
    // للسمة 9 (تخطيط جدار حديث)
    if (theme === 'theme-9') {
        // إذا لم يكن عنصر main موجودًا، قم بإنشائه لتغليف جميع الأقسام
        if (!document.querySelector('main')) {
            const sections = document.querySelectorAll('section');
            const mainElement = document.createElement('main');
            
            // الحصول على والد القسم الأول
            const firstSectionParent = sections[0].parentNode;
            
            // إدراج عنصر main قبل القسم الأول
            firstSectionParent.insertBefore(mainElement, sections[0]);
            
            // نقل جميع الأقسام إلى main
            sections.forEach(section => {
                mainElement.appendChild(section);
            });
        }
    }
    
    // إعادة تعيين البنية الافتراضية عند التبديل بعيدًا عن السمات الخاصة
    if (theme !== 'theme-2') {
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            const parent = mainContent.parentNode;
            const nav = mainContent.querySelector('nav');
            const contentWrapper = mainContent.querySelector('.content-wrapper');
            
            if (nav && contentWrapper) {
                // نقل التنقل إلى الموضع الأصلي
                parent.insertBefore(nav, mainContent);
                
                // نقل جميع الأقسام إلى الموضع الأصلي
                const sections = contentWrapper.querySelectorAll('section');
                sections.forEach(section => {
                    parent.insertBefore(section, mainContent);
                });
                
                // إزالة عناصر الغلاف
                parent.removeChild(mainContent);
            }
        }
    }
    
    if (theme !== 'theme-9') {
        // تحقق مما إذا كان main موجودًا ويحتوي على أقسام
        const mainElement = document.querySelector('main');
        if (mainElement && mainElement.querySelectorAll('section').length > 0) {
            const parent = mainElement.parentNode;
            
            // نقل جميع الأقسام إلى الموضع الأصلي
            const sections = mainElement.querySelectorAll('section');
            sections.forEach(section => {
                parent.insertBefore(section, mainElement);
            });
            
            // إزالة عنصر main
            parent.removeChild(mainElement);
        }
    }
}
