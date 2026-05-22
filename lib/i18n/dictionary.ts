/**
 * Storefront translation dictionary.
 *
 * Two locales: `fr` (default) and `ar` (RTL). Keys are short, semantic
 * strings used by `useT()`. Add new entries here as more surfaces get
 * translated.
 */

export type Locale = "fr" | "ar";

export const DEFAULT_LOCALE: Locale = "fr";

export type TranslationKey = keyof typeof dictionary.fr;

const dictionary = {
  fr: {
    // Common
    "common.continueShopping": "Continuer mes achats",
    "common.viewAll": "Tout voir",
    "common.viewCatalog": "Voir le catalogue",
    "common.discover": "Découvrir",
    "common.search": "Rechercher",

    // Header / nav
    "nav.home": "Accueil",
    "nav.catalog": "Catalogue",
    "nav.promotions": "Promotions",
    "nav.myCart": "Mon panier",
    "nav.about": "À propos",
    "nav.contact": "Contact",

    // Top categories strip
    "cat.tentes-abris": "Tentes & Abris",
    "cat.sacs-de-couchage": "Sacs de couchage",
    "cat.cuisine-outdoor": "Cuisine outdoor",
    "cat.eclairage": "Éclairage",
    "cat.sacs-a-dos": "Sacs à dos",
    "cat.vetements": "Vêtements",
    "cat.chaussures": "Chaussures",
    "cat.accessoires": "Accessoires",

    // Trust band (homepage)
    "trust.aria": "Engagements BINGO",
    "trust.delivery.label": "Livraison 48-72h",
    "trust.delivery.detail": "Partout en Algérie via ZR Express",
    "trust.payment.label": "Paiement à la livraison",
    "trust.payment.detail": "Cash, sans frais supplémentaires",
    "trust.guarantee.label": "Garantie 30 jours",
    "trust.guarantee.detail": "Échange ou remboursement",
    "trust.support.label": "Support 7j/7",
    "trust.support.detail": "Conseil par téléphone et WhatsApp",
    "nav.account": "Compte",
    "nav.favorites": "Favoris",
    "favorites.eyebrow": "Votre sélection",
    "favorites.title": "Mes favoris",
    "favorites.emptyShort": "Aucun favori pour le moment.",
    "favorites.countOne": "produit sauvegardé",
    "favorites.countMany": "produits sauvegardés",
    "favorites.loading": "Chargement…",
    "favorites.empty.title": "Vous n'avez aucun favori pour le moment",
    "favorites.empty.lead":
      "Cliquez sur le cœur depuis une fiche produit pour le retrouver ici.",
    "favorites.empty.cta": "Découvrir le catalogue",
    "notFound.eyebrow": "Erreur 404",
    "notFound.title": "Perdu dans la forêt ?",
    "notFound.lead":
      "La page que vous cherchez n'existe plus, ou n'a jamais existé. Reprenons le chemin depuis le début.",
    "notFound.home": "Retour à l'accueil",
    "notFound.catalog": "Voir le catalogue",
    "error.eyebrow": "Erreur inattendue",
    "error.title": "Quelque chose s'est mal passé",
    "error.lead":
      "Nous avons enregistré le problème. Réessayez dans quelques secondes — si l'erreur persiste, contactez notre support.",
    "error.reference": "Référence",
    "error.retry": "Réessayer",
    "error.contact": "Contacter le support",
    "nav.login": "Connexion",
    "nav.register": "Créer un compte",
    "nav.logout": "Déconnexion",
    "header.searchPlaceholder": "Rechercher…",
    "header.openMenu": "Ouvrir le menu",
    "header.cart": "Panier",
    "header.favorites": "Favoris",
    "header.userMenu": "Mon compte",
    "header.signedInAs": "Connecté en tant que",
    "header.adminPanel": "Tableau de bord admin",
    "header.myOrders": "Mes commandes",
    "header.profile": "Profil",
    "header.signIn": "Se connecter",

    // Cart drawer
    "cart.title": "Panier",
    "cart.empty": "Votre panier est vide",
    "cart.emptyHint": "Ajoutez quelques produits pour les retrouver ici.",
    "cart.subtotal": "Sous-total",
    "cart.shippingHint": "Frais de livraison calculés à l'étape suivante.",
    "cart.checkout": "Passer commande",
    "cart.viewFullCart": "Voir le panier complet",
    "cart.discover": "Découvrir le catalogue",
    "cart.eyebrow": "Votre sélection",
    "cart.eachUnit": "l'unité",
    "cart.removed": "Article retiré du panier",
    "cart.removeAriaPrefix": "Retirer",
    "cart.articles_one": "article",
    "cart.articles_other": "articles",
    "cart.summary": "Récapitulatif",
    "cart.shippingLabel": "Frais de livraison",
    "cart.shippingCalculatedLater": "calculés à l'étape suivante",
    "cart.total": "Total",
    "cart.continueShopping": "← Continuer mes achats",
    "cart.emptyTitle": "Votre panier est vide",
    "cart.emptyLead":
      "Découvrez notre sélection — tentes, sacs de couchage, vêtements techniques et bien d'autres.",
    "cart.discoverProducts": "Découvrir nos produits",
    "cart.trust.cod": "Paiement à la livraison",
    "cart.trust.shipping": "ZR Express",
    "cart.trust.guarantee": "Garantie 30j",
    "cart.promoCode": "Code promo",
    "cart.promoCodePlaceholder": "Saisir le code",
    "cart.applyPromo": "Appliquer",
    "cart.promoComingSoon": "Les codes promo arriveront prochainement.",
    "cart.updatedAtOpen": "Mis à jour à l'ouverture",

    // Product card
    "product.order": "Commander",
    "product.skuLabel": "SKU",
    "product.addToCart": "Ajouter au panier",
    "product.outOfStock": "Indisponible",
    "product.new": "Nouveau",
    "product.bestSeller": "Best seller",

    // Product detail page
    "product.reviewsLabel": "avis",
    "product.share": "Partager :",
    "product.share.fb": "Partager sur Facebook",
    "product.share.wa": "Partager sur WhatsApp",
    "product.share.copy": "Copier le lien",
    "product.delivery.title": "Livraison ZR Express dans toute l'Algérie",
    "product.delivery.lead":
      "Délai 48-72h selon la wilaya, frais affichés au checkout.",
    "product.payment.title": "Paiement à la livraison disponible",
    "product.payment.lead": "Cash, sans frais supplémentaires.",
    "product.relatedTitle": "Produits similaires",
    "product.alsoBoughtTitle": "Les clients ont aussi acheté",
    "product.notFound": "Produit introuvable",

    // Stock states
    "stock.expedited": "Expédié sous 48h après confirmation.",
    "stock.lowPrefix": "Plus que",
    "stock.lowSuffix": "en stock — commandez vite.",
    "stock.outOfStock":
      "Indisponible — recevez une alerte au retour en stock.",
    "stock.badge.in": "En stock",
    "stock.badge.low": "Stock faible",
    "stock.badge.out": "Rupture",

    // AddToCartPanel
    "atc.addedToast": "ajouté au panier",
    "atc.variant": "Variante",
    "atc.quantity": "Quantité",
    "atc.qtyDecrease": "Diminuer la quantité",
    "atc.qtyIncrease": "Augmenter la quantité",
    "atc.favAddedToast": "Ajouté aux favoris",
    "atc.favRemovedToast": "Retiré des favoris",
    "atc.favOff": "Ajouter aux favoris",
    "atc.favOn": "Dans vos favoris",

    // QuickOrderForm
    "quickOrder.eyebrow": "Commande rapide",
    "quickOrder.title": "Commandez sans créer de compte",
    "quickOrder.lead":
      "Paiement à la livraison · Livraison ZR Express dans toute l'Algérie.",
    "quickOrder.fields.firstName": "Prénom",
    "quickOrder.fields.firstNamePh": "ex : Yacine",
    "quickOrder.fields.lastName": "Nom",
    "quickOrder.fields.lastNamePh": "ex : Benali",
    "quickOrder.fields.phone": "Téléphone",
    "quickOrder.fields.phonePh": "0554748287",
    "quickOrder.fields.wilaya": "Wilaya",
    "quickOrder.fields.wilayaPlaceholder": "Sélectionner une wilaya",
    "quickOrder.fields.commune": "Commune",
    "quickOrder.fields.communePh": "ex : Sétif, Aïn Arnat…",
    "quickOrder.summary.subtotal": "Sous-total",
    "quickOrder.summary.shipping": "Livraison",
    "quickOrder.summary.total": "Total",
    "quickOrder.cta": "Commander maintenant",
    "quickOrder.cta.sending": "Envoi…",
    "quickOrder.cta.unavailable": "Indisponible",
    "quickOrder.toast.sent": "Commande envoyée",
    "quickOrder.toast.sentDesc": "Nous vous rappelons rapidement.",
    "quickOrder.toast.error": "Erreur lors de la commande",
    "quickOrder.toast.errorDesc": "Veuillez réessayer.",
    "quickOrder.errors.firstNameTooShort": "Prénom trop court",
    "quickOrder.errors.lastNameTooShort": "Nom trop court",
    "quickOrder.errors.phoneInvalid":
      "10 chiffres, commençant par 05, 06 ou 07 (ex : 0554748287)",
    "quickOrder.errors.wilayaRequired": "Sélectionnez votre wilaya",
    "quickOrder.errors.communeRequired": "Commune requise",
    "form.optional": "facultatif",

    // Checkout
    "checkout.breadcrumb": "Commande",
    "checkout.eyebrow": "Finaliser",
    "checkout.title": "Votre commande",
    "checkout.sec.contact.title": "1. Coordonnées",
    "checkout.sec.contact.subtitle":
      "Nous vous appelons pour confirmer la commande.",
    "checkout.sec.address.title": "2. Adresse de livraison",
    "checkout.sec.address.subtitle":
      "Tous les wilayas sont desservis par ZR Express.",
    "checkout.sec.payment.title": "3. Mode de paiement",
    "checkout.sec.payment.subtitle":
      "D'autres modes arriveront prochainement.",
    "checkout.field.firstName": "Prénom",
    "checkout.field.lastName": "Nom",
    "checkout.field.phone": "Téléphone",
    "checkout.field.email": "Email",
    "checkout.field.wilaya": "Wilaya",
    "checkout.field.wilayaPlaceholder": "Sélectionner une wilaya",
    "checkout.field.commune": "Commune",
    "checkout.field.address": "Adresse précise",
    "checkout.field.addressPlaceholder": "Rue, numéro, bâtiment, étage…",
    "checkout.field.notes": "Notes pour le livreur",
    "checkout.field.notesPlaceholder":
      "Sonner deux fois, contacter au 06…, etc.",
    "checkout.payment.codTitle": "Paiement à la livraison (cash)",
    "checkout.payment.codLead":
      "Vous paierez le montant total au livreur lors de la réception de votre commande.",
    "checkout.cgv.before": "J'accepte les",
    "checkout.cgv.linkLabel": "conditions générales de vente",
    "checkout.cgv.after": "de BINGO.",
    "checkout.submit": "Confirmer la commande",
    "checkout.submitting": "Envoi en cours…",
    "checkout.summary.title": "Votre commande",
    "checkout.summary.subtotal": "Sous-total",
    "checkout.summary.shipping": "Livraison",
    "checkout.summary.total": "Total",
    "checkout.summary.viaZR": "Livraison via ZR Express vers",
    "checkout.summary.pickWilaya":
      "Sélectionnez votre wilaya pour voir les frais de livraison.",
    "checkout.errors.firstNameTooShort": "Prénom trop court",
    "checkout.errors.lastNameTooShort": "Nom trop court",
    "checkout.errors.phoneInvalid":
      "Format attendu : +213 5/6/7XX XXX XXX",
    "checkout.errors.emailInvalid": "Email invalide",
    "checkout.errors.wilayaRequired": "Sélectionnez votre wilaya",
    "checkout.errors.communeRequired": "Commune requise",
    "checkout.errors.addressTooShort": "Adresse trop courte",
    "checkout.errors.cgvRequired": "Vous devez accepter les CGV",
    "checkout.toast.createError":
      "Erreur lors de la création de la commande",
    "checkout.toast.retry": "Veuillez réessayer.",

    // Checkout confirmation
    "confirm.eyebrow": "Confirmation",
    "confirm.title": "Merci, votre commande est enregistrée",
    "confirm.lead":
      "Nous vous rappelons rapidement pour confirmer les détails.",
    "confirm.orderNumber": "Numéro de commande",
    "confirm.backHome": "Retour à l'accueil",
    "confirm.continueShopping": "Continuer mes achats",
    "confirm.notFoundTitle": "Commande introuvable",
    "confirm.notFoundLead":
      "Nous n'avons pas trouvé de commande avec ce numéro. Retournez à l'accueil pour réessayer.",
    "confirm.thankTitle": "Merci pour votre commande !",
    "confirm.thankLead":
      "Nous avons bien reçu votre commande. Vous recevrez un appel de confirmation sous 24h.",
    "confirm.numberLabel": "Numéro :",
    "confirm.timeline.title": "Et maintenant ?",
    "confirm.step.received.title": "Commande reçue",
    "confirm.step.received.detail": "Votre commande est dans notre système.",
    "confirm.step.call.title": "Appel de confirmation",
    "confirm.step.call.detail":
      "Notre équipe vous contactera pour valider la commande.",
    "confirm.step.call.timestamp": "Sous 24h",
    "confirm.step.prep.title": "Préparation",
    "confirm.step.prep.detail":
      "Votre commande est emballée et étiquetée.",
    "confirm.step.prep.timestamp": "1-2 jours",
    "confirm.step.ship.title": "Expédition",
    "confirm.step.ship.detail": "ZR Express prend en charge votre colis.",
    "confirm.step.ship.timestamp": "ZR Express",
    "confirm.step.delivery.title": "Livraison",
    "confirm.step.delivery.detailPrefix": "Vers",
    "confirm.step.delivery.detailSuffix": ", paiement à la livraison.",
    "confirm.step.delivery.timestampPrefix": "Estimée",
    "confirm.step.delivery.fallbackDays": "2-5 jours",
    "confirm.recap": "Récapitulatif",
    "confirm.recap.quantity": "Quantité",
    "confirm.recap.subtotal": "Sous-total",
    "confirm.recap.shipping": "Livraison",
    "confirm.recap.total": "Total",
    "confirm.recap.addressLabel": "Adresse de livraison",
    "confirm.trackOrder": "Suivre ma commande",

    // Auth — login
    "login.eyebrow": "Connexion",
    "login.title": "Connectez-vous",
    "login.lead":
      "Retrouvez vos commandes, vos favoris et vos adresses.",
    "login.field.email": "Email",
    "login.field.password": "Mot de passe",
    "login.forgot": "Mot de passe oublié ?",
    "login.submit": "Se connecter",
    "login.submitting": "Connexion…",
    "login.welcomeToast": "Bienvenue !",
    "login.failureTitle": "Échec de la connexion",
    "login.retry": "Veuillez réessayer.",
    "login.noAccount": "Pas encore de compte ?",
    "login.showPassword": "Afficher le mot de passe",
    "login.hidePassword": "Masquer le mot de passe",
    "login.errors.emailInvalid": "Email invalide",
    "login.errors.passwordMin": "Au moins 6 caractères",
    "auth.split.eyebrow": "Équipement outdoor",
    "auth.split.tagline":
      "L'aventure commence ici. Connectez-vous pour suivre vos commandes.",
    "auth.split.copyright": "© 2026 BINGO — Sétif, Algérie",

    // Auth — register
    "register.eyebrow": "Inscription",
    "register.title": "Créer un compte",
    "register.lead":
      "Vos informations sont confidentielles et ne servent qu'à vous livrer.",
    "register.tagline":
      "Créez votre compte pour suivre vos commandes et sauvegarder vos favoris.",
    "register.field.firstName": "Prénom",
    "register.field.lastName": "Nom",
    "register.field.email": "Email",
    "register.field.phone": "Téléphone",
    "register.field.password": "Mot de passe",
    "register.field.confirmPassword": "Confirmer le mot de passe",
    "register.cgv.before": "J'accepte les",
    "register.cgv.linkLabel": "conditions générales de vente",
    "register.cgv.after": "et la politique de confidentialité.",
    "register.submit": "Créer mon compte",
    "register.submitting": "Création…",
    "register.welcomeToast": "Bienvenue chez BINGO !",
    "register.failureTitle": "Erreur lors de la création du compte",
    "register.retry": "Veuillez réessayer.",
    "register.haveAccount": "Déjà un compte ?",
    "register.errors.firstNameTooShort": "Prénom trop court",
    "register.errors.lastNameTooShort": "Nom trop court",
    "register.errors.emailInvalid": "Email invalide",
    "register.errors.phoneInvalid":
      "10 chiffres, commençant par 05, 06 ou 07 (ex : 0554748287)",
    "register.errors.passwordMin": "Au moins 6 caractères",
    "register.errors.passwordWeak":
      "Au moins 8 caractères, dont une majuscule, une minuscule et un chiffre.",
    "register.errors.passwordsMismatch":
      "Les mots de passe ne correspondent pas",
    "register.errors.cgvRequired": "Vous devez accepter les CGV",

    // Account
    "account.eyebrow": "Compte",
    "account.memberSince": "Membre depuis",
    "account.nav.orders": "Mes commandes",
    "account.nav.favorites": "Favoris",
    "account.nav.addresses": "Adresses",
    "account.nav.profile": "Profil",
    "account.nav.logout": "Déconnexion",

    // Informational page headers
    "info.about.eyebrow": "Notre histoire",
    "info.about.title": "À propos de BINGO",
    "about.hero.eyebrow": "Notre maison",
    "about.hero.title": "BINGO — L'aventure commence ici",
    "about.hero.lead":
      "Une petite équipe à Sétif, une obsession : équiper sérieusement celles et ceux qui sortent — pour une nuit ou pour un mois.",
    "about.section.why.title": "Pourquoi BINGO ?",
    "about.section.why.p1":
      "BINGO est né d'une frustration simple : impossible de trouver en Algérie un équipement outdoor à la fois technique, durable et accompagné d'un vrai service client. Trop de boutiques vendent ce qui se vend, pas ce qui dure.",
    "about.section.why.p2":
      "Nous avons commencé en 2024 par sélectionner moins de quinze marques, parmi des fabricants qui partagent notre approche : pas de greenwashing, pas de marketing creux, des matériaux honnêtes et un SAV qui répond vraiment.",
    "about.section.approach.title": "Notre approche",
    "about.section.approach.p1":
      "Chaque produit est testé en conditions réelles avant d'entrer au catalogue. Nous prêtons attention à trois choses : la durabilité (combien de saisons tiendra-t-il ?), la réparabilité (peut-on remplacer une pièce ?) et la transparence des fiches techniques.",
    "about.section.approach.p2":
      "Côté logistique, nous travaillons en exclusivité avec ZR Express — leur réseau couvre les 58 wilayas et leur taux de livraison réussie est le plus élevé d'Algérie. Tout le monde est livré.",
    "about.values.curation.title": "Curation",
    "about.values.curation.text":
      "Moins de marques, mieux choisies. Nous écartons les gadgets et privilégions ce qui résiste au temps.",
    "about.values.quality.title": "Qualité",
    "about.values.quality.text":
      "Tests terrain dans le Djurdjura, l'Aurès et le Hoggar avant toute mise en catalogue.",
    "about.values.service.title": "Service",
    "about.values.service.text":
      "Conseil par téléphone et WhatsApp 7j/7. Le SAV traite chaque demande sous 24h.",
    "about.banner.quote":
      "La meilleure publicité, c'est un client servi correctement.",
    "about.banner.cta": "Découvrir nos produits",
    "info.contact.eyebrow": "Nous écrire",
    "info.contact.title": "Contact",
    "info.contact.lead":
      "Question sur un produit, suivi de commande, partenariat — toute l'équipe est joignable, 7 jours sur 7.",
    "info.contact.field.name": "Nom",
    "info.contact.field.email": "Email",
    "info.contact.field.phone": "Téléphone",
    "info.contact.field.subject": "Sujet",
    "info.contact.field.message": "Votre message",
    "info.contact.placeholder.name": "Votre nom complet",
    "info.contact.placeholder.subject": "Objet de votre message",
    "info.contact.placeholder.message": "Détaillez votre demande…",
    "info.contact.error.email": "Veuillez saisir un email valide.",
    "info.contact.error.phone":
      "10 chiffres, commençant par 05, 06 ou 07 (ex : 0554748287)",
    "info.contact.cta.send": "Envoyer",
    "info.contact.cta.sending": "Envoi…",
    "info.contact.toast.sent": "Votre message a bien été envoyé",
    "info.contact.toast.sentDesc": "Nous répondons sous 24h ouvrées.",
    "info.contact.section.address": "Adresse",
    "info.contact.section.phone": "Téléphone & WhatsApp",
    "info.contact.section.email": "Email",
    "info.contact.section.hours": "Horaires",
    "info.contact.section.social": "Réseaux sociaux",
    "info.contact.address.line1": "Cité Hassan Bey, Sétif 19000",
    "info.contact.address.line2": "Algérie",
    "info.contact.hours.weekdays": "Samedi - Jeudi · 9h-18h",
    "info.contact.hours.friday": "Vendredi · 14h-18h",
    "info.contact.hours.note":
      "WhatsApp et email traités également hors horaires.",
    "info.contact.form.eyebrow": "Formulaire",
    "info.contact.form.title": "Envoyez-nous un message",
    "info.contact.socialAria": "Réseau social",
    "info.contact.mapPin": "Sétif, Algérie",
    "info.faq.eyebrow": "Aide",
    "info.faq.title": "Questions fréquentes",
    "info.delivery.eyebrow": "Livraison",
    "info.delivery.title": "Livraison ZR Express",
    "delivery.banner.title":
      "Partenaire logistique exclusif : ZR Express",
    "delivery.banner.lead":
      "ZR Express dispose du plus large maillage de relais et livreurs d'Algérie. Taux de livraison réussie : 96 %.",
    "delivery.zones.title": "Zones desservies",
    "delivery.zones.p1":
      "Toutes les wilayas, sans exception. Les délais et frais varient selon la région. Les villages les plus reculés peuvent demander un retrait au relais ZR Express le plus proche.",
    "delivery.table.title": "Délais par région",
    "delivery.table.region": "Région",
    "delivery.table.wilayas": "Wilayas",
    "delivery.table.delay": "Délai estimé",
    "delivery.table.fee": "Frais de livraison",
    "delivery.table.days": "jours",
    "delivery.region.Nord": "Nord",
    "delivery.region.Centre": "Centre",
    "delivery.region.Est": "Est",
    "delivery.region.Ouest": "Ouest",
    "delivery.region.Sud": "Sud",
    "delivery.tracking.title": "Suivi de commande",
    "delivery.tracking.p1":
      "Dès l'expédition, vous recevez par SMS un numéro de suivi ZR Express. Vous pouvez également consulter le statut depuis votre espace client (Mes commandes).",
    "delivery.reception.title": "Réception de la commande",
    "delivery.reception.p1":
      "Le livreur vous contacte avant le passage. Préparez le montant exact en cash. Vous pouvez ouvrir le colis devant le livreur pour vérifier le contenu — en cas de problème, refusez le colis sans frais.",
    "delivery.reception.p2":
      "Si vous êtes absent, le livreur tente une nouvelle fois ou laisse le colis au relais ZR Express le plus proche, à retirer sous 7 jours.",
    "info.returns.eyebrow": "Politique",
    "info.returns.title": "Retours & remboursements",
    "returns.window.title": "Délai de retour",
    "returns.window.p1":
      "Le délai court à compter du jour de réception. Au-delà de 14 jours, seuls les retours pour défaut produit sont acceptés (sous garantie fabricant).",
    "returns.conditions.title": "Conditions",
    "returns.conditions.i1":
      "Produit non utilisé, dans son emballage d'origine.",
    "returns.conditions.i2":
      "Étiquettes et accessoires d'origine présents.",
    "returns.conditions.i3":
      "Preuve d'achat ou numéro de commande BINGO communicable.",
    "returns.procedure.title": "Procédure",
    "returns.procedure.i1":
      "Contactez-nous par téléphone, WhatsApp ou email avec votre numéro de commande et le motif du retour.",
    "returns.procedure.i2":
      "Nous organisons un retour ZR Express depuis votre adresse. Vous recevez par SMS le numéro de prise en charge.",
    "returns.procedure.i3":
      "Préparez le colis avec le produit dans son emballage et les accessoires d'origine. Le livreur récupère le colis chez vous.",
    "returns.procedure.i4":
      "Dès réception et contrôle dans nos locaux (sous 48h), nous procédons au remboursement.",
    "returns.refund.title": "Remboursement",
    "returns.refund.p1":
      "Le remboursement est effectué par le moyen de votre choix : transfert BaridiMob, virement bancaire, ou avoir BINGO valable 1 an (avec un bonus de +10% sur le montant remboursé).",
    "returns.refund.p2":
      "Délai de traitement : 5 jours ouvrés après réception du retour.",
    "returns.fees.title": "Frais de retour",
    "returns.fees.i1.bold": "Produit défectueux à l'arrivée :",
    "returns.fees.i1.text": "retour gratuit, BINGO prend en charge.",
    "returns.fees.i2.bold":
      "Erreur de notre part (mauvais produit / taille) :",
    "returns.fees.i2.text": "retour gratuit.",
    "returns.fees.i3.bold": "Changement d'avis :",
    "returns.fees.i3.text":
      "frais de retour ZR Express à votre charge (mêmes tarifs que la livraison initiale).",
    "returns.exceptions.title": "Exceptions",
    "returns.exceptions.lead":
      "Pour des raisons d'hygiène ou de sécurité, certains produits ne peuvent pas être retournés une fois ouverts :",
    "returns.exceptions.i1": "Sous-vêtements et chaussettes techniques.",
    "returns.exceptions.i2": "Gourdes et popotes utilisées.",
    "returns.exceptions.i3": "Produits alimentaires (rations, lyophilisés).",
    "returns.exceptions.i4":
      "Produits soldés à plus de -50% : remboursement uniquement sous forme d'avoir.",
    "returns.banner.quote":
      "Un problème avec votre commande ? On s'en occupe.",
    "returns.banner.cta": "Demander un retour",
    "info.cgv.eyebrow": "Légal",
    "info.cgv.title": "Conditions générales de vente",
    "cgv.art1.title": "Article 1 — Parties",
    "cgv.art1.p1":
      "Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre :",
    "cgv.art1.p2.bold": "BINGO SARL",
    "cgv.art1.p2.text":
      "(ci-après « le Vendeur »), au capital social de 100 000 DZD, dont le siège social est situé Cité Hassan Bey, Sétif 19000, Algérie, immatriculée au Registre du Commerce d'Algérie sous le numéro XX/00-XXXXXXX ;",
    "cgv.art1.p3":
      "Et toute personne physique ou morale, majeure et résidant en Algérie, effectuant un achat sur le site bingo.dz (ci-après « le Client »).",
    "cgv.art2.title": "Article 2 — Objet et acceptation",
    "cgv.art2.p1":
      "Les CGV ont pour objet de définir les modalités de vente entre BINGO et le Client. Toute commande implique l'acceptation pleine et entière des présentes conditions, opposables au Client à compter de la confirmation de commande.",
    "cgv.art3.title": "Article 3 — Produits",
    "cgv.art3.p1":
      "Les produits offerts à la vente sont décrits avec leurs caractéristiques essentielles sur les fiches produit du site. Les photographies sont fournies à titre indicatif et n'engagent pas le Vendeur.",
    "cgv.art3.p2":
      "Les produits sont vendus dans la limite des stocks disponibles. En cas d'indisponibilité postérieure à la commande, le Client est informé et bénéficie d'un remboursement intégral.",
    "cgv.art4.title": "Article 4 — Prix",
    "cgv.art4.p1":
      "Les prix sont indiqués en dinars algériens (DZD), toutes taxes comprises, hors frais de livraison. Les frais de livraison sont calculés à l'étape de validation de la commande, selon la wilaya de destination.",
    "cgv.art5.title": "Article 5 — Commande",
    "cgv.art5.p1":
      "Toute commande passée sur le site fait l'objet d'une confirmation par téléphone sous 24h ouvrées. Sans réponse du Client après trois tentatives d'appel, la commande est automatiquement annulée. Le Client peut suivre l'état de sa commande depuis son espace client.",
    "cgv.art6.title": "Article 6 — Paiement",
    "cgv.art6.p1":
      "Le paiement est effectué exclusivement à la livraison, en numéraire (cash) auprès du transporteur ZR Express. Le montant total est dû au livreur — aucun frais supplémentaire n'est appliqué pour ce mode de règlement.",
    "cgv.art7.title": "Article 7 — Livraison",
    "cgv.art7.p1":
      "Les commandes sont expédiées sous 24 à 48h après confirmation, via notre partenaire logistique ZR Express. Les délais de livraison varient de 2 à 5 jours selon la wilaya. Les délais sont indicatifs et ne peuvent engager la responsabilité du Vendeur en cas de retard.",
    "cgv.art8.title": "Article 8 — Droit de rétractation et retours",
    "cgv.art8.p1.before":
      "Le Client dispose d'un délai de 14 jours après réception pour retourner les produits, dans leur emballage d'origine et non utilisés. La procédure de retour est détaillée dans la rubrique",
    "cgv.art8.p1.em": "Retours",
    "cgv.art8.p1.after": "du site.",
    "cgv.art9.title": "Article 9 — Garantie",
    "cgv.art9.p1":
      "Tous les produits BINGO bénéficient de la garantie légale de conformité ainsi que de la garantie fabricant lorsqu'elle est offerte par le constructeur (généralement 1 à 10 ans selon les marques).",
    "cgv.art10.title": "Article 10 — Responsabilité",
    "cgv.art10.p1":
      "Le Vendeur ne saurait être tenu responsable des dommages résultant d'une utilisation non conforme du produit, ni des cas de force majeure (catastrophe naturelle, grève des transporteurs, panne réseau).",
    "cgv.art11.title": "Article 11 — Données personnelles",
    "cgv.art11.p1":
      "Les données collectées sont strictement nécessaires au traitement de la commande et à la livraison. Elles ne sont jamais cédées à des tiers en dehors du transporteur ZR Express. Le Client dispose d'un droit d'accès, de rectification et de suppression de ses données en écrivant à contact@bingo.dz.",
    "cgv.art12.title": "Article 12 — Litiges et droit applicable",
    "cgv.art12.p1":
      "Les présentes CGV sont soumises au droit algérien. En cas de litige, le Client est invité à contacter le Vendeur pour une résolution amiable préalable. À défaut d'accord, les tribunaux de Sétif seront seuls compétents.",
    "cgv.updated.label": "Mise à jour",
    "cgv.updated.date": "Dernière révision : 1er mars 2026",

    // Footer
    "footer.boutique": "Boutique",
    "footer.help": "Aide",
    "footer.about": "À propos",
    "footer.legal": "Mentions légales",

    // Languages
    "lang.fr": "Français",
    "lang.ar": "العربية",
    "lang.toggle": "Changer de langue",

    // Home — Categories section
    "home.categories.eyebrow": "Explorez",
    "home.categories.title": "Trouvez votre équipement par catégorie",
    "home.categories.lead":
      "Huit univers couvrant tout l'outdoor — du bivouac à la randonnée technique.",
    "home.categories.cta": "Voir le catalogue complet",

    // Home — Featured
    "home.featured.eyebrow": "Sélection BINGO",
    "home.featured.title": "Produits vedettes",
    "home.featured.lead":
      "Notre coup de cœur du moment — testés sur le terrain par l'équipe.",
    "home.featured.cta": "Tout voir",

    // Home — New arrivals
    "home.new.eyebrow": "Récemment ajoutés",
    "home.new.title": "Nouveautés",
    "home.new.lead": "Les dernières arrivées du catalogue.",
    "home.new.cta": "Toutes les nouveautés",

    // Home — Promotions
    "home.promos.eyebrow": "Profitez-en",
    "home.promos.title": "Promotions en cours",
    "home.promos.lead":
      "Sélection à prix réduit, dans la limite des stocks disponibles.",
    "home.promos.cta": "Toutes les promotions",

    // Home — Best sellers
    "home.best.eyebrow": "Plébiscités par nos clients",
    "home.best.title": "Meilleures ventes",
    "home.best.cta": "Tous les best-sellers",

    // Home — Editorial
    "home.editorial.eyebrow": "Notre approche",
    "home.editorial.title": "L'équipement, sans bruit.",
    "home.editorial.para1":
      "Chaque produit est testé sur le terrain — Djurdjura, Hoggar, Aurès. Nous travaillons avec un petit nombre de marques choisies pour leur durabilité, leur honnêteté technique et leur SAV. Pas de gadgets, pas de marketing creux.",
    "home.editorial.para2":
      "Juste ce qui marche, livré partout en Algérie par ZR Express.",
    "home.editorial.cta": "Lire notre histoire",

    // Home — Catalogue CTA
    "home.catalogCta.eyebrow": "Tout le catalogue",
    "home.catalogCta.title": "Découvrez tous nos produits",
    "home.catalogCta.lead":
      "Plus de références à explorer — tentes, sacs, chaussures, éclairage et bien plus. Livraison ZR Express partout en Algérie.",
    "home.catalogCta.cta": "Voir nos produits",

    // Home — Dividers
    "home.divider.adventure": "L'aventure commence là où s'arrête la route.",
    "home.divider.equipment": "Le meilleur équipement est celui qui ne se voit pas.",
    "home.divider.farFromAll": "Loin de tout, près de l'essentiel.",
    "home.divider.manifesto": "Manifeste BINGO",

    // Hero slider
    "hero.limitedEdition": "Édition limitée",
    "hero.prev": "Promotion précédente",
    "hero.next": "Promotion suivante",
    "hero.carousel": "Promotions du moment",

    // Catalog
    "catalog.breadcrumb": "Catalogue",
    "catalog.eyebrow": "Boutique",
    "catalog.title": "Catalogue",
    "catalog.lead":
      "Toute notre sélection — testée, choisie, livrée dans toute l'Algérie.",
    "catalog.searchPlaceholder":
      "Rechercher tente, sac de couchage, lampe frontale…",
    "catalog.searchAria": "Rechercher dans le catalogue",
    "catalog.clearSearch": "Effacer la recherche",
    "catalog.results_one": "résultat",
    "catalog.results_other": "résultats",
    "catalog.resultsFor": "pour",
    "catalog.showing": "Affichage de",
    "catalog.outOf": "sur",
    "catalog.products": "produits",
    "catalog.emptyTitle": "Aucun produit ne correspond",
    "catalog.emptyLead":
      "Essayez d'élargir vos filtres, ou modifiez la recherche pour explorer une autre catégorie.",
    "catalog.clearFilters": "Effacer les filtres",
    "catalog.allButton": "Tout",
    "catalog.categoryProductsCount":
      "produits dans cette catégorie — filtrez et triez à votre guise.",

    // Catalog — sort
    "catalog.sort.label": "Trier :",
    "catalog.sort.relevance": "Pertinence",
    "catalog.sort.price_asc": "Prix croissant",
    "catalog.sort.price_desc": "Prix décroissant",
    "catalog.sort.newest": "Nouveautés",
    "catalog.sort.popular": "Popularité",
    "catalog.sort.name_asc": "Nom A-Z",
    "catalog.view.grid": "Vue grille",
    "catalog.view.list": "Vue liste",

    // Catalog — active filters
    "catalog.filters.active": "Filtres actifs",
    "catalog.filters.removeAriaPrefix": "Retirer le filtre",
    "catalog.filters.clearAll": "Tout effacer",
    "catalog.filters.inStockOnly": "En stock uniquement",
    "catalog.filters.promoOnly": "En promotion",
    "catalog.filters.ratingMin": "et +",

    // Catalog — filter sidebar
    "filters.title": "Filtres",
    "filters.none": "Aucun",
    "filters.clearAll": "Tout effacer",
    "filters.categories": "Catégories",
    "filters.allCategories": "Toutes les catégories",
    "filters.price": "Prix",
    "filters.priceMin": "Min",
    "filters.priceMax": "Max",
    "filters.priceMinAria": "Prix minimum",
    "filters.priceMaxAria": "Prix maximum",
    "filters.brands": "Marques",
    "filters.brandsSearch": "Rechercher une marque…",
    "filters.brandsSelected_one": "sélectionnée",
    "filters.brandsSelected_other": "sélectionnées",
    "filters.brandsShowMore": "Voir plus",
    "filters.brandsShowLess": "Voir moins",
    "filters.availability": "Disponibilité",
    "filters.inStockOnly": "En stock uniquement",
    "filters.promoOnly": "Produits en promotion",
    "filters.ratingMin": "Note minimum",
    "filters.ratingMinAria": "Note minimum",
    "filters.mobileLabel": "Filtres",

    // Pagination
    "pagination.aria": "Pagination",
    "pagination.prev": "Page précédente",
    "pagination.next": "Page suivante",

    // Footer
    "footer.tagline":
      "Équipement outdoor sélectionné, testé en conditions réelles dans le Djurdjura, l'Aurès et le Hoggar. Une petite équipe à Sétif, livrée partout en Algérie.",
    "footer.shippingBadge": "Livraison partout en Algérie",
    "footer.copyright": "© 2026 BINGO — Sétif, Algérie",
    "footer.col.boutique": "Boutique",
    "footer.col.help": "Aide",
    "footer.col.about": "À propos",
    "footer.link.allCategories": "Toutes catégories",
    "footer.link.newArrivals": "Nouveautés",
    "footer.link.promotions": "Promotions",
    "footer.link.bestSellers": "Meilleures ventes",
    "footer.link.delivery": "Livraison",
    "footer.link.returns": "Retours",
    "footer.link.faq": "FAQ",
    "footer.link.contact": "Contact",
    "footer.link.ourStory": "Notre histoire",
    "footer.link.legal": "Mentions légales",
    "footer.link.cgv": "CGV",
    "footer.link.favorites": "Favoris",
    "footer.social.fb": "BINGO sur Facebook",
    "footer.social.ig": "BINGO sur Instagram",
    "footer.social.wa": "BINGO sur WhatsApp",
  },

  ar: {
    // Common
    "common.continueShopping": "متابعة التسوق",
    "common.viewAll": "عرض الكل",
    "common.viewCatalog": "تصفح الكتالوج",
    "common.discover": "اكتشف",
    "common.search": "بحث",

    // Header / nav
    "nav.home": "الرئيسية",
    "nav.catalog": "الكتالوج",
    "nav.promotions": "العروض",
    "nav.myCart": "سلتي",
    "nav.about": "من نحن",
    "nav.contact": "اتصل بنا",

    // Top categories strip
    "cat.tentes-abris": "الخيام والمآوي",
    "cat.sacs-de-couchage": "أكياس النوم",
    "cat.cuisine-outdoor": "مطبخ المغامرة",
    "cat.eclairage": "الإضاءة",
    "cat.sacs-a-dos": "حقائب الظهر",
    "cat.vetements": "الملابس",
    "cat.chaussures": "الأحذية",
    "cat.accessoires": "الإكسسوارات",

    // Trust band (homepage)
    "trust.aria": "ضمانات بينغو",
    "trust.delivery.label": "توصيل 48-72 ساعة",
    "trust.delivery.detail": "في كل الجزائر عبر ZR Express",
    "trust.payment.label": "الدفع عند الاستلام",
    "trust.payment.detail": "نقداً، دون رسوم إضافية",
    "trust.guarantee.label": "ضمان 30 يوماً",
    "trust.guarantee.detail": "استبدال أو استرداد",
    "trust.support.label": "دعم 7/7",
    "trust.support.detail": "نصيحة عبر الهاتف وواتساب",
    "nav.account": "الحساب",
    "nav.favorites": "المفضلة",
    "favorites.eyebrow": "اختياركم",
    "favorites.title": "المفضلة",
    "favorites.emptyShort": "لا توجد منتجات في المفضلة حالياً.",
    "favorites.countOne": "منتج محفوظ",
    "favorites.countMany": "منتجات محفوظة",
    "favorites.loading": "جارٍ التحميل…",
    "favorites.empty.title": "ليس لديك أي منتج في المفضلة بعد",
    "favorites.empty.lead":
      "اضغط على القلب من بطاقة المنتج لإضافته إلى المفضلة.",
    "favorites.empty.cta": "اكتشف الكتالوج",
    "notFound.eyebrow": "خطأ 404",
    "notFound.title": "ضائع في الغابة ؟",
    "notFound.lead":
      "الصفحة التي تبحث عنها لم تعد موجودة، أو لم تكن موجودة أصلاً. لنبدأ المسار من جديد.",
    "notFound.home": "العودة إلى الرئيسية",
    "notFound.catalog": "تصفّح الكتالوج",
    "error.eyebrow": "خطأ غير متوقّع",
    "error.title": "حدث خطأ ما",
    "error.lead":
      "تمّ تسجيل المشكلة. أعد المحاولة بعد لحظات — إذا استمرّ الخطأ، تواصل مع الدعم.",
    "error.reference": "المرجع",
    "error.retry": "إعادة المحاولة",
    "error.contact": "تواصل مع الدعم",
    "nav.login": "تسجيل الدخول",
    "nav.register": "إنشاء حساب",
    "nav.logout": "تسجيل الخروج",
    "header.searchPlaceholder": "ابحث…",
    "header.openMenu": "فتح القائمة",
    "header.cart": "السلة",
    "header.favorites": "المفضلة",
    "header.userMenu": "حسابي",
    "header.signedInAs": "مسجّل الدخول باسم",
    "header.adminPanel": "لوحة الإدارة",
    "header.myOrders": "طلباتي",
    "header.profile": "الملف الشخصي",
    "header.signIn": "تسجيل الدخول",

    // Cart drawer
    "cart.title": "السلة",
    "cart.empty": "سلتك فارغة",
    "cart.emptyHint": "أضف بعض المنتجات لتجدها هنا.",
    "cart.subtotal": "المجموع الفرعي",
    "cart.shippingHint": "تُحسب رسوم الشحن في الخطوة التالية.",
    "cart.checkout": "إتمام الطلب",
    "cart.viewFullCart": "عرض السلة كاملة",
    "cart.discover": "اكتشف الكتالوج",
    "cart.eyebrow": "اختيارك",
    "cart.eachUnit": "للوحدة",
    "cart.removed": "تمت إزالة المنتج من السلة",
    "cart.removeAriaPrefix": "إزالة",
    "cart.articles_one": "منتج",
    "cart.articles_other": "منتجات",
    "cart.summary": "ملخص الطلب",
    "cart.shippingLabel": "رسوم التوصيل",
    "cart.shippingCalculatedLater": "تُحسب في الخطوة التالية",
    "cart.total": "المجموع",
    "cart.continueShopping": "→ متابعة التسوق",
    "cart.emptyTitle": "سلتك فارغة",
    "cart.emptyLead":
      "اكتشف اختياراتنا — خيام، أكياس النوم، ملابس تقنية وغيرها الكثير.",
    "cart.discoverProducts": "اكتشف منتجاتنا",
    "cart.trust.cod": "الدفع عند الاستلام",
    "cart.trust.shipping": "ZR Express",
    "cart.trust.guarantee": "ضمان 30 يوماً",
    "cart.promoCode": "رمز الخصم",
    "cart.promoCodePlaceholder": "أدخل الرمز",
    "cart.applyPromo": "تطبيق",
    "cart.promoComingSoon": "ستصل رموز الخصم قريباً.",
    "cart.updatedAtOpen": "تم التحديث عند الفتح",

    // Product card
    "product.order": "اطلب الآن",
    "product.skuLabel": "الرمز",
    "product.addToCart": "أضف إلى السلة",
    "product.outOfStock": "غير متوفر",
    "product.new": "جديد",
    "product.bestSeller": "الأكثر مبيعاً",

    // Product detail page
    "product.reviewsLabel": "تقييم",
    "product.share": "مشاركة :",
    "product.share.fb": "مشاركة على فيسبوك",
    "product.share.wa": "مشاركة على واتساب",
    "product.share.copy": "نسخ الرابط",
    "product.delivery.title": "توصيل ZR Express في كل الجزائر",
    "product.delivery.lead":
      "المهلة 48-72 ساعة حسب الولاية، الرسوم تظهر عند إتمام الطلب.",
    "product.payment.title": "الدفع عند الاستلام متاح",
    "product.payment.lead": "نقداً، دون رسوم إضافية.",
    "product.relatedTitle": "منتجات مشابهة",
    "product.alsoBoughtTitle": "اشترى العملاء أيضاً",
    "product.notFound": "المنتج غير موجود",

    // Stock states
    "stock.expedited": "يُشحَن خلال 48 ساعة بعد التأكيد.",
    "stock.lowPrefix": "تبقّى فقط",
    "stock.lowSuffix": "في المخزون — اطلب بسرعة.",
    "stock.outOfStock":
      "غير متوفر — احصل على تنبيه عند العودة إلى المخزون.",
    "stock.badge.in": "متوفر",
    "stock.badge.low": "مخزون منخفض",
    "stock.badge.out": "نفد المخزون",

    // AddToCartPanel
    "atc.addedToast": "أُضيف إلى السلة",
    "atc.variant": "الخيار",
    "atc.quantity": "الكمية",
    "atc.qtyDecrease": "تقليل الكمية",
    "atc.qtyIncrease": "زيادة الكمية",
    "atc.favAddedToast": "أُضيف إلى المفضلة",
    "atc.favRemovedToast": "أُزيل من المفضلة",
    "atc.favOff": "أضف إلى المفضلة",
    "atc.favOn": "في مفضلتك",

    // QuickOrderForm
    "quickOrder.eyebrow": "طلب سريع",
    "quickOrder.title": "اطلب بدون إنشاء حساب",
    "quickOrder.lead":
      "الدفع عند الاستلام · توصيل ZR Express في كل الجزائر.",
    "quickOrder.fields.firstName": "الاسم",
    "quickOrder.fields.firstNamePh": "مثلاً : ياسين",
    "quickOrder.fields.lastName": "اللقب",
    "quickOrder.fields.lastNamePh": "مثلاً : بن علي",
    "quickOrder.fields.phone": "الهاتف",
    "quickOrder.fields.phonePh": "0554748287",
    "quickOrder.fields.wilaya": "الولاية",
    "quickOrder.fields.wilayaPlaceholder": "اختر ولاية",
    "quickOrder.fields.commune": "البلدية",
    "quickOrder.fields.communePh": "مثلاً : سطيف، عين أرنات…",
    "quickOrder.summary.subtotal": "المجموع الفرعي",
    "quickOrder.summary.shipping": "التوصيل",
    "quickOrder.summary.total": "المجموع",
    "quickOrder.cta": "اطلب الآن",
    "quickOrder.cta.sending": "جارٍ الإرسال…",
    "quickOrder.cta.unavailable": "غير متوفر",
    "quickOrder.toast.sent": "تم إرسال الطلب",
    "quickOrder.toast.sentDesc": "سنتصل بك قريباً.",
    "quickOrder.toast.error": "حدث خطأ في الطلب",
    "quickOrder.toast.errorDesc": "يرجى المحاولة مجدداً.",
    "quickOrder.errors.firstNameTooShort": "الاسم قصير جداً",
    "quickOrder.errors.lastNameTooShort": "اللقب قصير جداً",
    "quickOrder.errors.phoneInvalid":
      "10 أرقام، تبدأ بـ 05 أو 06 أو 07 (مثال : 0554748287)",
    "quickOrder.errors.wilayaRequired": "اختر الولاية",
    "quickOrder.errors.communeRequired": "البلدية مطلوبة",
    "form.optional": "اختياري",

    // Checkout
    "checkout.breadcrumb": "الطلب",
    "checkout.eyebrow": "إتمام الطلب",
    "checkout.title": "طلبك",
    "checkout.sec.contact.title": "1. بيانات الاتصال",
    "checkout.sec.contact.subtitle": "سنتصل بك لتأكيد الطلب.",
    "checkout.sec.address.title": "2. عنوان التوصيل",
    "checkout.sec.address.subtitle":
      "كل الولايات مغطّاة من قبل ZR Express.",
    "checkout.sec.payment.title": "3. طريقة الدفع",
    "checkout.sec.payment.subtitle": "ستتوفر طرق أخرى قريباً.",
    "checkout.field.firstName": "الاسم",
    "checkout.field.lastName": "اللقب",
    "checkout.field.phone": "الهاتف",
    "checkout.field.email": "البريد الإلكتروني",
    "checkout.field.wilaya": "الولاية",
    "checkout.field.wilayaPlaceholder": "اختر ولاية",
    "checkout.field.commune": "البلدية",
    "checkout.field.address": "العنوان الكامل",
    "checkout.field.addressPlaceholder":
      "الشارع، الرقم، البناية، الطابق…",
    "checkout.field.notes": "ملاحظات للموزّع",
    "checkout.field.notesPlaceholder":
      "اقرع الجرس مرتين، اتصل على 06…، إلخ.",
    "checkout.payment.codTitle": "الدفع عند الاستلام (نقداً)",
    "checkout.payment.codLead":
      "ستدفع المبلغ كاملاً للموزّع عند استلام طلبك.",
    "checkout.cgv.before": "أوافق على",
    "checkout.cgv.linkLabel": "الشروط العامة للبيع",
    "checkout.cgv.after": "الخاصة ببينغو.",
    "checkout.submit": "تأكيد الطلب",
    "checkout.submitting": "جارٍ الإرسال…",
    "checkout.summary.title": "طلبك",
    "checkout.summary.subtotal": "المجموع الفرعي",
    "checkout.summary.shipping": "التوصيل",
    "checkout.summary.total": "المجموع",
    "checkout.summary.viaZR": "التوصيل عبر ZR Express إلى",
    "checkout.summary.pickWilaya":
      "اختر الولاية لرؤية رسوم التوصيل.",
    "checkout.errors.firstNameTooShort": "الاسم قصير جداً",
    "checkout.errors.lastNameTooShort": "اللقب قصير جداً",
    "checkout.errors.phoneInvalid":
      "الصيغة المطلوبة : +213 5/6/7XX XXX XXX",
    "checkout.errors.emailInvalid": "بريد إلكتروني غير صالح",
    "checkout.errors.wilayaRequired": "اختر الولاية",
    "checkout.errors.communeRequired": "البلدية مطلوبة",
    "checkout.errors.addressTooShort": "العنوان قصير جداً",
    "checkout.errors.cgvRequired":
      "يجب الموافقة على الشروط العامة للبيع",
    "checkout.toast.createError": "حدث خطأ في إنشاء الطلب",
    "checkout.toast.retry": "يرجى المحاولة مجدداً.",

    // Checkout confirmation
    "confirm.eyebrow": "تأكيد",
    "confirm.title": "شكراً، تم تسجيل طلبك",
    "confirm.lead": "سنتصل بك قريباً لتأكيد التفاصيل.",
    "confirm.orderNumber": "رقم الطلب",
    "confirm.backHome": "العودة إلى الرئيسية",
    "confirm.continueShopping": "متابعة التسوق",
    "confirm.notFoundTitle": "الطلب غير موجود",
    "confirm.notFoundLead":
      "لم نجد طلباً بهذا الرقم. ارجع إلى الصفحة الرئيسية للمحاولة مجدداً.",
    "confirm.thankTitle": "شكراً لطلبك !",
    "confirm.thankLead":
      "لقد استلمنا طلبك. ستتلقّى مكالمة تأكيد خلال 24 ساعة.",
    "confirm.numberLabel": "الرقم :",
    "confirm.timeline.title": "ما الخطوة التالية ؟",
    "confirm.step.received.title": "تم استلام الطلب",
    "confirm.step.received.detail": "طلبك في نظامنا.",
    "confirm.step.call.title": "مكالمة التأكيد",
    "confirm.step.call.detail": "سيتصل بك فريقنا للتأكيد.",
    "confirm.step.call.timestamp": "خلال 24 ساعة",
    "confirm.step.prep.title": "التحضير",
    "confirm.step.prep.detail": "يتم تغليف طلبك ووضع البطاقة.",
    "confirm.step.prep.timestamp": "1-2 يوم",
    "confirm.step.ship.title": "الشحن",
    "confirm.step.ship.detail": "تتولّى ZR Express طردك.",
    "confirm.step.ship.timestamp": "ZR Express",
    "confirm.step.delivery.title": "التوصيل",
    "confirm.step.delivery.detailPrefix": "إلى",
    "confirm.step.delivery.detailSuffix": "، الدفع عند الاستلام.",
    "confirm.step.delivery.timestampPrefix": "المقدّر",
    "confirm.step.delivery.fallbackDays": "2-5 أيام",
    "confirm.recap": "ملخص الطلب",
    "confirm.recap.quantity": "الكمية",
    "confirm.recap.subtotal": "المجموع الفرعي",
    "confirm.recap.shipping": "التوصيل",
    "confirm.recap.total": "المجموع",
    "confirm.recap.addressLabel": "عنوان التوصيل",
    "confirm.trackOrder": "تتبّع طلبي",

    // Auth — login
    "login.eyebrow": "تسجيل الدخول",
    "login.title": "سجّل دخولك",
    "login.lead": "اعثر على طلباتك ومفضّلتك وعناوينك.",
    "login.field.email": "البريد الإلكتروني",
    "login.field.password": "كلمة المرور",
    "login.forgot": "هل نسيت كلمة المرور ؟",
    "login.submit": "تسجيل الدخول",
    "login.submitting": "جارٍ تسجيل الدخول…",
    "login.welcomeToast": "مرحباً !",
    "login.failureTitle": "فشل تسجيل الدخول",
    "login.retry": "يرجى المحاولة مجدداً.",
    "login.noAccount": "ليس لديك حساب بعد ؟",
    "login.showPassword": "إظهار كلمة المرور",
    "login.hidePassword": "إخفاء كلمة المرور",
    "login.errors.emailInvalid": "بريد إلكتروني غير صالح",
    "login.errors.passwordMin": "على الأقل 6 أحرف",
    "auth.split.eyebrow": "معدات الهواء الطلق",
    "auth.split.tagline":
      "هنا تبدأ المغامرة. سجّل دخولك لمتابعة طلباتك.",
    "auth.split.copyright": "© 2026 بينغو — سطيف، الجزائر",

    // Auth — register
    "register.eyebrow": "تسجيل",
    "register.title": "إنشاء حساب",
    "register.lead":
      "معلوماتك سرّية ولا تُستخدم إلا لتوصيل طلباتك.",
    "register.tagline":
      "أنشئ حسابك لمتابعة طلباتك وحفظ مفضّلتك.",
    "register.field.firstName": "الاسم",
    "register.field.lastName": "اللقب",
    "register.field.email": "البريد الإلكتروني",
    "register.field.phone": "الهاتف",
    "register.field.password": "كلمة المرور",
    "register.field.confirmPassword": "تأكيد كلمة المرور",
    "register.cgv.before": "أوافق على",
    "register.cgv.linkLabel": "الشروط العامة للبيع",
    "register.cgv.after": "وسياسة الخصوصية.",
    "register.submit": "إنشاء حسابي",
    "register.submitting": "جارٍ الإنشاء…",
    "register.welcomeToast": "مرحباً بك في بينغو !",
    "register.failureTitle": "حدث خطأ في إنشاء الحساب",
    "register.retry": "يرجى المحاولة مجدداً.",
    "register.haveAccount": "لديك حساب بالفعل ؟",
    "register.errors.firstNameTooShort": "الاسم قصير جداً",
    "register.errors.lastNameTooShort": "اللقب قصير جداً",
    "register.errors.emailInvalid": "بريد إلكتروني غير صالح",
    "register.errors.phoneInvalid":
      "10 أرقام، تبدأ بـ 05 أو 06 أو 07 (مثال : 0554748287)",
    "register.errors.passwordMin": "على الأقل 6 أحرف",
    "register.errors.passwordWeak":
      "على الأقل 8 أحرف، تتضمّن حرفاً كبيراً وحرفاً صغيراً ورقماً.",
    "register.errors.passwordsMismatch": "كلمتا المرور غير متطابقتين",
    "register.errors.cgvRequired": "يجب الموافقة على الشروط العامة للبيع",

    // Account
    "account.eyebrow": "الحساب",
    "account.memberSince": "عضو منذ",
    "account.nav.orders": "طلباتي",
    "account.nav.favorites": "المفضلة",
    "account.nav.addresses": "العناوين",
    "account.nav.profile": "الملف الشخصي",
    "account.nav.logout": "تسجيل الخروج",

    // Informational page headers
    "info.about.eyebrow": "قصتنا",
    "info.about.title": "عن بينغو",
    "about.hero.eyebrow": "بيتنا",
    "about.hero.title": "بينغو — هنا تبدأ المغامرة",
    "about.hero.lead":
      "فريق صغير في سطيف، هاجسٌ واحد : تجهيز جادّ لمن يخرج إلى الطبيعة — لليلة واحدة أو لشهر كامل.",
    "about.section.why.title": "لماذا بينغو ؟",
    "about.section.why.p1":
      "ولدت بينغو من إحباط بسيط : يصعب أن تجد في الجزائر معدّات هواء طلق تجمع بين الجودة التقنية، المتانة، وخدمة حقيقية. كثير من المتاجر يبيع ما يُباع، لا ما يدوم.",
    "about.section.why.p2":
      "بدأنا في 2024 باختيار أقلّ من خمس عشرة علامة، من مصنّعين يشاركوننا المنهج : لا غسيلاً أخضر، لا تسويقاً فارغاً، مواد صادقة وخدمة ما بعد البيع تردّ فعلاً.",
    "about.section.approach.title": "منهجنا",
    "about.section.approach.p1":
      "كل منتج يُختبر ميدانياً قبل أن يدخل الكتالوج. نهتم بثلاثة أشياء : المتانة (كم موسماً سيصمد ؟)، إمكانية الإصلاح (هل يمكن استبدال قطعة ؟)، وشفافية البطاقات التقنية.",
    "about.section.approach.p2":
      "من الناحية اللوجستية، نعمل حصرياً مع ZR Express — شبكتهم تغطّي الولايات الثماني والخمسين ومعدّل تسليمهم الناجح هو الأعلى في الجزائر. الكل يتسلّم طلبه.",
    "about.values.curation.title": "الانتقاء",
    "about.values.curation.text":
      "علامات أقل، مختارة أفضل. نستبعد الأدوات التافهة ونفضّل ما يصمد عبر الزمن.",
    "about.values.quality.title": "الجودة",
    "about.values.quality.text":
      "اختبارات ميدانية في جرجرة، الأوراس، والهقار قبل أي إضافة للكتالوج.",
    "about.values.service.title": "الخدمة",
    "about.values.service.text":
      "نصيحة عبر الهاتف وواتساب 7/7. تعالج خدمة ما بعد البيع كل طلب خلال 24 ساعة.",
    "about.banner.quote":
      "أفضل دعاية هي عميل يُخدم كما يجب.",
    "about.banner.cta": "اكتشف منتجاتنا",
    "info.contact.eyebrow": "تواصل معنا",
    "info.contact.title": "اتصل بنا",
    "info.contact.lead":
      "أسئلة حول منتج، متابعة طلب، شراكة — كل الفريق متاح، 7 أيام في الأسبوع.",
    "info.contact.field.name": "الاسم",
    "info.contact.field.email": "البريد الإلكتروني",
    "info.contact.field.phone": "الهاتف",
    "info.contact.field.subject": "الموضوع",
    "info.contact.field.message": "رسالتك",
    "info.contact.placeholder.name": "اسمك الكامل",
    "info.contact.placeholder.subject": "موضوع رسالتك",
    "info.contact.placeholder.message": "اشرح طلبك بالتفصيل…",
    "info.contact.error.email": "الرجاء إدخال بريد إلكتروني صالح.",
    "info.contact.error.phone":
      "10 أرقام، تبدأ بـ 05 أو 06 أو 07 (مثال : 0554748287)",
    "info.contact.cta.send": "إرسال",
    "info.contact.cta.sending": "جارٍ الإرسال…",
    "info.contact.toast.sent": "تم إرسال رسالتك",
    "info.contact.toast.sentDesc":
      "نردّ خلال 24 ساعة عمل.",
    "info.contact.section.address": "العنوان",
    "info.contact.section.phone": "الهاتف وواتساب",
    "info.contact.section.email": "البريد الإلكتروني",
    "info.contact.section.hours": "ساعات العمل",
    "info.contact.section.social": "الشبكات الاجتماعية",
    "info.contact.address.line1": "حي حسن باي، سطيف 19000",
    "info.contact.address.line2": "الجزائر",
    "info.contact.hours.weekdays": "السبت - الخميس · 9 صباحاً - 6 مساءً",
    "info.contact.hours.friday": "الجمعة · 2 - 6 مساءً",
    "info.contact.hours.note":
      "نعالج الرسائل عبر واتساب والبريد الإلكتروني خارج هذه الأوقات أيضاً.",
    "info.contact.form.eyebrow": "النموذج",
    "info.contact.form.title": "أرسل لنا رسالة",
    "info.contact.socialAria": "شبكة اجتماعية",
    "info.contact.mapPin": "سطيف، الجزائر",
    "info.faq.eyebrow": "المساعدة",
    "info.faq.title": "الأسئلة الشائعة",
    "info.delivery.eyebrow": "التوصيل",
    "info.delivery.title": "التوصيل عبر ZR Express",
    "delivery.banner.title":
      "شريك لوجستي حصري : ZR Express",
    "delivery.banner.lead":
      "تتوفّر ZR Express على أوسع شبكة نقاط استلام وموزّعين في الجزائر. نسبة التوصيل الناجح : 96%.",
    "delivery.zones.title": "المناطق المغطّاة",
    "delivery.zones.p1":
      "كل الولايات، دون استثناء. تختلف المهل والرسوم حسب الجهة. قد تتطلّب القرى النائية الاستلام من أقرب نقطة ZR Express.",
    "delivery.table.title": "المهل حسب الجهة",
    "delivery.table.region": "الجهة",
    "delivery.table.wilayas": "الولايات",
    "delivery.table.delay": "المهلة التقديرية",
    "delivery.table.fee": "رسوم التوصيل",
    "delivery.table.days": "أيام",
    "delivery.region.Nord": "الشمال",
    "delivery.region.Centre": "الوسط",
    "delivery.region.Est": "الشرق",
    "delivery.region.Ouest": "الغرب",
    "delivery.region.Sud": "الجنوب",
    "delivery.tracking.title": "متابعة الطلبية",
    "delivery.tracking.p1":
      "بمجرّد الشحن، ستتلقّى عبر SMS رقم متابعة من ZR Express. يمكنك أيضاً مراجعة الحالة من فضاء الزبون (طلباتي).",
    "delivery.reception.title": "استلام الطلبية",
    "delivery.reception.p1":
      "يتّصل بك الموزّع قبل المرور. حضّر المبلغ بالضبط نقداً. يمكنك فتح الطرد أمام الموزّع للتحقّق من المحتوى — في حال وجود مشكلة، ارفض الطرد دون أي رسوم.",
    "delivery.reception.p2":
      "إذا كنت غائباً، يحاول الموزّع مرّة أخرى أو يترك الطرد في أقرب نقطة ZR Express، ليتمّ استلامه في ظرف 7 أيام.",
    "info.returns.eyebrow": "السياسة",
    "info.returns.title": "الإرجاع والاسترداد",
    "returns.window.title": "مهلة الإرجاع",
    "returns.window.p1":
      "تبدأ المهلة من يوم الاستلام. بعد 14 يوماً، تُقبل فقط طلبات الإرجاع بسبب عيب في المنتج (تحت ضمان المصنّع).",
    "returns.conditions.title": "الشروط",
    "returns.conditions.i1":
      "منتج غير مستعمل، في تغليفه الأصلي.",
    "returns.conditions.i2":
      "وجود البطاقات والملحقات الأصلية.",
    "returns.conditions.i3":
      "وجود إثبات الشراء أو رقم طلبية بينغو.",
    "returns.procedure.title": "الإجراء",
    "returns.procedure.i1":
      "اتصل بنا عبر الهاتف أو واتساب أو البريد الإلكتروني مع رقم طلبيتك وسبب الإرجاع.",
    "returns.procedure.i2":
      "نُنظّم استرجاعاً عبر ZR Express من عنوانك. ستتلقّى رقم الاستلام عبر رسالة قصيرة.",
    "returns.procedure.i3":
      "جهّز الطرد بالمنتج في تغليفه والملحقات الأصلية. يستلم الموزّع الطرد من عندك.",
    "returns.procedure.i4":
      "فور الاستلام والفحص في مقرّنا (خلال 48 ساعة)، نباشر عملية الاسترداد.",
    "returns.refund.title": "الاسترداد",
    "returns.refund.p1":
      "يُنفَّذ الاسترداد بالطريقة التي تختارها : تحويل BaridiMob، تحويل بنكي، أو رصيد بينغو صالح لمدة سنة (مع مكافأة +10% على المبلغ المُسترَدّ).",
    "returns.refund.p2":
      "مهلة المعالجة : 5 أيام عمل بعد استلام المرتجَع.",
    "returns.fees.title": "رسوم الإرجاع",
    "returns.fees.i1.bold": "منتج معيب عند الوصول :",
    "returns.fees.i1.text": "الإرجاع مجاناً، بينغو يتكفّل بالرسوم.",
    "returns.fees.i2.bold":
      "خطأ من طرفنا (منتج خاطئ / قياس خاطئ) :",
    "returns.fees.i2.text": "الإرجاع مجاناً.",
    "returns.fees.i3.bold": "تغيير في الرأي :",
    "returns.fees.i3.text":
      "رسوم استرجاع ZR Express على عاتقك (نفس تعريفة التوصيل الأولي).",
    "returns.exceptions.title": "الاستثناءات",
    "returns.exceptions.lead":
      "لأسباب نظافة أو سلامة، بعض المنتجات لا يمكن إرجاعها بعد فتحها :",
    "returns.exceptions.i1": "الملابس الداخلية والجوارب التقنية.",
    "returns.exceptions.i2": "القارورات وأواني الطهي المستخدَمة.",
    "returns.exceptions.i3":
      "المنتجات الغذائية (الحصص الميدانية، المجفّفة بالتجميد).",
    "returns.exceptions.i4":
      "المنتجات المخفّضة بأكثر من -50% : الاسترداد يكون فقط على شكل رصيد.",
    "returns.banner.quote":
      "هل لديك مشكلة في طلبك ؟ نحن نتكفّل بها.",
    "returns.banner.cta": "طلب إرجاع",
    "info.cgv.eyebrow": "قانوني",
    "info.cgv.title": "الشروط العامة للبيع",
    "cgv.art1.title": "المادة 1 — الأطراف",
    "cgv.art1.p1":
      "تنظّم الشروط العامة للبيع (CGV) الحالية العلاقات التعاقدية بين :",
    "cgv.art1.p2.bold": "بينغو ش.م.م",
    "cgv.art1.p2.text":
      "(يُشار إليها لاحقاً بـ « البائع »)، برأسمال اجتماعي قدره 100 000 دج، يقع مقرّها الاجتماعي في حي حسن باي، سطيف 19000، الجزائر، مسجّلة في السجل التجاري الجزائري تحت رقم XX/00-XXXXXXX ؛",
    "cgv.art1.p3":
      "وكل شخص طبيعي أو معنوي بالغ ومقيم في الجزائر، يقوم بعملية شراء على موقع bingo.dz (يُشار إليه لاحقاً بـ « العميل »).",
    "cgv.art2.title": "المادة 2 — الموضوع والقبول",
    "cgv.art2.p1":
      "تهدف هذه الشروط إلى تحديد كيفيات البيع بين بينغو والعميل. كل طلبية تعني القبول الكامل والتامّ لهذه الشروط، السارية على العميل اعتباراً من تأكيد الطلبية.",
    "cgv.art3.title": "المادة 3 — المنتجات",
    "cgv.art3.p1":
      "المنتجات المعروضة للبيع موصوفة بخصائصها الأساسية في بطاقات المنتج على الموقع. الصور مقدّمة بشكل توضيحي ولا تُلزم البائع.",
    "cgv.art3.p2":
      "تُباع المنتجات في حدود المخزون المتوفر. في حال نفاد المخزون بعد الطلبية، يُبلّغ العميل ويستفيد من استرداد كامل.",
    "cgv.art4.title": "المادة 4 — الأسعار",
    "cgv.art4.p1":
      "الأسعار مذكورة بالدينار الجزائري (DZD)، شاملةً جميع الرسوم، باستثناء رسوم التوصيل. تُحسب رسوم التوصيل في مرحلة تأكيد الطلبية، حسب الولاية المستلِمة.",
    "cgv.art5.title": "المادة 5 — الطلبية",
    "cgv.art5.p1":
      "تخضع كل طلبية مُقدَّمة على الموقع لتأكيد عبر الهاتف خلال 24 ساعة عمل. في حال عدم ردّ العميل بعد ثلاث محاولات اتصال، تُلغى الطلبية تلقائياً. يمكن للعميل متابعة حالة طلبيته من فضاء الزبون.",
    "cgv.art6.title": "المادة 6 — الدفع",
    "cgv.art6.p1":
      "يتمّ الدفع حصرياً عند الاستلام، نقداً لدى الناقل ZR Express. يُدفَع المبلغ كاملاً للموزّع — لا تُطبَّق أي رسوم إضافية على طريقة الدفع هذه.",
    "cgv.art7.title": "المادة 7 — التوصيل",
    "cgv.art7.p1":
      "تُشحَن الطلبيات في غضون 24 إلى 48 ساعة بعد التأكيد، عبر شريكنا اللوجستي ZR Express. تتراوح مهل التوصيل من 2 إلى 5 أيام حسب الولاية. المهل تقديرية ولا يمكن أن تترتّب عنها مسؤولية البائع في حال التأخّر.",
    "cgv.art8.title": "المادة 8 — حقّ التراجع والإرجاع",
    "cgv.art8.p1.before":
      "يستفيد العميل من مهلة 14 يوماً بعد الاستلام لإرجاع المنتجات، في تغليفها الأصلي وغير مستعملة. إجراء الإرجاع مفصّل في قسم",
    "cgv.art8.p1.em": "الإرجاع",
    "cgv.art8.p1.after": "في الموقع.",
    "cgv.art9.title": "المادة 9 — الضمان",
    "cgv.art9.p1":
      "تستفيد جميع منتجات بينغو من الضمان القانوني للمطابقة وكذلك ضمان المصنّع عندما يكون مقدّماً من قبل المُصنِّع (عادةً من سنة إلى 10 سنوات حسب العلامات).",
    "cgv.art10.title": "المادة 10 — المسؤولية",
    "cgv.art10.p1":
      "لا يمكن أن تترتّب على البائع مسؤولية الأضرار الناتجة عن استخدام غير مطابق للمنتج، ولا حالات القوّة القاهرة (كارثة طبيعية، إضراب الناقلين، عطل في الشبكة).",
    "cgv.art11.title": "المادة 11 — البيانات الشخصية",
    "cgv.art11.p1":
      "البيانات المجمَّعة ضرورية فقط لمعالجة الطلبية والتوصيل. لا تُحَوَّل أبداً إلى أطراف ثالثة باستثناء الناقل ZR Express. يستفيد العميل من حقّ الوصول إلى بياناته وتصحيحها وحذفها بالكتابة إلى contact@bingo.dz.",
    "cgv.art12.title": "المادة 12 — النزاعات والقانون المُطبَّق",
    "cgv.art12.p1":
      "تخضع هذه الشروط للقانون الجزائري. في حال نزاع، يُدعى العميل إلى الاتصال بالبائع لإيجاد حلّ ودّي مسبقاً. في غياب اتفاق، تكون محاكم سطيف وحدها مختصّة.",
    "cgv.updated.label": "آخر تحديث",
    "cgv.updated.date": "آخر مراجعة : 1 مارس 2026",

    // Footer
    "footer.boutique": "المتجر",
    "footer.help": "مساعدة",
    "footer.about": "من نحن",
    "footer.legal": "إشعارات قانونية",

    // Languages
    "lang.fr": "Français",
    "lang.ar": "العربية",
    "lang.toggle": "تغيير اللغة",

    // Home — Categories section
    "home.categories.eyebrow": "اكتشف",
    "home.categories.title": "اعثر على معداتك حسب الفئة",
    "home.categories.lead":
      "ثمانية مجالات تغطي كل نشاطات الهواء الطلق — من المخيم إلى المشي التقني.",
    "home.categories.cta": "تصفح الكتالوج كاملاً",

    // Home — Featured
    "home.featured.eyebrow": "اختيار بينغو",
    "home.featured.title": "منتجات مميزة",
    "home.featured.lead":
      "اختياراتنا الحالية — جُرّبت ميدانياً من قبل الفريق.",
    "home.featured.cta": "عرض الكل",

    // Home — New arrivals
    "home.new.eyebrow": "أضيفت حديثاً",
    "home.new.title": "وصل حديثاً",
    "home.new.lead": "آخر الإضافات إلى الكتالوج.",
    "home.new.cta": "كل المنتجات الجديدة",

    // Home — Promotions
    "home.promos.eyebrow": "اغتنم الفرصة",
    "home.promos.title": "العروض الحالية",
    "home.promos.lead":
      "تشكيلة بأسعار مخفضة، في حدود الكميات المتوفرة.",
    "home.promos.cta": "كل العروض",

    // Home — Best sellers
    "home.best.eyebrow": "الأكثر تفضيلاً لدى عملائنا",
    "home.best.title": "الأكثر مبيعاً",
    "home.best.cta": "كل المنتجات الأكثر مبيعاً",

    // Home — Editorial
    "home.editorial.eyebrow": "منهجنا",
    "home.editorial.title": "معدات صامتة وفعّالة.",
    "home.editorial.para1":
      "كل منتج يُختبر في الميدان — جرجرة، الهقار، الأوراس. نتعامل مع عدد محدود من العلامات المختارة لجودتها ومتانتها وخدمة ما بعد البيع. لا أدوات تافهة، لا تسويق فارغ.",
    "home.editorial.para2":
      "فقط ما يعمل، يُسلَّم في كل الجزائر عبر ZR Express.",
    "home.editorial.cta": "اقرأ قصتنا",

    // Home — Catalogue CTA
    "home.catalogCta.eyebrow": "كل الكتالوج",
    "home.catalogCta.title": "اكتشف كل منتجاتنا",
    "home.catalogCta.lead":
      "المزيد من المنتجات لاكتشافها — خيام، حقائب، أحذية، إضاءة وأكثر. توصيل ZR Express في كل الجزائر.",
    "home.catalogCta.cta": "عرض منتجاتنا",

    // Home — Dividers
    "home.divider.adventure": "تبدأ المغامرة حيث ينتهي الطريق.",
    "home.divider.equipment": "أفضل المعدات هي تلك التي لا تُرى.",
    "home.divider.farFromAll": "بعيداً عن كل شيء، قريباً من الجوهري.",
    "home.divider.manifesto": "بيان بينغو",

    // Hero slider
    "hero.limitedEdition": "إصدار محدود",
    "hero.prev": "العرض السابق",
    "hero.next": "العرض التالي",
    "hero.carousel": "عروض اللحظة",

    // Catalog
    "catalog.breadcrumb": "الكتالوج",
    "catalog.eyebrow": "المتجر",
    "catalog.title": "الكتالوج",
    "catalog.lead":
      "كل اختياراتنا — مُجرّبة ومنتقاة، تُسلَّم في كل الجزائر.",
    "catalog.searchPlaceholder":
      "ابحث عن خيمة، كيس نوم، كشاف…",
    "catalog.searchAria": "البحث في الكتالوج",
    "catalog.clearSearch": "مسح البحث",
    "catalog.results_one": "نتيجة",
    "catalog.results_other": "نتائج",
    "catalog.resultsFor": "عن",
    "catalog.showing": "عرض",
    "catalog.outOf": "من أصل",
    "catalog.products": "منتج",
    "catalog.emptyTitle": "لا توجد منتجات مطابقة",
    "catalog.emptyLead":
      "جرّب توسيع الفلاتر، أو عدّل البحث لاستكشاف فئة أخرى.",
    "catalog.clearFilters": "مسح الفلاتر",
    "catalog.allButton": "الكل",
    "catalog.categoryProductsCount":
      "منتج في هذه الفئة — قم بالفلترة والترتيب كما تشاء.",

    // Catalog — sort
    "catalog.sort.label": "ترتيب :",
    "catalog.sort.relevance": "الأكثر صلة",
    "catalog.sort.price_asc": "السعر تصاعدياً",
    "catalog.sort.price_desc": "السعر تنازلياً",
    "catalog.sort.newest": "الأحدث",
    "catalog.sort.popular": "الأكثر شيوعاً",
    "catalog.sort.name_asc": "الاسم أ-ي",
    "catalog.view.grid": "عرض شبكي",
    "catalog.view.list": "عرض قائمة",

    // Catalog — active filters
    "catalog.filters.active": "الفلاتر المطبّقة",
    "catalog.filters.removeAriaPrefix": "إزالة الفلتر",
    "catalog.filters.clearAll": "مسح الكل",
    "catalog.filters.inStockOnly": "متوفر فقط",
    "catalog.filters.promoOnly": "بسعر مخفّض",
    "catalog.filters.ratingMin": "وأكثر",

    // Catalog — filter sidebar
    "filters.title": "الفلاتر",
    "filters.none": "لا شيء",
    "filters.clearAll": "مسح الكل",
    "filters.categories": "الفئات",
    "filters.allCategories": "كل الفئات",
    "filters.price": "السعر",
    "filters.priceMin": "أدنى",
    "filters.priceMax": "أقصى",
    "filters.priceMinAria": "السعر الأدنى",
    "filters.priceMaxAria": "السعر الأقصى",
    "filters.brands": "العلامات",
    "filters.brandsSearch": "ابحث عن علامة…",
    "filters.brandsSelected_one": "مختارة",
    "filters.brandsSelected_other": "مختارة",
    "filters.brandsShowMore": "عرض المزيد",
    "filters.brandsShowLess": "عرض أقل",
    "filters.availability": "التوفّر",
    "filters.inStockOnly": "متوفر فقط",
    "filters.promoOnly": "منتجات مخفّضة",
    "filters.ratingMin": "الحد الأدنى للتقييم",
    "filters.ratingMinAria": "الحد الأدنى للتقييم",
    "filters.mobileLabel": "الفلاتر",

    // Pagination
    "pagination.aria": "ترقيم الصفحات",
    "pagination.prev": "الصفحة السابقة",
    "pagination.next": "الصفحة التالية",

    // Footer
    "footer.tagline":
      "معدات الهواء الطلق مختارة ومُجرّبة ميدانياً في جرجرة والأوراس والهقار. فريق صغير من سطيف، يُسلّم في كل الجزائر.",
    "footer.shippingBadge": "توصيل في كل الجزائر",
    "footer.copyright": "© 2026 بينغو — سطيف، الجزائر",
    "footer.col.boutique": "المتجر",
    "footer.col.help": "مساعدة",
    "footer.col.about": "من نحن",
    "footer.link.allCategories": "كل الفئات",
    "footer.link.newArrivals": "وصل حديثاً",
    "footer.link.promotions": "العروض",
    "footer.link.bestSellers": "الأكثر مبيعاً",
    "footer.link.delivery": "التوصيل",
    "footer.link.returns": "الإرجاع",
    "footer.link.faq": "الأسئلة الشائعة",
    "footer.link.contact": "اتصل بنا",
    "footer.link.ourStory": "قصتنا",
    "footer.link.legal": "إشعارات قانونية",
    "footer.link.cgv": "الشروط العامة",
    "footer.link.favorites": "المفضلة",
    "footer.social.fb": "بينغو على فيسبوك",
    "footer.social.ig": "بينغو على إنستغرام",
    "footer.social.wa": "بينغو على واتساب",
  },
} as const satisfies Record<Locale, Record<string, string>>;

export function translate(locale: Locale, key: TranslationKey): string {
  return dictionary[locale][key] ?? dictionary.fr[key] ?? key;
}

export { dictionary };
