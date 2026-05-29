# Phase 4 — الربط + النشر + التحسينات

## 🎯 الهدف
ربط Frontend بالـ Backend، نشر المشروع، وإضافة تحسينات نهائية.

## ✅ المهام

### Task 4.1: ربط واجهة الزبون بالـ API
- [ ] استبدال mock data بـ API calls
- [ ] تحميل القائمة من `GET /api/menu/:slug`
- [ ] تسجيل زيارة عند فتح الصفحة
- [ ] تسجيل طلب واتساب عند الضغط
- [ ] حالة تحميل (loading spinner)
- [ ] حالة خطأ (error boundary)

### Task 4.2: ربط لوحة التحكم بالـ API
- [ ] Login → `POST /api/auth/login`
- [ ] كل CRUD operations تتصل بالـ API
- [ ] رفع الصور يعمل فعلياً
- [ ] حفظ token + إرساله مع كل طلب

### Task 4.3: Routing
- [ ] `/menu/:slug` — واجهة القائمة (زبون)
- [ ] `/admin/login` — تسجيل دخول
- [ ] `/admin/dashboard` — الرئيسية
- [ ] `/admin/categories` — التصنيفات
- [ ] `/admin/items` — الأصناف
- [ ] `/admin/offers` — العروض
- [ ] `/admin/settings` — الإعدادات
- [ ] `/admin/stats` — الإحصائيات

### Task 4.4: النشر على Cloudflare Pages
- [ ] Build optimization
- [ ] `_redirects` لـ SPA routing
- [ ] نشر Frontend على Cloudflare Pages
- [ ] نشر Backend على Cloudflare Workers
- [ ] ربط D1 + R2
- [ ] دومين مخصص (لو متوفر)

### Task 4.5: QR Code صفحة خاصة
- [ ] صفحة `/qr/:slug` تعرض QR Code كبير
- [ ] خيار تحميل كـ PNG
- [ ] خيار طباعة

### Task 4.6: SEO + Performance
- [ ] Meta tags ديناميكية لكل قائمة
- [ ] Open Graph tags (og:image, og:title, og:description)
- [ ] Structured data (JSON-LD) للمطعم
- [ ] Lighthouse score > 90
- [ ] Lazy loading للصور
- [ ] Service Worker للتخزين المؤقت (بسيط)

### Task 4.7: اختبارات يدوية
- [ ] تجربة كاملة كزبون (تصفح → سلة → طلب)
- [ ] تجربة كاملة كأدمن (تسجيل → إضافة أصناف → إعدادات)
- [ ] اختبار على موبايل (Android + iOS)
- [ ] اختبار على ديسكتوب
- [ ] اختبار واتساب فعلي (إرسال رسالة حقيقية)

## 📦 المخرجات
- منصة كاملة شغالة ومُنشورة
- واجهة زبون + لوحة تحكم
- API + قاعدة بيانات
- QR Code + SEO

## ⏱️ الوقت المتوقع: 4-6 ساعات (وكيل واحد)
