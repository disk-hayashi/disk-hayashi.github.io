const site = {
  baseUrl: "https://disk-hayashi.github.io",

  author: {
    en: "Daisuke Hayashi",
    ja: "林 大介",
  },

  affiliation: {
    en: "Kyoto University / Hitachi, Ltd.",
    ja: "京都大学 / 株式会社日立製作所",
  },

  focusAreas: {
    en: ["Computer Vision", "NLP", "Machine Learning", "Commercialization", "Patent Creation", "R&D"],
    ja: ["Computer Vision", "NLP", "機械学習", "製品化", "特許創出", "研究開発"],
  },

  pages: [
    {
      key: "home",
      path: { en: "/", ja: "/ja/" },
      nav: { en: "Overview", ja: "概要" },
      title: { en: "Daisuke Hayashi | AI Researcher", ja: "林 大介 | AI研究者" },
      heading: { en: "AI Researcher / Doctoral Student", ja: "AI研究者 / 博士後期課程" },
      description: {
        en: "Specializing in Computer Vision, NLP, and Machine Learning, bridging research, product development, commercialization, and patent creation.",
        ja: "Computer Vision・NLP・機械学習を専門に、研究開発から製品化・特許創出まで一貫して推進。",
      },
      sections: {
        en: [
          ["Research", "Transformer-based object detection for satellite and remote-sensing imagery."],
          ["Projects", "Applied AI projects connected to real-world product value."],
          ["Patents", "Creation of intellectual property through practical AI system development."],
        ],
        ja: [
          ["研究", "衛星画像・リモートセンシング画像におけるTransformerベース物体検出。"],
          ["プロジェクト", "実製品価値につながるAI技術の研究開発。"],
          ["特許", "実用AIシステム開発を通じた知的財産の創出。"],
        ],
      },
    },
    {
      key: "projects",
      path: { en: "/projects/", ja: "/ja/projects/" },
      nav: { en: "Projects", ja: "プロジェクト" },
      title: { en: "Projects | Daisuke Hayashi", ja: "プロジェクト | 林 大介" },
      heading: { en: "Projects", ja: "プロジェクト" },
      description: {
        en: "Selected AI projects connecting research, product development, and commercialization.",
        ja: "研究開発・製品化につながるAIプロジェクト。",
      },
      sections: {
        en: [
          ["AI for Product Commercialization", "Development of AI technologies connected to real-world product value."],
          ["Food Recognition and Recipe Support", "AI systems supporting ingredient understanding and user experience improvement."],
          ["Medical AI Research", "AI analysis and visualization for medical imaging contexts."],
        ],
        ja: [
          ["製品化AI", "実製品価値につながるAI技術の研究開発。"],
          ["食材認識・レシピ支援", "食材理解とユーザー体験向上を支援するAIシステム。"],
          ["医療AI研究", "医用画像領域におけるAI解析・可視化研究。"],
        ],
      },
    },
    {
      key: "patents",
      path: { en: "/patents/", ja: "/ja/patents/" },
      nav: { en: "Patents", ja: "特許" },
      title: { en: "Patents | Daisuke Hayashi", ja: "特許 | 林 大介" },
      heading: { en: "Patents", ja: "特許" },
      description: {
        en: "Patents and intellectual property related to AI research and product development.",
        ja: "AI研究開発・製品化に関連する特許・知的財産。",
      },
      sections: {
        en: [["Patent Portfolio", "Add patent titles, application numbers, and short summaries here."]],
        ja: [["特許一覧", "ここに特許名、出願番号、概要を追加してください。"]],
      },
    },
    {
      key: "publications",
      path: { en: "/publications/", ja: "/ja/publications/" },
      nav: { en: "Publications", ja: "論文発表" },
      title: { en: "Publications | Daisuke Hayashi", ja: "論文発表 | 林 大介" },
      heading: { en: "Publications", ja: "論文発表" },
      description: {
        en: "Academic publications, conference presentations, and selected research achievements.",
        ja: "論文、学会発表、主要な研究業績。",
      },
      sections: {
        en: [["Publications", "Add journal papers, conference papers, and presentations here."]],
        ja: [["論文・学会発表", "ここに論文、学会発表、研究業績を追加してください。"]],
      },
    },
    {
      key: "career",
      path: { en: "/career/", ja: "/ja/career/" },
      nav: { en: "Career", ja: "経歴" },
      title: { en: "Career | Daisuke Hayashi", ja: "経歴 | 林 大介" },
      heading: { en: "Career", ja: "経歴" },
      description: {
        en: "Education, professional experience, and research background.",
        ja: "学歴、職歴、研究バックグラウンド。",
      },
      sections: {
        en: [
          ["Education", "Kyoto University, Graduate School of Human and Environmental Studies, Doctoral Program."],
          ["Experience", "Hitachi, Ltd., Research & Development Group, Advanced AI Innovation Center."],
          ["Internship", "Morgan Stanley, Information Technology Division."],
        ],
        ja: [
          ["学歴", "京都大学 大学院人間・環境学研究科 博士後期課程。"],
          ["職歴", "株式会社日立製作所 研究開発グループ 先端AIイノベーションセンタ。"],
          ["インターンシップ", "モルガン・スタンレー 情報技術部門。"],
        ],
      },
    },
  ],
};

module.exports = site;
