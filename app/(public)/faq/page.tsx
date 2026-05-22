"use client";

import * as React from "react";
import { Search } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Body, H1, Mono } from "@/components/ui/typography";
import { PineDivider } from "@/components/decorative/PineDivider";
import { useLanguage, useT } from "@/lib/i18n/LanguageProvider";

interface QA {
  q: string;
  a: string;
}
type Bundle = { categories: string[]; data: Record<string, QA[]>; empty: string };

const FR: Bundle = {
  empty:
    "Aucune question ne correspond. Essayez d'autres mots-clés ou écrivez-nous via le formulaire de contact.",
  categories: ["Commandes", "Livraison", "Paiement", "Retours", "Compte"],
  data: {
    Commandes: [
      {
        q: "Comment passer commande ?",
        a: "Ajoutez vos articles au panier, cliquez sur « Passer commande » et remplissez vos coordonnées. Vous recevrez un appel de confirmation sous 24h, puis votre commande est expédiée via ZR Express.",
      },
      {
        q: "Puis-je modifier ma commande après confirmation ?",
        a: "Tant que la commande n'est pas expédiée, contactez-nous par téléphone ou WhatsApp et nous ajustons quantités, adresse ou variantes.",
      },
      {
        q: "Comment annuler ma commande ?",
        a: "Avant expédition, annulation gratuite par téléphone ou WhatsApp. Après expédition, refusez le colis lors de la livraison — aucun frais ne vous sera facturé.",
      },
      {
        q: "Je n'ai pas reçu d'appel de confirmation, que faire ?",
        a: "Nous appelons sous 24h ouvrées. Vérifiez votre numéro et la connexion. Si rien après 48h, écrivez-nous à contact@bingo.dz avec votre numéro de commande.",
      },
    ],
    Livraison: [
      {
        q: "Quels sont les délais de livraison ?",
        a: "ZR Express livre en 2 jours dans le Nord (Alger, Sétif, Oran…), 3 jours pour les wilayas de l'Est et de l'Ouest, et 4-5 jours pour le Sud. Le délai indiqué au checkout tient compte de votre wilaya.",
      },
      {
        q: "Combien coûtent les frais de livraison ?",
        a: "De 400 DZD (Alger) à 1200 DZD (wilayas du Sud). Le tarif exact est affiché dès que vous sélectionnez votre wilaya sur le panier.",
      },
      {
        q: "Livrez-vous dans tout le pays ?",
        a: "Oui, les 58 wilayas. ZR Express dispose de relais et de livraisons à domicile partout en Algérie.",
      },
      {
        q: "Puis-je suivre mon colis ?",
        a: "Après expédition, vous recevez un numéro de suivi ZR Express. Vous pouvez aussi suivre depuis votre espace client (Mes commandes).",
      },
    ],
    Paiement: [
      {
        q: "Quels modes de paiement acceptez-vous ?",
        a: "Pour l'instant, uniquement le paiement à la livraison (cash). Vous payez le livreur en main propre lors de la réception. D'autres modes (carte, virement) arriveront prochainement.",
      },
      {
        q: "Le paiement à la livraison a-t-il un coût supplémentaire ?",
        a: "Non, aucun frais supplémentaire. Vous payez le montant exact affiché au checkout.",
      },
      {
        q: "Puis-je payer par avance ?",
        a: "Pas encore, mais nous travaillons à l'intégration de paiements en ligne sécurisés (carte EDahabia, CIB, BaridiMob).",
      },
    ],
    Retours: [
      {
        q: "Quel est le délai de retour ?",
        a: "Vous disposez de 14 jours après réception pour retourner un produit non utilisé, dans son emballage d'origine.",
      },
      {
        q: "Comment effectuer un retour ?",
        a: "Contactez-nous via WhatsApp ou email avec votre numéro de commande. Nous organisons un retour ZR Express et procédons au remboursement dès réception.",
      },
      {
        q: "Le retour est-il gratuit ?",
        a: "Pour les produits défectueux à l'arrivée, oui — nous prenons en charge les frais de retour. Pour un retour libre, les frais ZR Express sont à votre charge.",
      },
      {
        q: "Quels produits ne peuvent pas être retournés ?",
        a: "Sous-vêtements techniques, gourdes utilisées, produits d'hygiène ouverts. Les produits soldés à plus de -50% sont remboursés sous forme d'avoir.",
      },
    ],
    Compte: [
      {
        q: "Faut-il créer un compte pour commander ?",
        a: "Non, vous pouvez commander en tant qu'invité. Créer un compte vous permet de suivre vos commandes, gérer vos adresses et sauvegarder vos favoris.",
      },
      {
        q: "Comment réinitialiser mon mot de passe ?",
        a: "Cliquez sur « Mot de passe oublié » depuis la page de connexion. Vous recevrez un lien de réinitialisation par email.",
      },
      {
        q: "Mes données sont-elles sécurisées ?",
        a: "Oui, nous ne partageons jamais vos informations avec des tiers en dehors de ZR Express (pour la livraison). Voir notre politique de confidentialité.",
      },
    ],
  },
};

