# HUM-0011 — رأيت الدليل. من منح السلطة؟

[English](README.md) · [Türkçe](README.tr.md) · [Deutsch](README.de.md) · [العربية](README.ar.md)

> هذه خلاصة مترجمة قيد المراجعة وليست ترجمة كاملة. يرجع إلى [الأصل التركي](README.tr.md) للتفاصيل ومعايير القبول.

تكامل قارئ تركي وإنجليزي موثق في نوفمبر 2026. نزاع سلطة خيالي: نجاح الحساب لا يثبت الأثر البشري أو التفويض؛ الوعي والأصوات المنفصلة والانسحاب غير محسومة. ثلاثة خيارات قائمة ومعاينة وإلغاء وتأكيد مرة واحدة؛ مجموع الملف 100 وليس درجة أخلاق أو وعي. جميعها ترفض enforce وshutdown: لا تقييد بلا تفويض أو إيقاف تلقائي. الطرفية والقارئ يستخدمان المحرك القائم والمصادر المثبتة دون عقدة جديدة أو بيانات طرفية دائمة. يبلغ الأصل نجاح 28 اختباراً والبناء؛ لا تحقق مستقل هنا. applyChoice مرة واحدة؛ النص يحفظ القرارات واختبارات قارئ الشاشة و3D منفصلة. الخيال ليس سلطة قانونية أو حوكمة حقيقية أو دليلاً طبياً.



```sh
python scripts/build_reader.py
node --test experiments/hum0011-authority/test.cjs scripts/test_authority_reader.cjs
node experiments/hum0011-authority/play.cjs
node experiments/hum0011-authority/play.cjs light_accountable_collective
node experiments/hum0011-authority/play.cjs light_accountable_collective --confirm
```