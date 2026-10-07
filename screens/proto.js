/* MOMEN 좌석 화면 프로토타입 공통 — 화면 맞춤, 상태 저장, 다국어, 토스트, 시트, 설정 */
(function () {
  "use strict";
  const LANGS = ["ko", "en", "fr", "zh", "ja"];
  const LANG_NAMES = { ko: "한국어", en: "English", fr: "Français", zh: "中文", ja: "日本語" };

  // [ko, en, fr, zh, ja]
  const D = {
    welcome_html: ["<span class=\"seat\">32A</span> <span class=\"honor\">님,</span><br>환영합니다", "Welcome,<br><span class=\"seat\">32A</span>", "Bienvenue,<br><span class=\"seat\">32A</span>", "<span class=\"seat\">32A</span><span class=\"honor\">，</span><br>欢迎登机", "<span class=\"seat\">32A</span> <span class=\"honor\">様、</span><br>ようこそ"],
    welcome_sub: ["편안하게 앉으신 뒤, 지금 보내고 싶은 시간을 골라 주세요.<br>모드는 비행 중 언제든 바꿀 수 있어요.", "Settle in, then choose how you'd like to spend this time.<br>You can switch modes anytime during the flight.", "Installez-vous, puis choisissez comment passer ce moment.<br>Vous pouvez changer de mode à tout moment.", "请就座后，选择您想度过的时光。<br>飞行中可随时切换模式。", "ゆったりお座りになり、過ごしたい時間をお選びください。<br>モードはフライト中いつでも変更できます。"],
    lead_ENJOY: ["보던 경기와 영화로<br>비행을 채우고 싶다면", "Fill the flight with<br>the matches and films you love", "Remplir le vol<br>de matchs et de films", "想用比赛和电影<br>填满这段飞行", "観ていた試合や映画で<br>フライトを満たしたいなら"],
    lead_REST: ["빛과 알림을 줄이고<br>방해 없이 쉬고 싶다면", "Dim the lights and alerts<br>and rest undisturbed", "Baisser lumière et alertes<br>pour se reposer", "调暗灯光与提醒，<br>安心休息", "光と通知を抑えて<br>静かに休みたいなら"],
    lead_WORK: ["조용한 곳에서<br>일에 집중하고 싶다면", "Focus on work<br>in the quiet", "Travailler<br>au calme", "想安静地<br>专注工作", "静かに<br>仕事に集中したいなら"],
    lead_PREPARE: ["내리자마자 할 일과<br>시내 교통편을 챙기고 싶다면", "Get ready for the airport<br>and the ride into town", "Préparer l'aéroport<br>et le trajet en ville", "提前准备机场事项<br>和进城交通", "空港での手続きと<br>市内への移動を準備するなら"],
    lead_TRAVEL: ["여행지에서 할 일을 찾고<br>기록하고 나누고 싶다면", "Find, record and share<br>your days at the destination", "Trouver, noter et partager<br>vos journées sur place", "在目的地寻找、记录<br>并分享旅程", "旅先でやることを見つけ、<br>記録して共有するなら"],
    name_ENJOY: ["감상 모드", "Enjoy", "Divertissement", "娱乐模式", "エンジョイモード"],
    name_REST: ["휴식 모드", "Rest", "Repos", "休息模式", "レストモード"],
    name_WORK: ["업무 모드", "Work", "Travail", "工作模式", "ワークモード"],
    name_PREPARE: ["준비 모드", "Prepare", "Préparer", "抵达准备模式", "プリペアモード"],
    name_TRAVEL: ["여행 모드", "Travel", "Voyage", "旅行模式", "トラベルモード"],
    group_in: ["IN · 기내에서", "IN · On board", "IN · À bord", "IN · 机上", "IN · 機内で"],
    group_out: ["OUT · 내린 뒤", "OUT · After landing", "OUT · Après l'atterrissage", "OUT · 落地后", "OUT · 到着後"],

    rest_title: ["휴식 설정", "Rest settings", "Réglages repos", "休息设置", "休息設定"],
    light_level: ["조명", "Lighting", "Éclairage", "照明", "照明"],
    lv_bright: ["밝게", "Bright", "Clair", "明亮", "明るい"],
    lv_soft: ["은은하게", "Soft", "Doux", "柔和", "やわらか"],
    lv_dark: ["어둡게", "Dark", "Sombre", "昏暗", "暗い"],
    soundscape: ["소리", "Sound", "Son", "声音", "サウンド"],
    ss_none: ["없음", "Off", "Aucun", "无", "なし"],
    ss_white: ["화이트 노이즈", "White noise", "Bruit blanc", "白噪音", "ホワイトノイズ"],
    ss_rain: ["빗소리", "Rain", "Pluie", "雨声", "雨音"],
    wake_title: ["깨울 순간만 남기기", "Only wake me for", "Me réveiller seulement pour", "仅在这些时刻唤醒", "起こすのはこの時だけ"],
    wake_meal: ["아침 식사", "Breakfast", "Petit-déjeuner", "早餐", "朝食"],
    wake_land: ["착륙 50분 전", "50 min before landing", "50 min avant l'atterrissage", "落地前50分钟", "着陸50分前"],
    sleep_now: ["지금 잠들기", "Sleep now", "Dormir maintenant", "现在入睡", "今すぐ眠る"],
    t_sleep: ["조명을 낮추고 알림을 줄였어요. 편히 쉬세요", "Lights dimmed, alerts muted. Rest well", "Lumières tamisées, alertes coupées. Bon repos", "已调暗灯光并减少提醒，好好休息", "照明を落とし通知を減らしました。ごゆっくり"],
    wake_up: ["화면 켜기", "Wake screen", "Réactiver l'écran", "唤醒屏幕", "画面をつける"],

    wifi_title: ["기내 Wi-Fi", "Onboard Wi-Fi", "Wi-Fi à bord", "机上 Wi-Fi", "機内Wi-Fi"],
    wifi_on: ["연결됨 · 32A-LAPTOP", "Connected · 32A-LAPTOP", "Connecté · 32A-LAPTOP", "已连接 · 32A-LAPTOP", "接続済み · 32A-LAPTOP"],
    wifi_plan: ["비즈니스 플랜 · 무제한", "Business plan · Unlimited", "Forfait Business · Illimité", "商务套餐 · 不限流量", "ビジネスプラン · 無制限"],
    focus_title: ["집중 타이머", "Focus timer", "Minuteur", "专注计时", "集中タイマー"],
    start: ["시작", "Start", "Démarrer", "开始", "開始"],
    pause: ["일시정지", "Pause", "Pause", "暂停", "一時停止"],
    focus_light: ["집중 조명", "Task light", "Lampe de travail", "工作灯", "作業灯"],
    hold_alerts: ["알림 묶어두기", "Hold alerts", "Suspendre les alertes", "暂缓提醒", "通知を保留"],
    hold_desc: ["타이머가 끝나면 한 번에 보여드려요", "Shown together when the timer ends", "Affichées à la fin du minuteur", "计时结束后一并显示", "タイマー終了時にまとめて表示"],
    t_focus_done: ["집중 시간이 끝났어요", "Focus session complete", "Session terminée", "专注时间结束", "集中時間が終わりました"],

    transport: ["시내 이동 수단", "Into the city", "Vers Paris", "进城交通", "市内への移動"],
    tr1: ["RER B", "RER B", "RER B", "RER B", "RER B"],
    tr1d: ["35분 · €11.80", "35 min · €11.80", "35 min · 11,80 €", "35分钟 · €11.80", "35分 · €11.80"],
    tr2: ["택시", "Taxi", "Taxi", "出租车", "タクシー"],
    tr2d: ["50분 · €56 정액", "50 min · €56 flat", "50 min · 56 € forfait", "50分钟 · 固定€56", "50分 · 定額€56"],
    tr3: ["공항버스", "Airport bus", "Navette", "机场巴士", "空港バス"],
    tr3d: ["60분 · €16", "60 min · €16", "60 min · 16 €", "60分钟 · €16", "60分 · €16"],
    best: ["추천", "Best", "Conseillé", "推荐", "おすすめ"],
    checklist: ["도착 체크리스트", "Arrival checklist", "Checklist d'arrivée", "抵达清单", "到着チェックリスト"],
    t_route: ["{0} 경로를 저장했어요", "{0} route saved", "Itinéraire {0} enregistré", "已保存{0}路线", "{0}のルートを保存しました"],

    discover: ["여행지에서 할 일", "Things to do", "À faire sur place", "目的地推荐", "旅先でやること"],
    p1: ["센 강 해 질 녘 산책", "Seine walk at dusk", "Balade sur la Seine", "黄昏塞纳河散步", "夕暮れのセーヌ散歩"],
    p1d: ["도보 · 1시간", "Walk · 1 h", "À pied · 1 h", "步行 · 1小时", "徒歩 · 1時間"],
    p2: ["오르세 미술관", "Musée d'Orsay", "Musée d'Orsay", "奥赛博物馆", "オルセー美術館"],
    p2d: ["RER C · 9:30 개관", "RER C · opens 9:30", "RER C · ouvre à 9 h 30", "RER C · 9:30开馆", "RER C · 9:30開館"],
    p3: ["마레 지구 카페", "Café in Le Marais", "Café au Marais", "玛黑区咖啡馆", "マレ地区のカフェ"],
    p3d: ["메트로 1호선 · 브런치", "Metro 1 · Brunch", "Métro 1 · Brunch", "地铁1号线 · 早午餐", "メトロ1号線 · ブランチ"],
    save_place: ["담기", "Save", "Ajouter", "收藏", "保存"],
    saved_place: ["담음", "Saved", "Ajouté", "已收藏", "保存済み"],
    record: ["여행 기록", "Travel journal", "Carnet de voyage", "旅行记录", "旅の記録"],
    record_ph: ["기내에서 시작된 이번 여행, 첫 줄을 남겨 보세요", "Write the first line of this trip, starting on board", "Écrivez la première ligne de ce voyage", "写下这段旅程的第一句", "機内から始まる旅の最初の一行を"],
    record_save: ["기록하기", "Save entry", "Enregistrer", "保存记录", "記録する"],
    entries: ["기록 {0}개", "{0} entries", "{0} notes", "{0}条记录", "記録{0}件"],
    share: ["나누기", "Share", "Partager", "分享", "共有"],
    share_desc: ["동행에게 일정과 기록을 링크로 보내요", "Send your plan and journal to companions", "Envoyez programme et carnet à vos proches", "把行程与记录发给同行者", "同行者に予定と記録を送る"],
    copy_link: ["링크 복사", "Copy link", "Copier le lien", "复制链接", "リンクをコピー"],
    t_saved: ["일정에 담았어요", "Added to your plan", "Ajouté au programme", "已加入行程", "予定に追加しました"],
    t_recorded: ["기록했어요", "Entry saved", "Note enregistrée", "已记录", "記録しました"],
    t_copied: ["링크를 복사했어요", "Link copied", "Lien copié", "链接已复制", "リンクをコピーしました"],

    settings: ["설정", "Settings", "Réglages", "设置", "設定"],
    brightness: ["화면 밝기", "Screen brightness", "Luminosité", "屏幕亮度", "画面の明るさ"],
    language: ["언어", "Language", "Langue", "语言", "言語"],
    dnd: ["방해 금지", "Do not disturb", "Ne pas déranger", "勿扰", "おやすみモード"],
    dnd_desc: ["승무원 서비스 알림만 받아요", "Only cabin service alerts", "Uniquement les alertes de service", "仅接收客舱服务提醒", "客室サービスの通知のみ"],
    sound: ["터치음", "Touch sounds", "Sons tactiles", "触控音", "タッチ音"],
    change_mode: ["모드 다시 고르기", "Choose mode again", "Choisir un autre mode", "重新选择模式", "モードを選び直す"],
    close: ["닫기", "Close", "Fermer", "关闭", "閉じる"],
    done: ["완료", "Done", "OK", "完成", "完了"],
    cancel: ["취소", "Cancel", "Annuler", "取消", "キャンセル"],

    menu: ["메뉴", "Menu", "Menu", "菜单", "メニュー"],
    to_dest: ["여행지까지", "To destination", "Jusqu'à destination", "距目的地", "目的地まで"],
    local_time: ["현지 시각", "Local time", "Heure locale", "当地时间", "現地時刻"],
    arrive: ["도착", "Arrival", "Arrivée", "到达", "到着"],
    terminal: ["터미널 2E", "Terminal 2E", "Terminal 2E", "2E 航站楼", "ターミナル2E"],
    weather: ["맑음", "Clear", "Dégagé", "晴", "晴れ"],
    map_link: ["여정 지도 보기", "View flight map", "Voir la carte du vol", "查看航线图", "フライトマップを見る"],
    modes_title: ["지금, 어떤 시간을 보낼까요?", "How would you like to spend this time?", "Comment passer ce moment ?", "此刻，想如何度过？", "今、どんな時間を過ごしますか？"],
    modes_note: ["모드를 고르면 조명·알림·콘텐츠가 함께 바뀝니다", "Lighting, alerts and content follow your mode", "L'éclairage, les alertes et le contenu suivent le mode", "照明、提醒与内容随模式切换", "照明・通知・コンテンツがモードに合わせて変わります"],
    continue: ["이어보기", "Continue", "Reprendre", "继续观看", "続きから"],
    continue_note: ["탑승 전 담은 콘텐츠 4", "4 saved before boarding", "4 enregistrés avant l'embarquement", "登机前收藏 4 项", "搭乗前に保存した4件"],
    psg_sub: ["휴대폰에서 보던 장면부터", "From where you left off on your phone", "Là où vous vous êtes arrêté", "从手机上看到的地方继续", "スマホで見ていた場面から"],
    film: ["영화", "Film", "Film", "电影", "映画"],
    playlist: ["수면 전 플레이리스트 · 12곡", "Pre-sleep playlist · 12 tracks", "Playlist du soir · 12 titres", "睡前歌单 · 12首", "おやすみ前のプレイリスト · 12曲"],
    meal_title: ["기내식이 준비되었어요", "Your meal is ready", "Votre repas est prêt", "您的餐食已备好", "お食事の準備ができました"],
    meal_body: ["경기가 26분 남았어요. 끝난 뒤에 받을지, 지금 받을지 골라 주세요.", "The match has 26 minutes left. Have it after the match, or now?", "Il reste 26 minutes de match. Après, ou maintenant ?", "比赛还剩26分钟。赛后享用，还是现在？", "試合は残り26分。終了後にしますか、今にしますか？"],
    meal_later: ["경기 끝나고 받기", "After the match", "Après le match", "赛后享用", "試合後に"],
    meal_now: ["지금 받기", "Now", "Maintenant", "现在", "今すぐ"],
    meal_later_t: ["경기 종료 후 준비할게요", "We'll serve it after the match", "Servi après le match", "赛后为您送餐", "試合後にお持ちします"],
    meal_later_b: ["경기가 끝나면 승무원에게 자동으로 알려요.", "The crew is notified when the match ends.", "L'équipage sera prévenu à la fin du match.", "比赛结束时将自动通知乘务员。", "試合終了時に乗務員へ自動でお知らせします。"],
    meal_now_t: ["곧 기내식을 가져다드릴게요", "Your meal is on its way", "Votre repas arrive", "餐食马上送到", "まもなくお持ちします"],
    meal_now_b: ["보던 경기는 그대로 이어집니다.", "Your match keeps playing.", "Le match continue.", "比赛将继续播放。", "試合はそのまま続きます。"],
    change: ["바꾸기", "Change", "Modifier", "更改", "変更"],
    arrival: ["도착 준비", "Arrival", "Arrivée", "抵达准备", "到着準備"],
    arrival_note: ["착륙 50분 전에 다시 알려드려요", "Reminder 50 min before landing", "Rappel 50 min avant l'atterrissage", "落地前50分钟再提醒您", "着陸50分前にお知らせします"],
    step1: ["입국심사", "Immigration", "Immigration", "入境检查", "入国審査"],
    step1d: ["약 25분 예상", "About 25 min", "Environ 25 min", "约25分钟", "約25分"],
    step2: ["수하물 찾기", "Baggage", "Bagages", "提取行李", "手荷物受取"],
    step2d: ["Belt 31", "Belt 31", "Tapis 31", "31号转盘", "ベルト31"],
    step3: ["시내 이동", "To the city", "Vers Paris", "前往市区", "市内へ"],
    step3d: ["RER B 추천 · 35분", "RER B · 35 min", "RER B conseillé · 35 min", "推荐 RER B · 35分钟", "RER B 推奨 · 35分"],
    send: ["휴대폰으로 보내기", "Send to phone", "Envoyer au téléphone", "发送到手机", "スマホに送る"],
    edit_tl: ["타임라인 편집", "Edit timeline", "Modifier le parcours", "编辑时间线", "タイムラインを編集"],
    departed: ["2시간 8분 전 출발", "Departed 2h 8m ago", "Parti il y a 2 h 08", "2小时8分钟前起飞", "2時間8分前に出発"],
    arr_at: ["07:30 도착", "Arrives 07:30", "Arrivée 07:30", "07:30 到达", "07:30 着"],
    ev_meal: ["기내식", "Meal", "Repas", "餐食", "お食事"],
    ev_match: ["경기 종료", "Full time", "Fin du match", "比赛结束", "試合終了"],
    ev_sleep: ["수면 시작", "Sleep", "Sommeil", "入睡", "就寝"],
    ev_wake: ["기상 · 아침 식사", "Wake · Breakfast", "Réveil · Petit-déj.", "起床 · 早餐", "起床 · 朝食"],
    ev_arrival: ["도착 준비", "Arrival prep", "Préparer l'arrivée", "抵达准备", "到着準備"],

    browse_all: ["전체 보기", "See all", "Tout voir", "查看全部", "すべて見る"],
    g_romance: ["로맨스", "Romance", "Romance", "爱情", "ロマンス"],
    g_drama: ["드라마", "Drama", "Drame", "剧情", "ドラマ"],
    g_comedy: ["코미디", "Comedy", "Comédie", "喜剧", "コメディ"],
    g_football: ["축구", "Football", "Football", "足球", "サッカー"],
    g_tennis: ["테니스", "Tennis", "Tennis", "网球", "テニス"],
    g_more: ["그 밖의 경기", "More sports", "Autres sports", "其他赛事", "その他の競技"],
    g_calm: ["잔잔한", "Calm", "Calme", "舒缓", "穏やか"],
    g_jazz: ["재즈", "Jazz", "Jazz", "爵士", "ジャズ"],
    g_focus: ["집중", "Focus", "Concentration", "专注", "集中"],
    m_modes: ["모드", "Modes", "Modes", "模式", "モード"],
    back: ["뒤로", "Back", "Retour", "返回", "戻る"],
    current: ["사용 중", "Current", "Actuel", "当前", "使用中"],

    resume_at: ["{0}분부터 이어보기", "Resume at {0}'", "Reprendre à {0}'", "从第{0}分钟继续", "{0}分から再開"],
    from_start: ["처음부터", "From start", "Depuis le début", "从头开始", "最初から"],
    my_list: ["내 목록", "My list", "Ma liste", "我的片单", "マイリスト"],
    tab_film: ["영화", "Films", "Films", "电影", "映画"],
    tab_live: ["라이브", "Live", "Direct", "直播", "ライブ"],

    rest_head: ["편히 쉬세요", "Rest easy", "Reposez-vous", "好好休息", "ごゆっくり"],
    rest_sub: ["빛과 알림을 줄였어요. 깨울 순간만 남겨둘게요.", "Lights and alerts are down. We'll only wake you when it matters.", "Lumières et alertes réduites. Réveil seulement quand il le faut.", "已调暗灯光并减少提醒，只在需要时唤醒您。", "照明と通知を抑えました。必要な時だけ起こします。"],
    sleep_window: ["수면 시간", "Sleep window", "Plage de sommeil", "睡眠时段", "睡眠時間"],
    bedtime: ["잠드는 시각", "Bedtime", "Coucher", "入睡时间", "就寝時刻"],
    waketime: ["깨우는 시각", "Wake-up", "Réveil", "起床时间", "起床時刻"],

    work_head: ["조용히, 집중할 시간", "Quiet time to focus", "Le calme pour travailler", "安静专注的时间", "静かに集中する時間"],
    sessions: ["남은 비행 동안 집중 세션 {0}번", "{0} focus sessions left this flight", "{0} sessions possibles d'ici l'arrivée", "本次飞行还可专注{0}次", "残りのフライトで集中セッション{0}回"],
    timer_reset: ["초기화", "Reset", "Réinitialiser", "重置", "リセット"],
    min_fmt: ["{0}분", "{0} min", "{0} min", "{0}分钟", "{0}分"],
    held_title: ["묶어둔 알림", "Held alerts", "Alertes en attente", "暂缓的提醒", "保留中の通知"],
    show_now: ["지금 보기", "Show now", "Afficher", "立即查看", "今すぐ見る"],
    focus_music: ["집중 음악", "Focus music", "Musique de concentration", "专注音乐", "集中用の音楽"],
    workspace: ["작업 환경", "Workspace", "Espace de travail", "工作环境", "作業環境"],

    prep_head: ["내리자마자, 순서대로", "Off the plane, step by step", "Dès l'arrivée, étape par étape", "落地后，按顺序进行", "降りたらすぐ、順番に"],
    prep_total: ["공항을 나서기까지 약 55분", "About 55 min to leave the airport", "Environ 55 min pour quitter l'aéroport", "约55分钟走出机场", "空港を出るまで約55分"],
    step1x: ["여권과 입국 카드를 준비하세요", "Have your passport ready", "Préparez votre passeport", "请准备好护照", "パスポートをご用意ください"],
    step2x: ["짐은 31번 벨트에서 나와요", "Bags arrive at belt 31", "Bagages au tapis 31", "行李在31号转盘", "荷物は31番ベルトです"],
    step3x: ["고른 교통편까지 길을 안내해요", "We'll guide you to your ride", "Nous vous guidons vers votre trajet", "引导您前往所选交通", "選んだ交通手段へ案内します"],
    tr1r: ["CDG 2E → RER B → 파리 북역 · 환승 없음", "CDG 2E → RER B → Gare du Nord · direct", "CDG 2E → RER B → Gare du Nord · direct", "CDG 2E → RER B → 巴黎北站 · 直达", "CDG 2E → RER B → パリ北駅 · 直通"],
    tr2r: ["택시 승강장 · 2E 10번 출구", "Taxi rank · exit 10, 2E", "Station de taxis · sortie 10, 2E", "出租车站 · 2E 10号出口", "タクシー乗り場 · 2E 10番出口"],
    tr3r: ["로시버스 · 오페라 하차", "Roissybus · to Opéra", "Roissybus · arrêt Opéra", "Roissybus · 歌剧院下车", "ロワシーバス · オペラ下車"],
    route: ["경로", "Route", "Itinéraire", "路线", "ルート"],

    first_day: ["도착 첫날", "Your first day", "Votre premier jour", "抵达第一天", "到着初日"],
    cat_all: ["전체", "All", "Tout", "全部", "すべて"],
    cat_walk: ["산책", "Walks", "Balades", "散步", "散歩"],
    cat_art: ["미술관", "Museums", "Musées", "博物馆", "美術館"],
    cat_cafe: ["카페", "Cafés", "Cafés", "咖啡馆", "カフェ"],
    my_plan: ["내 일정", "My plan", "Mon programme", "我的行程", "私の予定"],
    plan_empty: ["마음에 드는 곳을 담으면 여기에 모여요", "Saved places gather here", "Vos lieux ajoutés apparaissent ici", "收藏的地点会出现在这里", "保存した場所がここに集まります"],
    p4: ["몽마르트르 언덕", "Montmartre", "Butte Montmartre", "蒙马特高地", "モンマルトルの丘"],
    p4d: ["메트로 2호선 · 해 질 녘 추천", "Metro 2 · best at dusk", "Métro 2 · idéal au crépuscule", "地铁2号线 · 黄昏最佳", "メトロ2号線 · 夕暮れがおすすめ"],
    p5: ["루브르 박물관", "The Louvre", "Musée du Louvre", "卢浮宫", "ルーヴル美術館"],
    p5d: ["메트로 1호선 · 9:00 개관", "Metro 1 · opens 9:00", "Métro 1 · ouvre à 9 h", "地铁1号线 · 9:00开馆", "メトロ1号線 · 9:00開館"],
    p6: ["생제르맹 카페 거리", "Saint-Germain cafés", "Cafés de Saint-Germain", "圣日耳曼咖啡街", "サンジェルマンのカフェ"],
    p6d: ["메트로 4호선 · 아침 커피", "Metro 4 · morning coffee", "Métro 4 · café du matin", "地铁4号线 · 晨间咖啡", "メトロ4号線 · 朝のコーヒー"],

    t_mode: ["{0}로 바꿨어요", "Switched to {0}", "Mode {0} activé", "已切换到{0}", "{0}に切り替えました"],
    t_light_on: ["좌석 조명을 켰어요", "Reading light on", "Liseuse allumée", "阅读灯已打开", "読書灯をつけました"],
    t_light_off: ["좌석 조명을 껐어요", "Reading light off", "Liseuse éteinte", "阅读灯已关闭", "読書灯を消しました"],
    t_call: ["승무원을 호출했어요", "Crew called", "Équipage appelé", "已呼叫乘务员", "乗務員を呼びました"],
    t_call_off: ["호출을 취소했어요", "Call cancelled", "Appel annulé", "已取消呼叫", "呼び出しを取り消しました"],
    t_sent: ["도착 정보를 휴대폰으로 보냈어요", "Arrival info sent to your phone", "Infos d'arrivée envoyées", "抵达信息已发送到手机", "到着情報をスマホに送りました"],
    t_tl: ["타임라인을 바꿨어요. 조명과 알림이 맞춰집니다", "Timeline updated. Lighting and alerts will follow", "Parcours mis à jour", "时间线已更新，照明与提醒将随之调整", "タイムラインを更新しました"],
    t_dish: ["{0}(으)로 골랐어요", "{0} selected", "{0} choisi", "已选择{0}", "{0}を選びました"],
    t_seat: ["좌석을 {0} 자세로 맞췄어요", "Seat set to {0}", "Siège en position {0}", "座椅已调为{0}", "座席を{0}にしました"],
    t_dnd_on: ["방해 금지를 켰어요", "Do not disturb on", "Ne pas déranger activé", "勿扰已开启", "おやすみモードをオンにしました"],
    t_dnd_off: ["방해 금지를 껐어요", "Do not disturb off", "Ne pas déranger désactivé", "勿扰已关闭", "おやすみモードをオフにしました"],

    notifications: ["알림", "Notifications", "Notifications", "通知", "通知"],
    now: ["지금", "Now", "Maintenant", "现在", "今"],
    n_match: ["경기 종료까지 26분", "26 min to full time", "Fin du match dans 26 min", "距比赛结束26分钟", "試合終了まで26分"],
    n_sleep: ["22:40 수면 모드 예정", "Sleep mode at 22:40", "Mode sommeil à 22:40", "22:40 进入睡眠模式", "22:40 睡眠モード予定"],
    n_empty_dnd: ["방해 금지 중 — 서비스 알림만 표시돼요", "Do not disturb — service alerts only", "Ne pas déranger — alertes de service uniquement", "勿扰中 — 仅显示服务提醒", "おやすみ中 — サービス通知のみ"],
    qr_title: ["휴대폰으로 스캔하세요", "Scan with your phone", "Scannez avec votre téléphone", "用手机扫描", "スマホでスキャン"],
    qr_desc: ["도착 체크리스트와 길 안내가 저장돼요. 코드는 한 번만 쓸 수 있어요.", "Saves your arrival checklist and directions. Single-use code.", "Enregistre la checklist et l'itinéraire. Code à usage unique.", "保存抵达清单与路线。代码仅限使用一次。", "到着チェックリストと経路を保存。コードは1回のみ有効です。"],
    qr_waiting: ["연결을 기다리는 중…", "Waiting for your phone…", "En attente du téléphone…", "等待手机连接…", "スマホを待っています…"],
    map_title: ["여정 지도", "Flight map", "Carte du vol", "航线图", "フライトマップ"],
    altitude: ["고도", "Altitude", "Altitude", "高度", "高度"],
    speed: ["속도", "Ground speed", "Vitesse sol", "地速", "対地速度"],
    outside: ["바깥 기온", "Outside", "Extérieur", "外部温度", "外気温"],
    distance: ["남은 거리", "Distance left", "Distance restante", "剩余距离", "残り距離"],
    tl_desc: ["시각을 옮기면 조명과 알림이 맞춰 바뀌어요", "Move a time and lighting and alerts follow", "Déplacez une heure, l'éclairage et les alertes suivent", "调整时间，照明与提醒随之变化", "時刻を動かすと照明と通知が合わせて変わります"],
    tl_alarm: ["기상 알람", "Wake alarm", "Alarme de réveil", "起床闹钟", "起床アラーム"],
    tl_meal: ["아침 식사 받기", "Serve breakfast", "Servir le petit-déjeuner", "享用早餐", "朝食を受け取る"],
    m_home: ["홈", "Home", "Accueil", "首页", "ホーム"],
    m_watch: ["영화 · 라이브", "Films & Live", "Films et direct", "电影 · 直播", "映画 · ライブ"],
    m_music: ["음악", "Music", "Musique", "音乐", "音楽"],
    m_dine: ["기내식 메뉴", "Dining", "Repas", "餐食", "お食事"],
    dine_title: ["오늘의 기내식", "Today's menu", "Menu du jour", "今日餐食", "本日のお食事"],
    dish1: ["소고기 비빔밥", "Beef bibimbap", "Bibimbap au bœuf", "牛肉拌饭", "牛肉ビビンバ"],
    dish1d: ["고추장 · 참기름 · 제철 나물", "Gochujang, sesame oil, seasonal greens", "Gochujang, huile de sésame, légumes de saison", "辣椒酱 · 香油 · 时令野菜", "コチュジャン · ごま油 · 季節のナムル"],
    dish2: ["허브 치킨과 감자", "Herb chicken & potatoes", "Poulet aux herbes et pommes de terre", "香草鸡配土豆", "ハーブチキンとポテト"],
    dish2d: ["타임 · 레몬 · 구운 채소", "Thyme, lemon, roasted vegetables", "Thym, citron, légumes rôtis", "百里香 · 柠檬 · 烤蔬菜", "タイム · レモン · 焼き野菜"],
    choose: ["고르기", "Choose", "Choisir", "选择", "選ぶ"],
    chosen: ["골랐어요", "Selected", "Choisi", "已选择", "選択済み"],
    p7: ["튈르리 정원", "Tuileries Garden", "Jardin des Tuileries", "杜乐丽花园", "チュイルリー公園"],
    p7d: ["메트로 1호선 · 아침 산책", "Metro 1 · morning walk", "Métro 1 · balade matinale", "地铁1号线 · 晨间散步", "メトロ1号線 · 朝の散歩"],
    p8: ["퐁피두 센터", "Centre Pompidou", "Centre Pompidou", "蓬皮杜中心", "ポンピドゥー・センター"],
    p8d: ["메트로 11호선 · 11:00 개관", "Metro 11 · opens 11:00", "Métro 11 · ouvre à 11 h", "地铁11号线 · 11:00开馆", "メトロ11号線 · 11:00開館"],
    p9: ["카페 드 플로르", "Café de Flore", "Café de Flore", "花神咖啡馆", "カフェ・ド・フロール"],
    p9d: ["메트로 4호선 · 7:30 오픈", "Metro 4 · opens 7:30", "Métro 4 · ouvre à 7 h 30", "地铁4号线 · 7:30营业", "メトロ4号線 · 7:30開店"],
    seat_quick: ["좌석 자세", "Seat position", "Position du siège", "座椅姿势", "座席の姿勢"],
    seat_title: ["좌석 32A", "Seat 32A", "Siège 32A", "座位 32A", "座席 32A"],
    upright: ["바로 앉기", "Upright", "Droit", "直立", "アップライト"],
    lounge: ["기대기", "Lounge", "Détente", "半躺", "ラウンジ"],
    bed: ["눕기", "Bed", "Lit", "平躺", "ベッド"],
    playing: ["재생 중", "Now playing", "En lecture", "正在播放", "再生中"],
    min_left: ["{0}분 남음", "{0} min left", "{0} min restantes", "剩余{0}分钟", "残り{0}分"],
    reset: ["처음 상태로", "Reset prototype", "Réinitialiser", "重置原型", "初期状態に戻す"],
  };

  const KEY = "momen-proto";
  const defaults = { lang: "ko", mode: "ENJOY", bright: 100, dnd: false, sound: true };
  let state = { ...defaults };
  try { state = { ...defaults, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} };

  const t = (key, ...args) => {
    const row = D[key]; if (!row) return key;
    let s = row[LANGS.indexOf(state.lang)] ?? row[1] ?? row[0];
    args.forEach((a, i) => { s = s.replace(`{${i}}`, a); });
    return s;
  };
  const hm = (min) => {
    const h = Math.floor(min / 60), m = min % 60;
    return { ko: `${h}시간 ${m}분`, en: `${h}h ${m}m`, fr: `${h} h ${String(m).padStart(2, "0")}`, zh: `${h}小时${m}分`, ja: `${h}時間${m}分` }[state.lang];
  };

  const applyI18n = (root = document) => {
    document.documentElement.lang = state.lang;
    root.querySelectorAll("[data-i18n]").forEach((el) => { const v = t(el.dataset.i18n); if (v.includes("<")) el.innerHTML = v; else el.textContent = v; });
    root.querySelectorAll("[data-i18n-label]").forEach((el) => { el.setAttribute("aria-label", t(el.dataset.i18nLabel)); el.title = t(el.dataset.i18nLabel); });
    dispatchEvent(new CustomEvent("proto:lang"));
  };

  let stage, dim, toastEl, toastTimer = 0;
  const fit = () => {
    const s = Math.min(innerWidth / 1920, innerHeight / 1080);
    stage.style.transform = `scale(${s})`;
    stage.style.margin = `${(1080 * s - 1080) / 2}px ${(1920 * s - 1920) / 2}px`;
    // 축소 배율 × 레티나 비율을 되돌려 테두리를 실제 1픽셀로
    stage.style.setProperty("--hair", `${1 / (s * (window.devicePixelRatio || 1))}px`);
  };
  const applyBright = () => { dim.style.opacity = String((100 - state.bright) / 100 * 0.75); };

  // 터치음 — 짧은 클릭
  let ctx;
  const click = () => {
    if (!state.sound) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = 1400; g.gain.setValueAtTime(0.04, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
      o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.06);
    } catch (e) {}
  };

  const toast = (msg) => {
    toastEl.textContent = msg; toastEl.classList.add("is-on");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => toastEl.classList.remove("is-on"), 2600);
  };

  // 시트(모달) — 캔버스 안에 열어 함께 축소된다
  const open = [];
  const sheet = ({ title, body, wide = false, side = false, full = false, onClose } = {}) => {
    const wrap = document.createElement("div");
    wrap.className = `sheet-wrap${side ? " is-side" : ""}${full ? " is-full" : ""}`;
    wrap.innerHTML = `<div class="sheet-scrim" data-close></div>
      <section class="sheet${wide ? " is-wide" : ""}" role="dialog" aria-modal="true">
        ${title ? `<header class="sheet__head"><h2 class="sheet__title">${title}</h2><button class="round-btn" type="button" data-close aria-label="${t("close")}"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button></header>` : ""}
        <div class="sheet__body"></div>
      </section>`;
    const bodyEl = wrap.querySelector(".sheet__body");
    if (typeof body === "string") bodyEl.innerHTML = body; else if (body) bodyEl.append(body);
    const close = () => {
      wrap.classList.remove("is-open");
      const i = open.indexOf(api); if (i >= 0) open.splice(i, 1);
      setTimeout(() => wrap.remove(), 320);
      onClose && onClose();
    };
    wrap.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) close(); });
    stage.append(wrap);
    requestAnimationFrame(() => requestAnimationFrame(() => wrap.classList.add("is-open")));
    const api = { el: wrap, body: bodyEl, close };
    open.push(api);
    const f = wrap.querySelector(".sheet button, .sheet input"); f && setTimeout(() => f.focus({ preventScroll: true }), 50);
    return api;
  };
  addEventListener("keydown", (e) => { if (e.key === "Escape" && open.length) open[open.length - 1].close(); });

  const setLang = (lang) => { state.lang = lang; save(); applyI18n(); };

  const openSettings = () => {
    const s = sheet({ title: t("settings"), body: `
      <div class="field"><div class="field__row"><span class="field__label">${t("brightness")}</span><span class="field__value" data-bv>${state.bright}%</span></div>
        <input class="range" type="range" min="30" max="100" step="5" value="${state.bright}" data-bright aria-label="${t("brightness")}"></div>
      <div class="field"><span class="field__label">${t("language")}</span>
        <div class="seg" role="group">${LANGS.map((l) => `<button type="button" data-lang="${l}" aria-pressed="${l === state.lang}">${LANG_NAMES[l]}</button>`).join("")}</div></div>
      <div class="field field--toggle"><span><span class="field__label">${t("dnd")}</span><span class="field__desc">${t("dnd_desc")}</span></span>
        <button class="switch" type="button" role="switch" aria-checked="${state.dnd}" data-dnd aria-label="${t("dnd")}"><i></i></button></div>
      <div class="field field--toggle"><span class="field__label">${t("sound")}</span>
        <button class="switch" type="button" role="switch" aria-checked="${state.sound}" data-sound aria-label="${t("sound")}"><i></i></button></div>
      <div class="sheet__foot">
        <a class="btn btn--ghost" href="start.html">${t("change_mode")}</a>
        <button class="btn btn--text" type="button" data-reset>${t("reset")}</button>
      </div>` });
    const b = s.body;
    b.querySelector("[data-bright]").addEventListener("input", (e) => { state.bright = +e.target.value; b.querySelector("[data-bv]").textContent = `${state.bright}%`; applyBright(); save(); });
    b.querySelectorAll("[data-lang]").forEach((x) => x.addEventListener("click", () => { s.close(); setLang(x.dataset.lang); setTimeout(openSettings, 340); }));
    b.querySelector("[data-dnd]").addEventListener("click", (e) => { state.dnd = !state.dnd; e.currentTarget.setAttribute("aria-checked", state.dnd); save(); toast(t(state.dnd ? "t_dnd_on" : "t_dnd_off")); dispatchEvent(new CustomEvent("proto:dnd")); });
    b.querySelector("[data-sound]").addEventListener("click", (e) => { state.sound = !state.sound; e.currentTarget.setAttribute("aria-checked", state.sound); save(); });
    b.querySelector("[data-reset]").addEventListener("click", () => { try { localStorage.removeItem(KEY); } catch (e) {} location.href = "start.html"; });
  };

  const init = () => {
    stage = document.getElementById("stage");
    dim = document.createElement("div"); dim.className = "dim"; dim.setAttribute("aria-hidden", "true"); stage.append(dim);
    toastEl = document.createElement("div"); toastEl.className = "toast"; toastEl.setAttribute("role", "status"); toastEl.setAttribute("aria-live", "polite"); stage.append(toastEl);
    addEventListener("resize", fit); fit(); applyBright();
    document.addEventListener("click", (e) => { if (e.target.closest("button, a, input[type=range]")) click(); }, true);
    const q = new URLSearchParams(location.search);
    if (q.get("mode")) { state.mode = q.get("mode"); save(); }
    if (q.get("lang") && LANGS.includes(q.get("lang"))) { state.lang = q.get("lang"); save(); }
    applyI18n();
  };

  window.Proto = { state, save, t, hm, applyI18n, setLang, toast, sheet, openSettings, init, LANGS, LANG_NAMES, MODES: ["ENJOY", "REST", "WORK", "PREPARE", "TRAVEL"], OUT_MODES: ["PREPARE", "TRAVEL"] };
})();