const AR: Bundle = {
  empty:
    "لا توجد أسئلة مطابقة. جرّب كلمات مفتاحية أخرى أو راسلنا عبر نموذج التواصل.",
  categories: ["الطلبيات", "التوصيل", "الدفع", "الإرجاع", "الحساب"],
  data: {
    الطلبيات: [
      {
        q: "كيف أمرّر طلبية ؟",
        a: "أضف المنتجات إلى السلة، اضغط على « إتمام الطلب » واملأ بياناتك. ستتلقى مكالمة تأكيد خلال 24 ساعة، ثم تُشحَن الطلبية عبر ZR Express.",
      },
      {
        q: "هل يمكنني تعديل طلبيتي بعد التأكيد ؟",
        a: "ما دامت الطلبية لم تُشحَن، اتّصل بنا عبر الهاتف أو واتساب وسنقوم بتعديل الكمّيات أو العنوان أو الإصدارات.",
      },
      {
        q: "كيف أُلغي طلبيتي ؟",
        a: "قبل الشحن، الإلغاء مجاني عبر الهاتف أو واتساب. بعد الشحن، ارفض الطرد عند التوصيل — لن تُحاسَب على أي رسوم.",
      },
      {
        q: "لم أتلقَّ مكالمة تأكيد، ماذا أفعل ؟",
        a: "نتّصل خلال 24 ساعة عمل. تحقّق من رقمك ومن الشبكة. إن لم يصلك شيء بعد 48 ساعة، راسلنا على contact@bingo.dz مع رقم طلبيتك.",
      },
    ],
    التوصيل: [
      {
        q: "ما هي مهل التوصيل ؟",
        a: "تقوم ZR Express بالتوصيل في يومين للشمال (الجزائر، سطيف، وهران…)، 3 أيام لولايات الشرق والغرب، و 4-5 أيام للجنوب. تُعرَض المهلة في خطوة الدفع حسب ولايتك.",
      },
      {
        q: "كم تكلفة رسوم التوصيل ؟",
        a: "من 400 دج (الجزائر العاصمة) إلى 1200 دج (ولايات الجنوب). يُعرَض السعر بدقّة بمجرّد اختيارك للولاية في السلة.",
      },
      {
        q: "هل توصّلون إلى كل البلد ؟",
        a: "نعم، الـ 58 ولاية. تتوفّر ZR Express على نقاط استلام وتوصيل إلى المنزل في كل أنحاء الجزائر.",
      },
      {
        q: "هل يمكنني متابعة طردي ؟",
        a: "بعد الشحن، ستتلقى رقم متابعة من ZR Express. يمكنك أيضاً المتابعة من فضاء الزبون (طلباتي).",
      },
    ],
    الدفع: [
      {
        q: "ما هي طرق الدفع المقبولة ؟",
        a: "حالياً، الدفع عند الاستلام (نقداً) فقط. تدفع للموزّع مباشرةً عند التسلّم. طرق أخرى (بطاقة، تحويل) قريباً.",
      },
      {
        q: "هل للدفع عند الاستلام تكلفة إضافية ؟",
        a: "لا، بدون أي رسوم إضافية. تدفع المبلغ المعروض في خطوة الدفع بالضبط.",
      },
      {
        q: "هل يمكنني الدفع مسبقاً ؟",
        a: "ليس بعد، لكنّنا نعمل على دمج وسائل دفع آمنة عبر الإنترنت (بطاقة الذهبية، CIB، BaridiMob).",
      },
    ],
    الإرجاع: [
      {
        q: "ما هي مهلة الإرجاع ؟",
        a: "لديك 14 يوماً بعد الاستلام لإرجاع منتج غير مستعمل، في تغليفه الأصلي.",
      },
      {
        q: "كيف أقوم بالإرجاع ؟",
        a: "راسلنا عبر واتساب أو البريد الإلكتروني مع رقم طلبيتك. نتولّى تنظيم الإرجاع عبر ZR Express ونباشر الاسترداد بمجرّد الاستلام.",
      },
      {
        q: "هل الإرجاع مجاني ؟",
        a: "للمنتجات المعيبة عند الاستلام، نعم — نتكفّل برسوم الإرجاع. للإرجاع الاختياري، رسوم ZR Express على حسابك.",
      },
      {
        q: "ما المنتجات التي لا يمكن إرجاعها ؟",
        a: "الملابس الداخلية التقنية، القوارير المستعملة، منتجات النظافة المفتوحة. المنتجات المخفّضة بأكثر من -50% تُستردّ كرصيد.",
      },
    ],
    الحساب: [
      {
        q: "هل يجب إنشاء حساب لتمرير طلبية ؟",
        a: "لا، يمكنك الطلب كزائر. إنشاء حساب يتيح لك متابعة طلباتك وإدارة عناوينك وحفظ المفضلة.",
      },
      {
        q: "كيف أعيد تعيين كلمة المرور ؟",
        a: "اضغط على « نسيت كلمة المرور » من صفحة تسجيل الدخول. ستتلقى رابطاً لإعادة التعيين عبر البريد الإلكتروني.",
      },
      {
        q: "هل بياناتي آمنة ؟",
        a: "نعم، لا نشارك معلوماتك أبداً مع أي طرف ثالث باستثناء ZR Express (للتوصيل). راجع سياسة الخصوصية.",
      },
    ],
  },
};

