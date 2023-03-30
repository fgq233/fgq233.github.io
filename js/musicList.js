const songs = [
    {url: "https://rn01-sycdn.kuwo.cn/b2ff87fac90b4dd6a11e2f0b37a1f1b5/6423c924/resource/n3/28/54/323409062.mp3", title: "半壶纱 - 刘珂矣"},
    {url: "https://res.wx.qq.com/voice/getvoice?mediaid=MzI3NjYzODY0Nl8yMjQ3NDg2MDk4", title: "笑纳 - 花僮"},
    {url: "https://res.wx.qq.com/voice/getvoice?mediaid=MzI3NjYzODY0Nl8xMDAwMDA2MDg=", title: "故人泪 - 麦小兜"},
    {url: "https://res.wx.qq.com/voice/getvoice?mediaid=MzI3NjYzODY0Nl8yMjQ3NDg2NTI0", title: "琵琶行 - 奇然,沈谧仁"},
    {url: "https://res.wx.qq.com/voice/getvoice?mediaid=MzI3NjYzODY0Nl8xMDAwMDAzMzc=", title: "买辣椒也用券 - 起风了"},

    {url: "https://lb-sycdn.kuwo.cn/3473d02aae7654384469df8f2ca7523b/6423d252/resource/n1/5/53/3133161036.mp3", title: "旺仔小乔 - 樱花树下的约定"},
    {url: "https://cr-sycdn.kuwo.cn/bae81f9176e5aa69fa47ac44fef6cfd2/6423d485/resource/n2/3/60/2723413471.mp3", title: "阿梨粤,R7 - 秒针 (Dj版)"},
    {url: "https://sv-sycdn.kuwo.cn/7c7240e6c0dd01dde50060b8236963d0/6423c88c/resource/n1/15/98/2762992032.mp3", title: "莫问归期 - 蒋雪儿"},
    {url: "https://cv-sycdn.kuwo.cn/e590c3b1be28d1a5457ae1cc46d871a2/6423c902/resource/n1/86/41/4116027248.mp3", title: "相思引 - 董真"},
    {url: "https://m10.music.126.net/20230329140616/d6f0e8fe1622cc04d13160c0bc0601dc/ymusic/08a3/bdc5/963a/0484487fa4fd9ad9f6716bc07f99fa1d.mp3", title: "锦鲤抄 - 银临,云の泣"},
    {url: "https://other-web-nf01-sycdn.kuwo.cn/fa7d1957193a11aa9355af8aca247786/6423d0b7/resource/n1/46/53/2924750324.mp3", title: "游山恋 - 海伦"},
    {url: "https://m804.music.126.net/20230329142247/f7edde7f392b9a454a609de8b53fbcb3/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/14096632340/b23a/a756/d742/f7fc9038dfa63ccd71ee53c9c30737fe.mp3?_authSecret=000001872bf19e6903850aaba131a566", title: "红昭愿 - 音阙诗听"},
    {url: "https://sv-sycdn.kuwo.cn/762c5224c95a0967a72e4732c2a22da7/6423d318/resource/n2/95/66/4130312255.mp3", title: "关山酒 - 邓寓君(等什么君)"},
    {url: "https://m10.music.126.net/20230329142509/09922082ff4a7370e3eabdb0d3705e7c/ymusic/0167/f0e1/def5/dd739ba95c6f4ca9e6d33e34e01b2a77.mp3", title: "辞九门回忆 - 解忧草,冰幽"},
    {url: "https://m704.music.126.net/20230329142629/24b287245ecb37155dcb0be1a3380d4c/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/14096459177/be3c/fcbd/252a/f94401cf858daeeb168607ad5590fca7.mp3?_authSecret=000001872bf501d2183d0aaba560a155", title: "虞兮叹 - 闻人听書"},
    {url: "https://other-web-nf01-sycdn.kuwo.cn/9a5119575606f779133cd6c06b07d520/6423cebe/resource/n3/37/6/2435457861.mp3", title: "牵丝戏 - 银临,Aki阿杰"},
    {url: "https://cl-sycdn.kuwo.cn/7c9706b7967f5b537399d6326fa149f6/6423d389/resource/n1/87/90/1113907190.mp3", title: "赤伶 - HITA"},
    {url: "https://tyst.migu.cn/public/product9th/product46/2022/11/0916/2022%E5%B9%B409%E6%9C%8830%E6%97%A510%E7%82%B953%E5%88%86%E5%86%85%E5%AE%B9%E5%87%86%E5%85%A5%E4%B8%AD%E5%9B%BD%E7%A7%BB%E5%8A%A847%E9%A6%96316417/%E6%A0%87%E6%B8%85%E9%AB%98%E6%B8%85/MP3_128_16_Stero/60057014886164634.mp3", title: "谪仙 - 伊格赛听,叶里"},
    {url: "https://li-sycdn.kuwo.cn/2ac986b4f10b2e981649184883689739/6423d3ff/resource/n2/62/46/2937941609.mp3", title: "张芸京 - 偏爱"},
    {url: "https://li-sycdn.kuwo.cn/2ac986b4f10b2e981649184883689739/6423d3ff/resource/n2/62/46/2937941609.mp3", title: "红色高跟鞋 ~ 蔡健雅"},
    {url: "https://m804.music.126.net/20230329143245/8e90590ca0cb4ae6de5a51d29b8d7a43/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/8182467644/4b2d/0001/eee4/9a69993feeee8b0204e48ee42ed926c5.mp3?_authSecret=000001872bfabbd50fc50aaba2474618", title: "风的季节 - Soler"},


];
