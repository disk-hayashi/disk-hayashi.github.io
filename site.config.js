const siteData = require('./data/site.data.js');

module.exports = {
  site: {
    baseUrl: "https://disk-hayashi.github.io",
    enUrl: "https://disk-hayashi.github.io/",
    jaUrl: "https://disk-hayashi.github.io/ja/"
  },

  pages: {
    en: {
      htmlLang: "en",
      langMode: "en",
      title: "Daisuke Hayashi",
      description: "Daisuke Hayashi is a Computer Vision and Machine Learning researcher at Hitachi and Kyoto University, working on Food AI and Medical AI with patented and commercialized technologies.",
      canonical: "https://disk-hayashi.github.io/",
      ogTitle: "Daisuke Hayashi",
      ogDescription: "Computer Vision, NLP and Machine Learning Researcher"
    },
    ja: {
      htmlLang: "ja",
      langMode: "ja",
      title: "林 大介 - Daisuke Hayashi",
      description: "林大介の研究者プロフィール。日立製作所・京都大学にてコンピュータビジョン・機械学習・NLPの研究開発と製品化を推進。特許・論文・受賞実績あり。",
      canonical: "https://disk-hayashi.github.io/ja/",
      ogTitle: "Daisuke Hayashi",
      ogDescription: "Computer Vision・NLP・機械学習研究者"
    }
  },

  siteData
};
