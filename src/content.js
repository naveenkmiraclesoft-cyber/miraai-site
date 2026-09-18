const common = {
  languages: [
    { code: "en-US", path: "en-us", label: "English" },
    { code: "fr", path: "fr", label: "Français" },
    { code: "de", path: "de", label: "Deutsch" },
    { code: "ja", path: "ja", label: "日本語" },
    { code: "zh-Hans", path: "zh-hans", label: "简体中文" }
  ],
  productUrl: "https://www.miraclesoft.com/products/miraai",
  briefingUrl: "https://www.miraclesoft.com/contact",
  pending: [
    "Approved product evidence: customer outcomes, metrics, case-study numbers, compliance certifications, and SLA figures.",
    "Executive-briefing scheduling URL: currently https://www.miraclesoft.com/contact pending an approved scheduling link.",
    "Native-language review of fr / de / ja / zh-Hans translations and final English copy sign-off by an authorized stakeholder."
  ],
  notFound: {
    title: "miraAI — Page not found",
    eyebrow: "404",
    heading: "This page moved or never existed.",
    text: "The link may be out of date, or the page was relocated. Choose your language to return to the miraAI overview.",
    home: "Go to the miraAI overview"
  }
};

const locales = {
  "en-US": {
    draft: "",
    metaTitle: "miraAI | Govern and Scale Enterprise AI",
    metaDescription: "Connect enterprise knowledge, data, models, and workflows through one governed AI platform.",
    skip: "Skip to content", language: "Language", menu: "Menu", close: "Close", theme: "Theme", light: "Light", dark: "Dark",
    nav: ["Overview", "Business Value", "Platform", "Security", "See it live", "Use Cases", "Resources"],
    briefing: "Schedule an Executive Briefing",
    hero: {
      eyebrow: "Enterprise generative AI",
      title: "Turn enterprise AI into governed business momentum.",
      text: "miraAI connects knowledge, data, models, and agentic workflows in one enterprise platform, helping teams move from isolated experiments to controlled, reusable AI capabilities.",
      secondary: "Explore the platform",
      points: ["One orchestration layer", "Flexible deployment", "Traceable workflows"],
      visualTitle: "From enterprise question to governed action",
      visualSteps: ["Connect context", "Route intelligence", "Apply controls", "Deliver outcomes"]
    },
    value: {
      eyebrow: "Business value", title: "Built for decisions that move the enterprise forward.",
      text: "A practical foundation for leaders balancing AI velocity with integration, oversight, and long-term flexibility.",
      cards: [
        ["Accelerate delivery", "Create reusable AI capabilities across teams instead of rebuilding isolated solutions."],
        ["Connect the enterprise", "Bring business data, documents, applications, and models into coordinated workflows."],
        ["Operate with control", "Support traceability, access control, and evaluation throughout the AI lifecycle."]
      ]
    },
    platform: {
      eyebrow: "Platform", title: "Four spheres. One coordinated intelligence layer.",
      text: "Each sphere has a focused responsibility. Together, they turn enterprise context into governed workflows and useful responses.",
      steps: [
        ["01", "Core Sphere", "Connect approved language models and shape reusable prompt-driven experiences."],
        ["02", "Knowledge Sphere", "Retrieve relevant context from enterprise documents and approved knowledge sources."],
        ["03", "Data Sphere", "Translate business questions into governed access to structured enterprise data."],
        ["04", "Agent Sphere", "Coordinate tools and sphere capabilities into multi-step business workflows."]
      ]
    },
    assurance: {
      eyebrow: "Enterprise assurance", title: "Control is designed into the workflow.",
      text: "miraAI is designed to support enterprise governance requirements across access, deployment, orchestration, and operational visibility. Exact controls depend on the approved implementation scope.",
      cards: [
        ["Identity and access", "Apply role-aware access to platform capabilities and connected information."],
        ["Traceability", "Preserve workflow context for review, evaluation, and operational oversight."],
        ["Deployment choice", "Support cloud, hybrid, and on-premises implementation patterns."],
        ["Model flexibility", "Align approved models with business requirements and operating constraints."]
      ]
    },
    useCases: {
      eyebrow: "Use cases", title: "Start with the workflows that matter most.",
      text: "Explore representative ways miraAI can coordinate enterprise information, decisions, and action. Results depend on each implementation.",
      previous: "Previous use case", next: "Next use case", status: "Use case {current} of {total}", discuss: "Discuss this use case",
      slides: [
        ["Operations", "EDI exception resolution", "Bring operating procedures, error histories, and transaction context together to help teams investigate exceptions and prepare consistent responses.", ["Transaction context", "Guided diagnosis", "Response workflow"]],
        ["Public health", "Language-to-insight analytics", "Let authorized users describe reporting needs in natural language and shape governed queries, summaries, and visual outputs.", ["Natural-language query", "Structured data", "Decision support"]],
        ["Retail", "Conversational operations assistant", "Connect inventory, orders, and approved knowledge so users can find relevant operational information through one conversational experience.", ["Inventory context", "Order information", "Assisted service"]],
        ["Finance", "Accounts payable intelligence", "Combine document extraction, workflow automation, and human review to support invoice processing and exception handling.", ["Document extraction", "Human review", "Workflow integration"]]
      ]
    },
    demo: {
      eyebrow: "See it in action", title: "The platform, shown working.",
      text: "Three tasks phrased the way an operator would ask them — routed, governed, and resolved by miraAI.",
      controls: { play: "Play", pause: "Pause", live: "Live demo" },
      status: "Scenario {current} of {total}",
      hero: {
        question: "Which customers exceeded their quarterly SLA?",
        context: ["Customer contracts", "SLA terms", "Billing records"],
        result: "12 accounts flagged",
        resultText: "Report generated and distributed under a role-aware access policy."
      },
      theater: [
        ["Operations", "EDI exception resolution", "Three invoices in PO-44120 failed validation. What do I do?", ["Transaction context", "Guided diagnosis", "Response workflow"], "Resolution drafted from approved procedures, queued for human review."],
        ["Public health", "Language-to-insight analytics", "Summarize vaccination coverage by region for the last quarter.", ["Natural-language query", "Structured data", "Decision support"], "Governed query run against approved datasets; summary and chart prepared."],
        ["Finance", "Accounts payable intelligence", "Flag invoices that are missing a valid purchase order.", ["Document extraction", "Human review", "Workflow integration"], "Extraction mapped to the workflow; exceptions routed with a full audit trail."]
      ]
    },
    integrations: {
      eyebrow: "Enterprise ecosystem", title: "Designed to work across your technology landscape.",
      text: "Integration availability and implementation depth are confirmed during solution design.",
      groups: [["Cloud", "Azure · AWS · Google Cloud"], ["Business applications", "SAP · Salesforce · Microsoft 365"], ["Data and content", "BigQuery · Oracle · SharePoint"], ["Delivery", "APIs · Events · Workflow automation"]]
    },
    deployment: {
      eyebrow: "Path to value", title: "Move from priority use case to production with clarity.",
      text: "A structured engagement aligns the business case, architecture, controls, and operating model before implementation.",
      steps: [["Discover", "Prioritize outcomes and establish success measures."], ["Design", "Confirm architecture, data, controls, and responsibilities."], ["Deliver", "Build, validate, and integrate the selected workflow."], ["Operate", "Evaluate performance and expand reusable capabilities."]]
    },
    resources: {
      eyebrow: "Executive resources", title: "Give every stakeholder a clear path to evaluate miraAI.",
      cards: [["Executive overview", "Review the platform vision and business-value framework."], ["Architecture discussion", "Evaluate integration, deployment, and operating-model fit."], ["Security review", "Discuss controls, data handling, and implementation boundaries."]],
      action: "Request this resource"
    },
    faq: {
      eyebrow: "Frequently asked questions", title: "Answers for enterprise evaluation.",
      items: [
        ["What is miraAI?", "miraAI is Miracle Software Systems' enterprise generative AI platform for coordinating knowledge, data, models, and agentic workflows."],
        ["Can miraAI work with our existing environment?", "miraAI is designed for integration-led delivery. Supported systems, connector depth, and implementation responsibilities are confirmed during solution design."],
        ["Where can miraAI be deployed?", "The platform supports cloud, hybrid, and on-premises implementation patterns. The final architecture depends on business, security, and infrastructure requirements."],
        ["How is governance addressed?", "The platform is designed to support role-aware access, workflow traceability, evaluation, and deployment controls. Specific controls are documented for each implementation."],
        ["How do we identify the right first use case?", "An executive briefing and discovery process can assess business value, data readiness, integration complexity, risk, and measurable success criteria."]
      ]
    },
    cta: { eyebrow: "Executive briefing", title: "Identify where governed AI can create meaningful business value.", text: "Use a focused briefing to discuss priority workflows, architecture fit, governance expectations, and practical next steps.", note: "Miraclesoft will follow up to coordinate timing and attendees." },
    footer: { text: "Enterprise technology and transformation services for the digital age.", company: "Company", product: "Product", connect: "Connect", privacy: "Privacy", rights: "All rights reserved." }
  },
  fr: {
    draft: "Traduction préliminaire — validation par un réviseur natif requise avant publication.",
    metaTitle: "miraAI | Gouverner et déployer l'IA d'entreprise", metaDescription: "Connectez connaissances, données, modèles et workflows dans une plateforme d'IA gouvernée.",
    skip: "Aller au contenu", language: "Langue", menu: "Menu", close: "Fermer", theme: "Thème", light: "Clair", dark: "Sombre",
    nav: ["Aperçu", "Valeur métier", "Plateforme", "Sécurité", "Voir en action", "Cas d'usage", "Ressources"], briefing: "Planifier une réunion de direction",
    hero: { eyebrow: "IA générative d'entreprise", title: "Transformez l'IA d'entreprise en dynamique métier gouvernée.", text: "miraAI relie connaissances, données, modèles et workflows agentiques dans une plateforme d'entreprise unique, pour passer d'expérimentations isolées à des capacités d'IA contrôlées et réutilisables.", secondary: "Explorer la plateforme", points: ["Une couche d'orchestration", "Déploiement flexible", "Workflows traçables"], visualTitle: "De la question métier à l'action gouvernée", visualSteps: ["Connecter le contexte", "Orchestrer l'intelligence", "Appliquer les contrôles", "Produire des résultats"] },
    value: { eyebrow: "Valeur métier", title: "Conçue pour les décisions qui font avancer l'entreprise.", text: "Une base concrète pour concilier vitesse, intégration, supervision et flexibilité.", cards: [["Accélérer la livraison", "Créez des capacités d'IA réutilisables au lieu de multiplier les solutions isolées."], ["Connecter l'entreprise", "Coordonnez données, documents, applications et modèles dans des workflows cohérents."], ["Opérer avec contrôle", "Soutenez la traçabilité, les accès et l'évaluation tout au long du cycle de vie."]] },
    platform: { eyebrow: "Plateforme", title: "Quatre sphères. Une couche d'intelligence coordonnée.", text: "Chaque sphère joue un rôle précis pour transformer le contexte métier en workflows gouvernés.", steps: [["01", "Core Sphere", "Connecte les modèles approuvés et structure des expériences réutilisables."], ["02", "Knowledge Sphere", "Récupère le contexte pertinent dans les documents et sources approuvées."], ["03", "Data Sphere", "Transforme les questions métier en accès gouverné aux données structurées."], ["04", "Agent Sphere", "Coordonne outils et capacités dans des workflows métier en plusieurs étapes."]] },
    assurance: { eyebrow: "Assurance d'entreprise", title: "Le contrôle est intégré au workflow.", text: "miraAI est conçue pour soutenir les exigences de gouvernance en matière d'accès, de déploiement et de visibilité opérationnelle. Les contrôles exacts dépendent du périmètre validé.", cards: [["Identité et accès", "Appliquez des accès adaptés aux rôles."], ["Traçabilité", "Conservez le contexte pour la revue et l'évaluation."], ["Choix de déploiement", "Cloud, hybride et sur site."], ["Flexibilité des modèles", "Alignez les modèles approuvés sur les exigences métier."]] },
    useCases: { eyebrow: "Cas d'usage", title: "Commencez par les workflows les plus importants.", text: "Découvrez des exemples représentatifs. Les résultats dépendent de chaque mise en œuvre.", previous: "Cas précédent", next: "Cas suivant", status: "Cas {current} sur {total}", discuss: "Discuter de ce cas", slides: [["Opérations", "Résolution des exceptions EDI", "Réunissez procédures, historiques d'erreurs et contexte transactionnel pour faciliter l'investigation.", ["Contexte transactionnel", "Diagnostic guidé", "Workflow de réponse"]], ["Santé publique", "Analytique en langage naturel", "Permettez aux utilisateurs autorisés de formuler leurs besoins et de produire des requêtes et synthèses gouvernées.", ["Langage naturel", "Données structurées", "Aide à la décision"]], ["Commerce", "Assistant conversationnel", "Connectez stocks, commandes et connaissances approuvées dans une expérience conversationnelle.", ["Stocks", "Commandes", "Service assisté"]], ["Finance", "Intelligence des comptes fournisseurs", "Combinez extraction documentaire, automatisation et revue humaine.", ["Extraction", "Revue humaine", "Intégration"]]] },
    demo: { eyebrow: "Voir le produit en action", title: "La plateforme, montrée en situation.", text: "Trois tâches formulées comme un opérateur les poserait — routées, gouvernées et résolues par miraAI.", controls: { play: "Lecture", pause: "Pause", live: "Démo en direct" }, status: "Scénario {current} sur {total}", hero: { question: "Quels comptes clients ont dépassé leur SLA trimestriel ?", context: ["Contrats clients", "Termes SLA", "Facturation"], result: "12 comptes signalés", resultText: "Rapport généré et diffusé selon une politique d'accès par rôle." }, theater: [["Opérations", "Résolution des exceptions EDI", "Trois factures du PO-44120 ont échoué à la validation. Que dois-je faire ?", ["Contexte transactionnel", "Diagnostic guidé", "Workflow de réponse"], "Une proposition issue des procédures approuvées est prête pour revue humaine."], ["Santé publique", "Analytique en langage naturel", "Résumez la couverture vaccinale par région pour le dernier trimestre.", ["Langage naturel", "Données structurées", "Aide à la décision"], "Requête gouvernée exécutée sur les jeux de données approuvés ; synthèse et graphique préparés."], ["Finance", "Intelligence des comptes fournisseurs", "Signalez les factures sans bon de commande valide.", ["Extraction", "Revue humaine", "Intégration"], "Extraction reliée au workflow ; exceptions routées avec une piste d'audit complète."]] },
    integrations: { eyebrow: "Écosystème", title: "Conçue pour votre paysage technologique.", text: "La disponibilité et la profondeur des intégrations sont confirmées lors de la conception.", groups: [["Cloud", "Azure · AWS · Google Cloud"], ["Applications métier", "SAP · Salesforce · Microsoft 365"], ["Données et contenu", "BigQuery · Oracle · SharePoint"], ["Livraison", "API · Événements · Automatisation"]] },
    deployment: { eyebrow: "Chemin vers la valeur", title: "Passez du cas prioritaire à la production avec clarté.", text: "Une démarche structurée aligne valeur, architecture, contrôles et modèle opérationnel.", steps: [["Découvrir", "Prioriser les résultats et définir la réussite."], ["Concevoir", "Confirmer architecture, données et responsabilités."], ["Livrer", "Construire, valider et intégrer le workflow."], ["Opérer", "Évaluer et étendre les capacités réutilisables."]] },
    resources: { eyebrow: "Ressources", title: "Un parcours d'évaluation clair pour chaque partie prenante.", cards: [["Vue d'ensemble", "Vision de la plateforme et cadre de valeur."], ["Discussion architecture", "Intégration, déploiement et modèle opérationnel."], ["Revue sécurité", "Contrôles, données et périmètre de mise en œuvre."]], action: "Demander cette ressource" },
    faq: { eyebrow: "Questions fréquentes", title: "Réponses pour l'évaluation d'entreprise.", items: [["Qu'est-ce que miraAI ?", "miraAI est la plateforme d'IA générative de Miracle Software Systems pour coordonner connaissances, données, modèles et workflows agentiques."], ["miraAI peut-elle fonctionner avec notre environnement ?", "La compatibilité et les responsabilités sont confirmées pendant la conception de la solution."], ["Où miraAI peut-elle être déployée ?", "La plateforme prend en charge des modèles cloud, hybrides et sur site."], ["Comment la gouvernance est-elle traitée ?", "La plateforme est conçue pour soutenir les accès par rôle, la traçabilité, l'évaluation et les contrôles de déploiement."], ["Comment choisir le premier cas d'usage ?", "Une réunion de direction évalue valeur, données, intégration, risques et critères de réussite."]] },
    cta: { eyebrow: "Réunion de direction", title: "Identifiez où l'IA gouvernée peut créer une valeur réelle.", text: "Échangez sur les workflows prioritaires, l'architecture, la gouvernance et les prochaines étapes.", note: "Miraclesoft vous contactera pour convenir du calendrier et des participants." },
    footer: { text: "Services technologiques et de transformation pour l'ère numérique.", company: "Entreprise", product: "Produit", connect: "Contact", privacy: "Confidentialité", rights: "Tous droits réservés." }
  }
};

