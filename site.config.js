const site = {
  baseUrl: 'https://disk-hayashi.github.io',
  author: {
    name: {
      en: 'Daisuke Hayashi',
      ja: '林 大介'
    },
    title: {
      en: 'AI Researcher / Doctoral Student',
      ja: 'AI研究者 / 博士後期課程'
    },
    affiliation: {
      en: 'Kyoto University / Hitachi, Ltd.',
      ja: '京都大学 / 株式会社日立製作所'
    },
    email: '',
    image: '/assets/profile.jpg'
  },
  focusAreas: {
    en: ['Computer Vision', 'NLP', 'Machine Learning', 'Commercialization', 'Patent Creation', 'R&D'],
    ja: ['Computer Vision', 'NLP', '機械学習', '製品化', '特許創出', '研究開発']
  },
  social: {
    github: 'https://github.com/disk-hayashi',
    googleScholar: '',
    linkedin: ''
  },
  nav: {
    en: [
      ['Home', '/'],
      ['Research', '/research/'],
      ['Projects', '/projects/'],
      ['Publications', '/publications/'],
      ['CV', '/cv/']
    ],
    ja: [
      ['ホーム', '/ja/'],
      ['研究', '/ja/research/'],
      ['プロジェクト', '/ja/projects/'],
      ['業績', '/ja/publications/'],
      ['CV', '/ja/cv/']
    ]
  },
  pages: {
    home: {
      path: { en: '/', ja: '/ja/' },
      title: { en: 'Daisuke Hayashi | AI Researcher', ja: '林 大介 | AI研究者' },
      description: {
        en: 'AI researcher specializing in Computer Vision, NLP, Machine Learning, R&D, commercialization, and patent creation.',
        ja: 'Computer Vision、NLP、機械学習を専門に、研究開発から製品化・特許創出まで一貫して推進するAI研究者。'
      },
      hero: {
        en: 'Advancing AI from research to real-world products and patents.',
        ja: 'Computer Vision・NLP・機械学習を専門に、研究開発から製品化・特許創出まで一貫して推進。'
      },
      sections: {
        en: [
          ['Research', 'Transformer-based object detection for satellite and remote-sensing imagery.'],
          ['Product AI', 'Applied AI research connected to commercialization in consumer and industrial products.'],
          ['Patents', 'Creation of intellectual property through practical AI system development.']
        ],
        ja: [
          ['研究', '衛星画像・リモートセンシング画像におけるTransformerベース物体検出の高精度化。'],
          ['製品AI', '家電・産業領域における製品化を見据えたAI研究開発。'],
          ['特許', '実用AIシステム開発を通じた知的財産の創出。']
        ]
      }
    },
    research: {
      path: { en: '/research/', ja: '/ja/research/' },
      title: { en: 'Research | Daisuke Hayashi', ja: '研究 | 林 大介' },
      description: {
        en: 'Research on high-accuracy AI methods for object detection in satellite and remote-sensing imagery.',
        ja: '宇宙衛星画像・リモートセンシング画像における高精度物体検出AIに関する研究。'
      },
      heading: { en: 'Research', ja: '研究' },
      body: {
        en: [
          'My research focuses on improving Transformer-based object detection methods for satellite and remote-sensing imagery.',
          'Key challenges include multi-scale object detection, high-resolution imagery, dense object distribution, and complex backgrounds.'
        ],
        ja: [
          '宇宙衛星画像における物体検出のためのTransformerベース手法の高精度化に取り組んでいます。',
          '主な課題は、マルチスケール物体、高解像度画像、密集物体、複雑背景への対応です。'
        ]
      }
    },
    projects: {
      path: { en: '/projects/', ja: '/ja/projects/' },
      title: { en: 'Projects | Daisuke Hayashi', ja: 'プロジェクト | 林 大介' },
      description: {
        en: 'Selected AI projects connecting research, product development, and patent creation.',
        ja: '研究開発・製品化・特許創出につながるAIプロジェクト。'
      },
      heading: { en: 'Projects', ja: 'プロジェクト' },
      items: {
        en: [
          ['AI for product commercialization', 'Development of AI technologies connected to real-world product value.'],
          ['Food recognition and recipe support', 'AI systems supporting ingredient understanding and user experience improvement.'],
          ['Medical AI research', 'Research-oriented AI analysis and visualization for medical imaging contexts.']
        ],
        ja: [
          ['製品化AI', '実製品価値につながるAI技術の研究開発。'],
          ['食材認識・レシピ支援', '食材理解とユーザー体験向上を支援するAIシステム。'],
          ['医療AI研究', '医用画像領域におけるAI解析・可視化研究。']
        ]
      }
    },
    publications: {
      path: { en: '/publications/', ja: '/ja/publications/' },
      title: { en: 'Publications | Daisuke Hayashi', ja: '業績 | 林 大介' },
      description: {
        en: 'Publications, conference presentations, patents, and selected academic achievements.',
        ja: '論文、学会発表、特許、主要な研究業績。'
      },
      heading: { en: 'Publications', ja: '業績' },
      publications: {
        en: [
          'Add journal papers, conference papers, presentations, patents, and awards here.'
        ],
        ja: [
          'ここに論文、学会発表、特許、受賞歴などを追加してください。'
        ]
      }
    },
    cv: {
      path: { en: '/cv/', ja: '/ja/cv/' },
      title: { en: 'CV | Daisuke Hayashi', ja: 'CV | 林 大介' },
      description: {
        en: 'Curriculum vitae of Daisuke Hayashi, including education, experience, skills, and research interests.',
        ja: '林 大介の学歴、職歴、スキル、研究関心をまとめたCV。'
      },
      heading: { en: 'CV', ja: 'CV' },
      entries: {
        en: [
          ['Education', 'Kyoto University, Graduate School of Human and Environmental Studies, Doctoral Program.'],
          ['Experience', 'Hitachi, Ltd., Research & Development Group, Advanced AI Innovation Center.'],
          ['Skills', 'Computer Vision, NLP, Machine Learning, Remote Sensing, Deep Learning.']
        ],
        ja: [
          ['学歴', '京都大学 大学院人間・環境学研究科 博士後期課程。'],
          ['職歴', '株式会社日立製作所 研究開発グループ 先端AIイノベーションセンタ。'],
          ['スキル', 'Computer Vision、NLP、機械学習、リモートセンシング、深層学習。']
        ]
      }
    }
  }
};

module.exports = site;
