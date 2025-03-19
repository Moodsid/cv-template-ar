// مبدل النمط
const themeButtons = document.querySelectorAll(".theme-btn");
const body = document.body;
const themeToggleBtn = document.getElementById("themeToggleBtn");
const themeSelector = document.getElementById("themeSelector");

// تعيين النمط النشط عند التحميل
document.addEventListener("DOMContentLoaded", () => {
  setupTheme();
  setupInteractions();
  setupThemeToggle();
});

function setupTheme() {
  // الافتراضي إلى theme-1 إذا لم يتم تخزين نمط
  const savedTheme = localStorage.getItem("selectedTheme") || "theme-1";
  body.className = savedTheme;

  // تحديث الزر النشط
  themeButtons.forEach((button) => {
    if (button.dataset.theme === savedTheme) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
}

function setupThemeToggle() {
  // تبديل ظهور مختار النمط
  themeToggleBtn.addEventListener("click", function () {
    themeSelector.classList.toggle("active");

    // تغيير الأيقونة بناءً على الظهور
    const icon = themeToggleBtn.querySelector("i");
    if (themeSelector.classList.contains("active")) {
      icon.className = "fas fa-times";
    } else {
      icon.className = "fas fa-palette";
    }
  });

  // إغلاق محدد النمط عند اختيار نمط
  themeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      themeSelector.classList.remove("active");
      themeToggleBtn.querySelector("i").className = "fas fa-palette";
    });
  });
}

function setupInteractions() {
  // أحداث نقر زر النمط
  themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedTheme = button.dataset.theme;

      // تحديث فئة الجسم
      body.className = selectedTheme;

      // الحفظ في localStorage
      localStorage.setItem("selectedTheme", selectedTheme);

      // تحديث الزر النشط
      themeButtons.forEach((btn) => {
        if (btn === button) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });

      // تحديث التخطيط لأنماط محددة تحتاج إلى تعديلات إضافية
      handleThemeSpecificLayouts(selectedTheme);
    });
  });

  // تبديل التنقل للجوال
  const mobileNavToggle = document.querySelector(".mobile-nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (mobileNavToggle && navLinks) {
    mobileNavToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });

    // إغلاق قائمة الجوال عند النقر على رابط
    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        if (navLinks.classList.contains("active")) {
          navLinks.classList.remove("active");
        }
      });
    });
  }

  // زر العودة إلى الأعلى
  const backToTopButton = document.querySelector(".back-to-top");

  if (backToTopButton) {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add("visible");
      } else {
        backToTopButton.classList.remove("visible");
      }
    });
  }

  // التمرير السلس لروابط التنقل
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));

      if (target) {
        // إزاحة معدلة لأنماط مختلفة
        const themeSelector = document.querySelector(".theme-selector");
        const themeHeight = themeSelector ? themeSelector.offsetHeight : 0;
        const navHeight = document.querySelector("nav")
          ? document.querySelector("nav").offsetHeight
          : 0;
        const offset = themeHeight + navHeight;

        window.scrollTo({
          top: target.offsetTop - offset,
          behavior: "smooth",
        });
      }
    });
  });

  // إضافة حركة لعناصر الجدول الزمني - إذا كانت موجودة في النمط الحالي
  const observerOptions = {
    threshold: 0.5,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  document.querySelectorAll(".timeline-item").forEach((item) => {
    item.style.opacity = 0;
    item.style.transform = "translateY(20px)";
    item.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    observer.observe(item);
  });

  // إضافة حركة لأشرطة المهارات - إذا كانت موجودة في النمط الحالي
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const skillBars = entry.target.querySelectorAll(".skill-progress");
          skillBars.forEach((bar) => {
            const width = bar.style.width;
            bar.style.width = 0;
            setTimeout(() => {
              bar.style.width = width;
            }, 100);
          });
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll(".skill-category").forEach((category) => {
    skillObserver.observe(category);
  });
}

// التعامل مع تعديلات التخطيط الخاصة بالنمط
function handleThemeSpecificLayouts(theme) {
  // للنمط 2 (تخطيط التنقل الجانبي)
  if (theme === "theme-2") {
    // لف المحتوى الرئيسي في حاوية مرنة للتنقل الجانبي
    if (!document.querySelector(".main-content")) {
      const nav = document.querySelector("nav");
      const contentSections = document.querySelectorAll("section");

      // إنشاء غلاف للمحتوى
      const contentWrapper = document.createElement("div");
      contentWrapper.className = "content-wrapper";

      // نقل جميع الأقسام إلى غلاف المحتوى
      contentSections.forEach((section) => {
        contentWrapper.appendChild(section);
      });

      // إنشاء حاوية المحتوى الرئيسي
      const mainContent = document.createElement("div");
      mainContent.className = "main-content";

      // إدراج التنقل وغلاف المحتوى في المحتوى الرئيسي
      const navParent = nav.parentNode;
      navParent.insertBefore(mainContent, nav);
      mainContent.appendChild(nav);
      mainContent.appendChild(contentWrapper);
    }
  }

  // للنمط 4 (بطاقات التصميم المادي)
  if (theme === "theme-4") {
    // إضافة هيكل بطاقة التصميم المادي لعناصر الجدول الزمني
    document.querySelectorAll(".timeline-content").forEach((item) => {
      if (!item.querySelector(".timeline-header")) {
        const title = item.querySelector(".timeline-title");
        const date = item.querySelector(".timeline-date");
        const location = item.querySelector(".timeline-location");
        const content = item.querySelector("p");

        // إنشاء الرأس والجسم
        const header = document.createElement("div");
        header.className = "timeline-header";

        const body = document.createElement("div");
        body.className = "timeline-body";

        // نقل العناصر إلى الرأس والجسم
        if (title) header.appendChild(title.cloneNode(true));
        if (date) header.appendChild(date.cloneNode(true));
        if (location) body.appendChild(location.cloneNode(true));
        if (content) body.appendChild(content.cloneNode(true));

        // مسح المحتوى الأصلي
        item.innerHTML = "";

        // إضافة الهيكل الجديد
        item.appendChild(header);
        item.appendChild(body);
      }
    });
  }

  // إعادة تعيين إلى الهيكل الافتراضي عند التبديل من الأنماط الخاصة
  if (theme !== "theme-2") {
    const mainContent = document.querySelector(".main-content");
    if (mainContent) {
      const parent = mainContent.parentNode;
      const nav = mainContent.querySelector("nav");
      const contentWrapper = mainContent.querySelector(".content-wrapper");

      if (nav && contentWrapper) {
        // نقل التنقل مرة أخرى إلى الموضع الأصلي
        parent.insertBefore(nav, mainContent);

        // نقل جميع الأقسام مرة أخرى إلى الموضع الأصلي
        const sections = contentWrapper.querySelectorAll("section");
        sections.forEach((section) => {
          parent.insertBefore(section, mainContent);
        });

        // إزالة عناصر الغلاف
        parent.removeChild(mainContent);
      }
    }
  }
}