function derive(base, overrides) {
  return Object.assign({}, base, overrides);
}

locales.de = derive(locales["en-US"], {
  draft: "Vorläufige Übersetzung — vor der Veröffentlichung ist eine Prüfung durch Muttersprachler erforderlich.",
  metaTitle: "miraAI | Unternehmens-KI steuern und skalieren", metaDescription: "Verbinden Sie Wissen, Daten, Modelle und Workflows in einer gesteuerten KI-Plattform.",
  skip: "Zum Inhalt", language: "Sprache", menu: "Menü", close: "Schließen", theme: "Darstellung", light: "Hell", dark: "Dunkel",
  nav: ["Überblick", "Geschäftswert", "Plattform", "Sicherheit", "Live erleben", "Anwendungsfälle", "Ressourcen"], briefing: "Executive Briefing vereinbaren",
  hero: { eyebrow: "Generative KI für Unternehmen", title: "Machen Sie Unternehmens-KI zu steuerbarer Geschäftsdynamik.", text: "miraAI verbindet Wissen, Daten, Modelle und agentische Workflows auf einer Plattform und unterstützt den Weg von isolierten Experimenten zu kontrollierten, wiederverwendbaren KI-Fähigkeiten.", secondary: "Plattform erkunden", points: ["Eine Orchestrierungsebene", "Flexible Bereitstellung", "Nachvollziehbare Workflows"], visualTitle: "Von der Unternehmensfrage zur gesteuerten Aktion", visualSteps: ["Kontext verbinden", "Intelligenz steuern", "Kontrollen anwenden", "Ergebnisse liefern"] },
  value: { eyebrow: "Geschäftswert", title: "Für Entscheidungen, die Unternehmen voranbringen.", text: "Eine praktische Grundlage für Geschwindigkeit, Integration, Kontrolle und langfristige Flexibilität.", cards: [["Bereitstellung beschleunigen", "Wiederverwendbare KI-Fähigkeiten statt isolierter Einzellösungen."], ["Unternehmen verbinden", "Daten, Dokumente, Anwendungen und Modelle koordinieren."], ["Kontrolliert betreiben", "Nachvollziehbarkeit, Zugriff und Evaluierung unterstützen."]] },
  platform: { eyebrow: "Plattform", title: "Vier Sphären. Eine koordinierte Intelligenzebene.", text: "Jede Sphäre erfüllt eine klare Aufgabe und trägt zu gesteuerten Workflows bei.", steps: [["01", "Core Sphere", "Verbindet freigegebene Modelle und schafft wiederverwendbare Erlebnisse."], ["02", "Knowledge Sphere", "Ruft relevanten Kontext aus freigegebenen Wissensquellen ab."], ["03", "Data Sphere", "Übersetzt Geschäftsfragen in gesteuerten Datenzugriff."], ["04", "Agent Sphere", "Koordiniert Werkzeuge und Fähigkeiten in mehrstufigen Workflows."]] },
  assurance: { eyebrow: "Unternehmenskontrolle", title: "Kontrolle ist in den Workflow integriert.", text: "miraAI unterstützt Governance-Anforderungen bei Zugriff, Bereitstellung und betrieblicher Transparenz. Die genauen Kontrollen richten sich nach dem freigegebenen Umfang.", cards: [["Identität und Zugriff", "Rollenbasierter Zugriff auf Plattform und Informationen."], ["Nachvollziehbarkeit", "Kontext für Prüfung und Evaluierung bewahren."], ["Bereitstellungswahl", "Cloud-, Hybrid- und On-Premises-Muster."], ["Modellflexibilität", "Freigegebene Modelle an Anforderungen ausrichten."]] },
  useCases: { eyebrow: "Anwendungsfälle", title: "Beginnen Sie mit den wichtigsten Workflows.", text: "Repräsentative Einsatzmöglichkeiten; Ergebnisse hängen von der Implementierung ab.", previous: "Vorheriger Fall", next: "Nächster Fall", status: "Anwendungsfall {current} von {total}", discuss: "Diesen Fall besprechen", slides: [["Betrieb", "EDI-Ausnahmen bearbeiten", "Verfahren, Fehlerhistorien und Transaktionskontext für konsistente Untersuchungen verbinden.", ["Transaktionskontext", "Geführte Diagnose", "Antwort-Workflow"]], ["Gesundheitswesen", "Analysen per Sprache", "Autorisierte Nutzer formulieren Anforderungen in natürlicher Sprache und erstellen gesteuerte Abfragen.", ["Natürliche Sprache", "Strukturierte Daten", "Entscheidungshilfe"]], ["Handel", "Konversationeller Assistent", "Bestände, Aufträge und freigegebenes Wissen in einem Dialogzugang verbinden.", ["Bestände", "Aufträge", "Assistierter Service"]], ["Finanzen", "Kreditoren-Intelligenz", "Dokumentenerfassung, Automatisierung und menschliche Prüfung kombinieren.", ["Extraktion", "Menschliche Prüfung", "Integration"]]] },
  demo: { eyebrow: "Live erleben", title: "Die Plattform, in Aktion gezeigt.", text: "Drei Aufgaben, formuliert wie ein Anwender sie stellt — gelenkt, gesteuert und gelöst von miraAI.", controls: { play: "Abspielen", pause: "Pausieren", live: "Live-Demo" }, status: "Szenario {current} von {total}", hero: { question: "Welche Kunden haben den Quartals-SLA überschritten?", context: ["Kundenverträge", "SLA-Bedingungen", "Rechnungsdaten"], result: "12 Konten markiert", resultText: "Bericht erstellt und gemäß rollenbasierter Zugriffspolitik verteilt." }, theater: [["Betrieb", "EDI-Ausnahmen bearbeiten", "Drei Rechnungen in PO-44120 haben die Validierung nicht bestanden. Was soll ich tun?", ["Transaktionskontext", "Geführte Diagnose", "Antwort-Workflow"], "Vorschlag aus freigegebenen Verfahren erstellt und zur menschlichen Prüfung eingereiht."], ["Gesundheitswesen", "Analysen per Sprache", "Fassen Sie die Impfabdeckung nach Region für das letzte Quartal zusammen.", ["Natürliche Sprache", "Strukturierte Daten", "Entscheidungshilfe"], "Gesteuerte Abfrage auf freigegebenen Daten ausgeführt; Zusammenfassung und Diagramm erstellt."], ["Finanzen", "Kreditoren-Intelligenz", "Markieren Sie Rechnungen ohne gültige Bestellung.", ["Extraktion", "Menschliche Prüfung", "Integration"], "Extraktion an den Workflow angebunden; Ausnahmen mit vollständigem Prüfpfad weitergeleitet."]] },
  integrations: { eyebrow: "Ökosystem", title: "Für Ihre Technologielandschaft entwickelt.", text: "Verfügbarkeit und Tiefe werden im Lösungsdesign bestätigt.", groups: [["Cloud", "Azure · AWS · Google Cloud"], ["Geschäftsanwendungen", "SAP · Salesforce · Microsoft 365"], ["Daten und Inhalte", "BigQuery · Oracle · SharePoint"], ["Bereitstellung", "APIs · Events · Automatisierung"]] },
  deployment: { eyebrow: "Weg zum Mehrwert", title: "Klar vom priorisierten Fall zur Produktion.", text: "Ein strukturierter Ansatz stimmt Nutzen, Architektur, Kontrollen und Betriebsmodell ab.", steps: [["Entdecken", "Ergebnisse priorisieren und Erfolg definieren."], ["Entwerfen", "Architektur, Daten und Verantwortung bestätigen."], ["Umsetzen", "Workflow erstellen, validieren und integrieren."], ["Betreiben", "Leistung bewerten und Fähigkeiten erweitern."]] },
  resources: { eyebrow: "Ressourcen", title: "Ein klarer Bewertungsweg für alle Stakeholder.", cards: [["Executive Overview", "Plattformvision und Wertmodell."], ["Architekturgespräch", "Integration, Bereitstellung und Betrieb."], ["Sicherheitsprüfung", "Kontrollen, Daten und Implementierungsgrenzen."]], action: "Ressource anfordern" },
  faq: { eyebrow: "Häufige Fragen", title: "Antworten für die Unternehmensbewertung.", items: [["Was ist miraAI?", "miraAI ist die Plattform von Miracle Software Systems zur Koordination von Wissen, Daten, Modellen und agentischen Workflows."], ["Funktioniert miraAI mit unserer Umgebung?", "Unterstützte Systeme und Verantwortlichkeiten werden im Lösungsdesign bestätigt."], ["Wo kann miraAI bereitgestellt werden?", "Die Plattform unterstützt Cloud-, Hybrid- und On-Premises-Muster."], ["Wie wird Governance behandelt?", "Die Plattform unterstützt rollenbasierten Zugriff, Nachvollziehbarkeit, Evaluierung und Bereitstellungskontrollen."], ["Wie wählen wir den ersten Anwendungsfall?", "Ein Executive Briefing bewertet Nutzen, Datenreife, Integration, Risiko und Erfolgskriterien."]] },
  cta: { eyebrow: "Executive Briefing", title: "Ermitteln Sie, wo gesteuerte KI echten Geschäftswert schafft.", text: "Besprechen Sie priorisierte Workflows, Architektur, Governance und nächste Schritte.", note: "Miraclesoft meldet sich zur Abstimmung von Termin und Teilnehmern." },
  footer: { text: "Technologie- und Transformationsservices für das digitale Zeitalter.", company: "Unternehmen", product: "Produkt", connect: "Kontakt", privacy: "Datenschutz", rights: "Alle Rechte vorbehalten." }
});

