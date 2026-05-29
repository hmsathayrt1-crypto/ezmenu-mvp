-- بيانات تجريبية

-- مطعم
INSERT INTO restaurants (id, name, slug, whatsapp_number, description, logo_url) VALUES
('rest1', 'مطعم الذوق', 'al-thawq', '963999123456', 'مطعم يقدم أشهى المأكولات الشرقية والغربية', '');

-- مستخدم أدمن
INSERT INTO users (id, restaurant_id, email, password_hash, role) VALUES
('user1', 'rest1', 'admin@ezmenu.app', 'admin', 'admin');

-- تصنيفات
INSERT INTO categories (id, restaurant_id, name, icon, sort_order) VALUES
('cat1', 'rest1', 'بيتزا', '🍕', 1),
('cat2', 'rest1', 'برغر', '🍔', 2),
('cat3', 'rest1', 'سلطات', '🥗', 3),
('cat4', 'rest1', 'باستا', '🍝', 4),
('cat5', 'rest1', 'مشروبات', '🥤', 5),
('cat6', 'rest1', 'حلويات', '🍰', 6);

-- أصناف
INSERT INTO menu_items (id, restaurant_id, category_id, name, name_en, description, price_syp, price_usd, image_url, is_featured, sort_order) VALUES
('i1', 'rest1', 'cat1', 'مارغريتا سبيشيال', 'Margherita Special', 'بيتزا كلاسيكية مع جبنة موزاريلا وطماطم طازجة', 35000, 5.99, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', 1, 1),
('i2', 'rest1', 'cat1', 'بيتزا بيبروني', 'Pepperoni Pizza', 'شرائح بيبروني مع جبنة موزاريلا', 40000, 6.99, 'https://images.unsplash.com/photo-1628840042765-356208da3652?w=400', 0, 2),
('i3', 'rest1', 'cat1', 'بيتزا خضار', 'Veggie Pizza', 'خضروات طازجة مع الجبن', 30000, 4.99, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', 0, 3),
('i4', 'rest1', 'cat2', 'برغر الشيف', 'Chef Burger', 'برغر أنغوس مع جبنة شيدر وصلصة خاصة', 48000, 7.99, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', 1, 1),
('i5', 'rest1', 'cat2', 'برغر دجاج مقرمش', 'Crispy Chicken Burger', 'دجاج مقرمش مع مايونيز وخس', 38000, 6.49, 'https://images.unsplash.com/photo-1606755962773-d329e0a8f870?w=400', 0, 2),
('i6', 'rest1', 'cat3', 'سلطة قيصر', 'Caesar Salad', 'خس روماني مع صلصة قيصر وبارميزان', 22000, 3.99, 'https://images.unsplash.com/photo-1546793665-c74683f337c5?w=400', 1, 1),
('i7', 'rest1', 'cat3', 'سلطة يونانية', 'Greek Salad', 'طماطم وخيار وزيتون مع فيتا', 18000, 3.49, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400', 0, 2),
('i8', 'rest1', 'cat4', 'سباغيتي كاربونارا', 'Spaghetti Carbonara', 'صلصة كريمة وبانشيتا وبارميزان', 35000, 5.99, 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400', 0, 1),
('i9', 'rest1', 'cat4', 'باستا ألفريدو', 'Pasta Alfredo', 'صلصة كريمة غنية مع الدجاج', 32000, 5.49, 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400', 0, 2),
('i10', 'rest1', 'cat5', 'عصير برتقال طازج', 'Fresh Orange Juice', 'عصير برتقال طبيعي 100%', 10000, 1.99, 'https://images.unsplash.com/photo-1621506289939-18f5f21c5896?w=400', 0, 1),
('i11', 'rest1', 'cat5', 'ميلك شيك شوكولاتة', 'Chocolate Milkshake', 'ميلك شيك كريمي بنكهة الشوكولاتة', 15000, 2.99, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400', 1, 2),
('i12', 'rest1', 'cat6', 'تيرايميسو', 'Tiramisu', 'حلوى إيطالية مع قهوة وماسكاربوني', 25000, 4.49, 'https://images.unsplash.com/photo-1571877227200-a0d98ea60705?w=400', 1, 1),
('i13', 'rest1', 'cat6', 'تشيز كيك توت', 'Berry Cheesecake', 'تشيز كيك كريمي مع صلصة التوت', 20000, 3.99, 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400', 0, 2);

-- إضافات
INSERT INTO addons (id, restaurant_id, name, price_syp, price_usd) VALUES
('add1', 'rest1', 'جبنة إضافية', 5000, 1),
('add2', 'rest1', 'فطر', 4000, 0.8),
('add3', 'rest1', 'بطاطس مقلية', 8000, 1.5),
('add4', 'rest1', 'مشروب كولا', 3000, 0.5);

-- ربط إضافات بأصناف
INSERT INTO item_addons (item_id, addon_id) VALUES
('i1', 'add1'), ('i1', 'add2'),
('i4', 'add3'), ('i4', 'add4');

-- عرض خاص
INSERT INTO offers (id, restaurant_id, title, description, discount_percent, start_date, end_date) VALUES
('off1', 'rest1', 'عرض البيتزا المزدوجة', 'اطلب بيتزا واحصل على الثانية بنصف السعر', 50, '2026-05-01', '2026-06-30');

INSERT INTO offer_items (offer_id, item_id) VALUES ('off1', 'i1'), ('off1', 'i2'), ('off1', 'i3');