export default function FaqPage() {
  const t = useT();
  const { locale } = useLanguage();
  const bundle = locale === "ar" ? AR : FR;

  const [query, setQuery] = React.useState("");
  const q = query.trim().toLowerCase();

  const filtered = React.useMemo(() => {
    if (!q) return bundle.data;
    const out: Record<string, QA[]> = {};
    for (const [cat, items] of Object.entries(bundle.data)) {
      const hits = items.filter(
        (it) =>
          it.q.toLowerCase().includes(q) ||
          it.a.toLowerCase().includes(q)
      );
      if (hits.length) out[cat] = hits;
    }
    return out;
  }, [q, bundle]);

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
      <header className="text-center">
        <Mono className="text-wood-600">{t("info.faq.eyebrow")}</Mono>
        <H1 className="mt-3">{t("info.faq.title")}</H1>
      </header>

      <div className="relative mx-auto mt-8 max-w-md">
        <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-wood-600" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("common.search")}
          className="h-11 ps-10"
        />
      </div>

      <PineDivider className="my-10" />

      {Object.keys(filtered).length === 0 ? (
        <Body className="text-center text-muted-foreground">
          {bundle.empty}
        </Body>
      ) : (
        <div className="space-y-8">
          {Object.entries(filtered).map(([cat, items]) => (
            <section key={cat}>
              <h2 className="font-display text-lg font-semibold text-ink">
                {cat}
              </h2>
              <Accordion className="mt-3 rounded-lg bg-parchment px-4">
                {items.map((it, i) => (
                  <AccordionItem key={i} value={`${cat}-${i}`}>
                    <AccordionTrigger className="text-start">
                      {it.q}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground">{it.a}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ))}
        </div>
      )}
    </article>
  );
}