locales.ja = derive(locales["en-US"], {
  draft: "翻訳ドラフトです。公開前にネイティブレビューが必要です。",
  metaTitle: "miraAI | エンタープライズAIの統制と拡張", metaDescription: "企業の知識、データ、モデル、ワークフローを統制されたAI基盤で接続します。",
  skip: "本文へ移動", language: "言語", menu: "メニュー", close: "閉じる", theme: "テーマ", light: "ライト", dark: "ダーク",
  nav: ["概要", "ビジネス価値", "プラットフォーム", "セキュリティ", "デモを見る", "ユースケース", "資料"], briefing: "エグゼクティブ・ブリーフィングを予約",
  hero: { eyebrow: "エンタープライズ生成AI", title: "企業AIを、統制されたビジネス推進力へ。", text: "miraAIは、知識、データ、モデル、エージェント型ワークフローを一つの企業基盤で接続し、個別実験から統制された再利用可能なAI能力への移行を支援します。", secondary: "プラットフォームを見る", points: ["単一のオーケストレーション層", "柔軟な導入", "追跡可能なワークフロー"], visualTitle: "企業の問いから統制されたアクションへ", visualSteps: ["コンテキスト接続", "知能の振り分け", "統制の適用", "成果の提供"] },
  value: { eyebrow: "ビジネス価値", title: "企業を前進させる意思決定のために。", text: "AIのスピード、統合、監督、長期的な柔軟性を両立する実践的な基盤です。", cards: [["提供を加速", "個別開発ではなく、チーム間で再利用できるAI能力を構築します。"], ["企業を接続", "データ、文書、アプリケーション、モデルを連携します。"], ["統制して運用", "AIライフサイクル全体の追跡、アクセス、評価を支援します。"]] },
  platform: { eyebrow: "プラットフォーム", title: "4つのSphere。1つの統合インテリジェンス層。", text: "各Sphereが明確な役割を担い、企業コンテキストを統制されたワークフローへ変換します。", steps: [["01", "Core Sphere", "承認済みモデルを接続し、再利用可能な体験を構築します。"], ["02", "Knowledge Sphere", "承認済み文書や知識源から関連コンテキストを取得します。"], ["03", "Data Sphere", "ビジネス上の問いを統制された構造化データアクセスへ変換します。"], ["04", "Agent Sphere", "ツールと各Sphereを複数段階の業務フローに統合します。"]] },
  assurance: { eyebrow: "エンタープライズ統制", title: "統制をワークフローに組み込みます。", text: "miraAIは、アクセス、導入、オーケストレーション、運用可視性に関する企業要件を支援する設計です。具体的な統制は承認された実装範囲によります。", cards: [["IDとアクセス", "役割に応じたアクセスを適用します。"], ["追跡可能性", "レビューと評価のためにワークフローの文脈を保持します。"], ["導入の選択肢", "クラウド、ハイブリッド、オンプレミスに対応します。"], ["モデルの柔軟性", "承認済みモデルを事業要件に合わせます。"]] },
  useCases: { eyebrow: "ユースケース", title: "重要なワークフローから始める。", text: "代表的な活用方法です。成果は各実装条件によって異なります。", previous: "前のユースケース", next: "次のユースケース", status: "{total}件中{current}件目", discuss: "このユースケースを相談", slides: [["オペレーション", "EDI例外対応", "手順、エラー履歴、取引コンテキストを結び、調査と一貫した対応を支援します。", ["取引コンテキスト", "ガイド付き診断", "対応フロー"]], ["公衆衛生", "自然言語分析", "権限を持つ利用者が自然言語で要件を示し、統制されたクエリや要約を作成します。", ["自然言語", "構造化データ", "意思決定支援"]], ["小売", "対話型業務アシスタント", "在庫、注文、承認済み知識を一つの対話体験で接続します。", ["在庫情報", "注文情報", "支援サービス"]], ["財務", "買掛金インテリジェンス", "文書抽出、自動化、人による確認を組み合わせます。", ["文書抽出", "人による確認", "業務統合"]]] },
  demo: { eyebrow: "実際の動作を見る", title: "実際に動くプラットフォーム。", text: "オペレーターの言葉で表現した3つのタスクを、miraAIが振り分け、統制し、解決します。", controls: { play: "再生", pause: "一時停止", live: "ライブデモ" }, status: "{total}件中{current}件目", hero: { question: "四半期SLAを超過した顧客は？", context: ["顧客契約", "SLA条項", "請求記録"], result: "12件のアカウントを検出", resultText: "役割に応じたアクセス権限によりレポートを作成・配布しました。" }, theater: [["オペレーション", "EDI例外対応", "PO-44120の3件の請求書が検証に失敗しました。どうすればよいですか？", ["取引コンテキスト", "ガイド付き診断", "対応フロー"], "承認済み手順に基づく対応案を作成し、人間によるレビュー待ちとしました。"], ["公衆衛生", "自然言語分析", "直近四半期の地域別ワクチン接種率をまとめてください。", ["自然言語", "構造化データ", "意思決定支援"], "承認済みデータセットに対して統制されたクエリを実行し、概要とグラフを作成しました。"], ["財務", "買掛金インテリジェンス", "有効な発注書がない請求書を検出してください。", ["文書抽出", "人による確認", "業務統合"], "抽出内容をワークフローに接続し、例外を完全な監査記録付きで振り分けました。"]] },
  integrations: { eyebrow: "企業エコシステム", title: "既存のテクノロジー環境との連携を前提に設計。", text: "連携の可否と範囲はソリューション設計時に確認します。", groups: [["クラウド", "Azure · AWS · Google Cloud"], ["業務アプリ", "SAP · Salesforce · Microsoft 365"], ["データとコンテンツ", "BigQuery · Oracle · SharePoint"], ["デリバリー", "API · イベント · 自動化"]] },
  deployment: { eyebrow: "価値実現への道筋", title: "優先ユースケースから本番まで明確に進める。", text: "構造化された進め方で、事業価値、アーキテクチャ、統制、運用モデルを整合させます。", steps: [["発見", "成果を優先し、成功指標を定義します。"], ["設計", "アーキテクチャ、データ、責任を確認します。"], ["実装", "ワークフローを構築、検証、統合します。"], ["運用", "性能を評価し、再利用能力を拡張します。"]] },
  resources: { eyebrow: "経営層向け資料", title: "各ステークホルダーに明確な評価経路を。", cards: [["エグゼクティブ概要", "プラットフォーム構想と価値の枠組み。"], ["アーキテクチャ相談", "統合、導入、運用モデルを評価。"], ["セキュリティレビュー", "統制、データ、実装範囲を確認。"]], action: "資料を依頼" },
  faq: { eyebrow: "よくある質問", title: "企業評価のための回答。", items: [["miraAIとは何ですか？", "miraAIは、知識、データ、モデル、エージェント型ワークフローを統合するMiracle Software Systemsの企業向け生成AIプラットフォームです。"], ["既存環境と連携できますか？", "対応システム、連携範囲、責任分担はソリューション設計時に確認します。"], ["どこに導入できますか？", "クラウド、ハイブリッド、オンプレミスの実装パターンに対応します。"], ["ガバナンスにはどう対応しますか？", "役割別アクセス、追跡、評価、導入統制を支援する設計です。"], ["最初のユースケースはどう選びますか？", "ブリーフィングで価値、データ準備、統合、リスク、成功指標を評価します。"]] },
  cta: { eyebrow: "エグゼクティブ・ブリーフィング", title: "統制されたAIが実質的な価値を生む領域を特定します。", text: "優先ワークフロー、アーキテクチャ適合性、ガバナンス、次のステップを議論します。", note: "Miraclesoftより日程と参加者についてご連絡します。" },
  footer: { text: "デジタル時代の企業テクノロジーと変革サービス。", company: "企業情報", product: "製品", connect: "お問い合わせ", privacy: "プライバシー", rights: "無断転載を禁じます。" }
});

locales["zh-Hans"] = derive(locales["en-US"], {
  draft: "翻译草稿——发布前需要母语审校。",
  metaTitle: "miraAI | 治理并扩展企业人工智能", metaDescription: "通过统一治理的人工智能平台连接企业知识、数据、模型和工作流。",
  skip: "跳至主要内容", language: "语言", menu: "菜单", close: "关闭", theme: "主题", light: "浅色", dark: "深色",
  nav: ["概览", "业务价值", "平台", "安全", "在线演示", "应用场景", "资源"], briefing: "预约高管简报",
  hero: { eyebrow: "企业生成式人工智能", title: "让企业人工智能成为可治理的业务动力。", text: "miraAI在一个企业平台中连接知识、数据、模型和智能体工作流，帮助团队从孤立试验迈向可控、可复用的人工智能能力。", secondary: "探索平台", points: ["统一编排层", "灵活部署", "可追溯工作流"], visualTitle: "从企业问题到可治理行动", visualSteps: ["连接上下文", "编排智能", "应用控制", "交付成果"] },
  value: { eyebrow: "业务价值", title: "为推动企业发展的决策而构建。", text: "帮助领导者兼顾人工智能速度、集成、监督和长期灵活性。", cards: [["加速交付", "构建可跨团队复用的人工智能能力，避免重复开发孤立方案。"], ["连接企业", "将业务数据、文档、应用和模型纳入协调工作流。"], ["可控运营", "支持整个人工智能生命周期中的追溯、访问控制和评估。"]] },
  platform: { eyebrow: "平台", title: "四个Sphere，一个协调的智能层。", text: "每个Sphere承担明确职责，共同将企业上下文转化为可治理的工作流。", steps: [["01", "Core Sphere", "连接经批准的模型并构建可复用体验。"], ["02", "Knowledge Sphere", "从企业文档和批准的知识源中检索相关上下文。"], ["03", "Data Sphere", "将业务问题转化为对结构化数据的治理访问。"], ["04", "Agent Sphere", "将工具和Sphere能力协调为多步骤业务工作流。"]] },
  assurance: { eyebrow: "企业保障", title: "将控制设计到工作流中。", text: "miraAI旨在支持访问、部署、编排和运营可见性方面的企业治理要求。具体控制取决于批准的实施范围。", cards: [["身份与访问", "对平台能力和信息应用基于角色的访问。"], ["可追溯性", "保留工作流上下文以便审核和评估。"], ["部署选择", "支持云、混合和本地部署模式。"], ["模型灵活性", "使批准的模型符合业务要求。"]] },
  useCases: { eyebrow: "应用场景", title: "从最重要的工作流开始。", text: "探索miraAI协调企业信息、决策和行动的代表性方式。结果取决于具体实施。", previous: "上一个场景", next: "下一个场景", status: "第{current}个，共{total}个", discuss: "讨论此场景", slides: [["运营", "EDI异常处理", "结合操作流程、错误历史和交易上下文，帮助团队调查异常并准备一致响应。", ["交易上下文", "引导诊断", "响应工作流"]], ["公共卫生", "自然语言分析", "授权用户可用自然语言描述报告需求，并生成受治理的查询和摘要。", ["自然语言查询", "结构化数据", "决策支持"]], ["零售", "对话式运营助手", "连接库存、订单和批准的知识，通过统一对话体验提供运营信息。", ["库存上下文", "订单信息", "辅助服务"]], ["财务", "应付账款智能", "结合文档提取、工作流自动化和人工审核，支持发票处理。", ["文档提取", "人工审核", "工作流集成"]]] },
  demo: { eyebrow: "在线演示", title: "正在运行中的平台。", text: "以操作员口吻提出的三个任务——由miraAI进行调度、治理和解决。", controls: { play: "播放", pause: "暂停", live: "实时演示" }, status: "第{current}个，共{total}个", hero: { question: "哪些客户超出了季度服务水平协议？", context: ["客户合同", "SLA条款", "账单记录"], result: "标记12个账户", resultText: "已按角色感知的访问策略生成并分发报告。" }, theater: [["运营", "EDI异常处理", "PO-44120中的三张发票未通过验证。我应该怎么做？", ["交易上下文", "引导诊断", "响应工作流"], "已根据批准的程序起草处理方案，并排队等待人工审核。"], ["公共卫生", "自然语言分析", "请总结上一个季度各地区的疫苗接种覆盖率。", ["自然语言查询", "结构化数据", "决策支持"], "已对批准的数据集执行受治理查询，并生成了摘要和图表。"], ["财务", "应付账款智能", "标记缺少有效采购订单的发票。", ["文档提取", "人工审核", "工作流集成"], "已将提取内容映射到工作流，并将异常情况连同完整审计跟踪一起路由。"]] },
  integrations: { eyebrow: "企业生态", title: "面向您的技术环境而设计。", text: "集成可用性和实施深度将在解决方案设计阶段确认。", groups: [["云", "Azure · AWS · Google Cloud"], ["业务应用", "SAP · Salesforce · Microsoft 365"], ["数据与内容", "BigQuery · Oracle · SharePoint"], ["交付", "API · 事件 · 工作流自动化"]] },
  deployment: { eyebrow: "价值路径", title: "清晰地从优先场景走向生产。", text: "结构化合作在实施前协调业务价值、架构、控制和运营模式。", steps: [["发现", "确定成果优先级和成功标准。"], ["设计", "确认架构、数据、控制和职责。"], ["交付", "构建、验证并集成所选工作流。"], ["运营", "评估表现并扩展可复用能力。"]] },
  resources: { eyebrow: "高管资源", title: "为每位利益相关者提供清晰的评估路径。", cards: [["高管概览", "了解平台愿景和业务价值框架。"], ["架构讨论", "评估集成、部署和运营模式。"], ["安全审查", "讨论控制、数据处理和实施边界。"]], action: "申请此资源" },
  faq: { eyebrow: "常见问题", title: "企业评估所需的答案。", items: [["什么是miraAI？", "miraAI是Miracle Software Systems用于协调知识、数据、模型和智能体工作流的企业生成式人工智能平台。"], ["miraAI能否与现有环境协同？", "支持的系统、连接深度和实施职责将在解决方案设计阶段确认。"], ["miraAI可以部署在哪里？", "平台支持云、混合和本地部署模式。"], ["如何处理治理？", "平台旨在支持基于角色的访问、工作流追溯、评估和部署控制。"], ["如何确定第一个应用场景？", "高管简报和发现流程可评估业务价值、数据准备度、集成复杂度、风险和成功标准。"]] },
  cta: { eyebrow: "高管简报", title: "确定可治理人工智能能够创造实际业务价值的领域。", text: "讨论优先工作流、架构适配、治理要求和切实的下一步。", note: "Miraclesoft将联系您协调时间和参会人员。" },
  footer: { text: "面向数字时代的企业技术与转型服务。", company: "公司", product: "产品", connect: "联系", privacy: "隐私", rights: "保留所有权利。" }
});

module.exports = { common, locales };
