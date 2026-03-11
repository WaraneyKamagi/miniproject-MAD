import React, { useState } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, Platform, StatusBar,
    ScrollView, TouchableOpacity, Modal, Alert, TextInput
} from 'react-native';
import { useRouter } from 'expo-router';

const PRIMARY = '#ec7f13';
const BG = '#f8f7f6';
const GREEN = '#047857';

// ─────────────────────────────────────────────────────────────────────────────
// MEAL TIME LOGIC
// Windows: Sarapan 06:00–08:30 | Siang 11:30–13:30 | Malam 17:30–19:30
// To demo different states, change NOW_HOUR/NOW_MIN below.
// In production replace with: new Date().getHours() / new Date().getMinutes()
// ─────────────────────────────────────────────────────────────────────────────
const NOW_HOUR = 14; // 14:00  →  sarapan=DONE, siang=DONE, malam=UPCOMING
const NOW_MIN = 0;

type MealKey = 'sarapan' | 'siang' | 'malam';
type MealStatus = 'upcoming' | 'serving' | 'done';

function getMealStatus(meal: MealKey): MealStatus {
    const t = NOW_HOUR * 60 + NOW_MIN;
    const ranges: Record<MealKey, [number, number]> = {
        sarapan: [6 * 60, 8 * 60 + 30],
        siang:   [11 * 60 + 30, 13 * 60 + 30],
        malam:   [17 * 60 + 30, 19 * 60 + 30],
    };
    const [start, end] = ranges[meal];
    if (t < start) return 'upcoming';
    if (t <= end)  return 'serving';
    return 'done';
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

type FoodItem = { name: string; desc: string; cal: number; tags: string[]; emoji: string };

const TODAY: Record<MealKey, FoodItem> = {
    sarapan: { name: 'Mie Goreng Sayur',    emoji: '🍜', desc: 'Mie goreng dengan wortel, kol & daun bawang segar',          cal: 380, tags: ['VEGETARIAN', 'FAVORIT'] },
    siang:   { name: 'Nasi + Tempe Goreng', emoji: '🍱', desc: 'Nasi putih dengan tempe goreng crispy & sambal tomat',        cal: 410, tags: ['VEGETARIAN', 'FAVORIT'] },
    malam:   { name: 'Nasi Goreng Sayuran', emoji: '🍚', desc: 'Nasi goreng brokoli, jagung manis & kecap manis',             cal: 420, tags: ['VEGAN', 'FAVORIT']      },
};

const WEEK = [
    { day: 'Sen', date: '10', isToday: false,
      sarapan: { emoji: '🫘', name: 'Bubur Kacang Hijau' },
      siang:   { emoji: '🥗', name: 'Gado-Gado Unklab'  },
      malam:   { emoji: '🥦', name: 'Capcay Tahu'        } },
    { day: 'Sel', date: '11', isToday: true,
      sarapan: { emoji: '🍜', name: 'Mie Goreng Sayur'   },
      siang:   { emoji: '🍱', name: 'Nasi + Tempe Goreng'},
      malam:   { emoji: '🍚', name: 'Nasi Goreng Sayuran'} },
    { day: 'Rab', date: '12', isToday: false,
      sarapan: { emoji: '🍞', name: 'Roti Bakar'         },
      siang:   { emoji: '🥣', name: 'Sup Kacang Hijau'   },
      malam:   { emoji: '🍲', name: 'Mie Rebus Sayur'    } },
    { day: 'Kam', date: '13', isToday: false,
      sarapan: { emoji: '🍌', name: 'Pisang Goreng'      },
      siang:   { emoji: '🍱', name: 'Nasi + Tempe Goreng'},
      malam:   { emoji: '🍵', name: 'Sup Tahu Bayam'     } },
    { day: 'Jum', date: '14', isToday: false,
      sarapan: { emoji: '🫘', name: 'Bubur Kacang Hijau' },
      siang:   { emoji: '🥗', name: 'Gado-Gado Unklab'  },
      malam:   { emoji: '🌿', name: 'Tumis Kangkung Tempe'} },
    { day: 'Sab', date: '15', isToday: false,
      sarapan: { emoji: '🍜', name: 'Mie Goreng Sayur'   },
      siang:   { emoji: '🥦', name: 'Capcay Goreng Tahu' },
      malam:   { emoji: '🍚', name: 'Nasi Goreng Sayuran'} },
    { day: 'Min', date: '16', isToday: false,
      sarapan: { emoji: '🍞', name: 'Roti Bakar'         },
      siang:   { emoji: '🥣', name: 'Sup Kacang Hijau'   },
      malam:   { emoji: '🍲', name: 'Mie Rebus Sayur'    } },
];

const FULL_MENU = [
    { id:1,  name:'Mie Goreng Sayur',       emoji:'🍜', cal:380, cat:'Sarapan',     tags:['VEGETARIAN'],           desc:'Mie goreng dengan wortel, kol & daun bawang', allergens:'Gluten' },
    { id:2,  name:'Bubur Kacang Hijau',     emoji:'🫘', cal:290, cat:'Sarapan',     tags:['VEGAN','SEHAT'],        desc:'Bubur kacang hijau hangat dengan santan & gula merah', allergens:'Tidak ada' },
    { id:3,  name:'Roti Bakar + Selai',     emoji:'🍞', cal:260, cat:'Sarapan',     tags:['VEGETARIAN'],           desc:'Roti tawar bakar dengan selai kacang & pisang', allergens:'Gluten, Kacang' },
    { id:4,  name:'Pisang Goreng',          emoji:'🍌', cal:220, cat:'Sarapan',     tags:['VEGAN'],                desc:'Pisang kepok goreng tepung renyah dengan madu', allergens:'Gluten' },
    { id:5,  name:'Nasi + Tempe Goreng',    emoji:'🍱', cal:410, cat:'Makan Siang', tags:['VEGETARIAN','FAVORIT'], desc:'Nasi putih dengan tempe goreng crispy & sambal tomat', allergens:'Kedelai' },
    { id:6,  name:'Sup Kacang Hijau',       emoji:'🥣', cal:300, cat:'Makan Siang', tags:['VEGAN','SEHAT'],        desc:'Sup kacang hijau hangat dengan jahe & rempah', allergens:'Tidak ada' },
    { id:7,  name:'Gado-Gado Unklab',       emoji:'🥗', cal:340, cat:'Makan Siang', tags:['VEGETARIAN','BEBAS GLUTEN'], desc:'Sayur rebus, tahu, tempe dengan saus kacang spesial', allergens:'Kacang' },
    { id:8,  name:'Capcay Goreng Tahu',     emoji:'🥦', cal:280, cat:'Makan Siang', tags:['VEGAN','SEHAT'],        desc:'Tumis sayuran campur dengan tahu & saus nabati', allergens:'Kedelai' },
    { id:9,  name:'Nasi Goreng Sayuran',    emoji:'🍚', cal:420, cat:'Makan Malam', tags:['VEGAN','FAVORIT'],      desc:'Nasi goreng brokoli, jagung manis & kecap manis', allergens:'Gluten' },
    { id:10, name:'Mie Rebus Sayur',        emoji:'🍲', cal:340, cat:'Makan Malam', tags:['VEGETARIAN'],           desc:'Mie rebus kuah bening dengan sayuran & tahu goreng', allergens:'Gluten' },
    { id:11, name:'Sup Tahu Bayam',         emoji:'🍵', cal:230, cat:'Makan Malam', tags:['VEGAN','SEHAT'],        desc:'Sup tahu sutra dengan bayam & kaldu sayur', allergens:'Kedelai' },
    { id:12, name:'Tumis Kangkung Tempe',   emoji:'🌿', cal:310, cat:'Makan Malam', tags:['VEGAN','BEBAS GLUTEN'], desc:'Kangkung tumis bawang putih dengan tempe goreng', allergens:'Kedelai' },
    { id:13, name:'Kolak Pisang Ubi',       emoji:'🍠', cal:260, cat:'Dessert',     tags:['VEGAN','BEBAS GLUTEN'], desc:'Kolak pisang & ubi merah santan dengan pandan', allergens:'Tidak ada' },
    { id:14, name:'Pudding Kelapa Muda',    emoji:'🍮', cal:190, cat:'Dessert',     tags:['VEGAN','BEBAS GLUTEN'], desc:'Pudding agar-agar kelapa muda & sirup pandan', allergens:'Tidak ada' },
];

// ─────────────────────────────────────────────────────────────────────────────
// ROOT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function StudentDashboard() {
    const router = useRouter();
    const [page, setPage] = useState<'home'|'menu'|'notif'|'feedback'>('home');

    // Rating state
    const [ratingModal, setRatingModal] = useState(false);
    const [ratingMeal, setRatingMeal] = useState<MealKey|null>(null);
    const [stars, setStars] = useState(0);
    const [rated, setRated] = useState<Set<MealKey>>(new Set());

    function tryOpenRating(meal: MealKey) {
        const s = getMealStatus(meal);
        if (s === 'upcoming') {
            Alert.alert('🔒 Belum Bisa Dinilai', 'Menu ini belum disajikan.\nRating hanya bisa diberikan setelah waktu makan selesai.');
            return;
        }
        if (s === 'serving') {
            Alert.alert('⏳ Makan Sedang Berlangsung', 'Waktu makan masih berlangsung.\nRating dapat diberikan setelah sesi makan selesai.');
            return;
        }
        if (rated.has(meal)) {
            Alert.alert('✅ Sudah Dinilai', 'Kamu sudah memberikan rating untuk menu ini.');
            return;
        }
        setRatingMeal(meal);
        setStars(0);
        setRatingModal(true);
    }

    function submitRating() {
        if (stars === 0) { Alert.alert('Pilih Bintang', 'Silakan pilih rating bintang terlebih dahulu.'); return; }
        setRated(prev => new Set([...prev, ratingMeal!]));
        setRatingModal(false);
        Alert.alert('Terima Kasih! 🎉', `Rating ${stars}⭐ untuk ${TODAY[ratingMeal!].name} berhasil dikirim!`);
    }

    const mealLabels: Record<MealKey,string> = { sarapan:'🌅 Sarapan', siang:'☀️ Makan Siang', malam:'🌙 Makan Malam' };
    const mealTimes:  Record<MealKey,string> = { sarapan:'06:00 – 08:30', siang:'11:30 – 13:30', malam:'17:30 – 19:30' };

    return (
        <SafeAreaView style={s.safe}>

            {/* ── HEADER ── */}
            <View style={s.header}>
                <View style={s.avatar}><Text style={s.avatarText}>A</Text></View>
                <View style={{ flex: 1, marginHorizontal: 12 }}>
                    <Text style={s.headerTitle}>Dining Dashboard</Text>
                    <Text style={s.headerSub}>🌱 Vegan · Asrama Unklab</Text>
                </View>
                <TouchableOpacity style={s.bellBtn} onPress={() => setPage('notif')}>
                    <Text style={{ fontSize: 20 }}>🔔</Text>
                    <View style={s.bellBadge}><Text style={s.bellBadgeText}>3</Text></View>
                </TouchableOpacity>
            </View>

            {/* ── PAGE CONTENT ── */}
            <View style={{ flex: 1 }}>

                {/* ══ HOME ══ */}
                {page === 'home' && (
                    <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

                        {/* Welcome */}
                        <View style={s.banner}>
                            <View>
                                <Text style={s.bannerTitle}>Selamat Datang, Alex! 👋</Text>
                                <Text style={s.bannerSub}>Selasa, 11 Maret 2025</Text>
                            </View>
                            <Text style={{ fontSize: 38 }}>🌿</Text>
                        </View>

                        {/* Vegan strip */}
                        <View style={s.veganStrip}>
                            <Text>🌱</Text>
                            <Text style={s.veganText}>Semua menu 100% bebas daging — sehat untuk tubuh & bumi</Text>
                        </View>

                        {/* ── TODAY'S MENU ── */}
                        <SectionHeader title="Menu Hari Ini" right={<View style={s.datePill}><Text style={s.datePillText}>Sel, 11 Mar</Text></View>} />

                        {(['sarapan','siang','malam'] as MealKey[]).map(meal => {
                            const status = getMealStatus(meal);
                            const food   = TODAY[meal];
                            const isRated = rated.has(meal);

                            const cardBg    = status === 'serving' ? 'rgba(4,120,87,0.05)'    : status === 'done' ? '#fff' : 'rgba(148,163,184,0.06)';
                            const cardBdr   = status === 'serving' ? 'rgba(4,120,87,0.25)'    : status === 'done' ? `rgba(236,127,19,0.15)` : 'rgba(148,163,184,0.2)';
                            const badgeBg   = status === 'serving' ? 'rgba(4,120,87,0.12)'    : status === 'done' ? 'rgba(236,127,19,0.1)'  : 'rgba(148,163,184,0.1)';
                            const badgeClr  = status === 'serving' ? GREEN                    : status === 'done' ? PRIMARY                 : '#94a3b8';
                            const badgeLbl  = status === 'serving' ? 'SEDANG DISAJIKAN'       : status === 'done' ? 'SELESAI'              : 'BELUM DIMULAI';

                            return (
                                <View key={meal} style={[s.mealCard, { backgroundColor: cardBg, borderColor: cardBdr }]}>

                                    {/* meal header */}
                                    <View style={s.mealHead}>
                                        <View>
                                            <Text style={[s.mealLabel, status === 'upcoming' && { color: '#94a3b8' }]}>{mealLabels[meal]}</Text>
                                            <Text style={s.mealTime}>{mealTimes[meal]}</Text>
                                        </View>
                                        <View style={[s.statusPill, { backgroundColor: badgeBg }]}>
                                            {status === 'serving' && <View style={s.liveBlip} />}
                                            <Text style={[s.statusPillText, { color: badgeClr }]}>{badgeLbl}</Text>
                                        </View>
                                    </View>

                                    {/* food row */}
                                    <View style={[s.foodRow, status === 'upcoming' && { opacity: 0.45 }]}>
                                        <View style={s.foodEmojiBox}>
                                            <Text style={{ fontSize: 38 }}>{food.emoji}</Text>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={s.foodName}>{food.name}</Text>
                                            <Text style={s.foodDesc} numberOfLines={2}>{food.desc}</Text>
                                            <View style={{ flexDirection:'row', alignItems:'center', gap:8, marginTop:7, flexWrap:'wrap' }}>
                                                <View style={s.calPill}><Text style={s.calPillText}>{food.cal} Kal</Text></View>
                                                {food.tags.map(tag => (
                                                    <View key={tag} style={[s.tag, tagBg(tag)]}>
                                                        <Text style={[s.tagText, tagClr(tag)]}>{tag}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>
                                    </View>

                                    {/* rating button */}
                                    <TouchableOpacity
                                        style={[s.rateBtn,
                                            isRated         ? s.rateBtnDone    :
                                            status==='done' ? s.rateBtnActive  :
                                                              s.rateBtnLocked  ]}
                                        onPress={() => tryOpenRating(meal)}
                                    >
                                        <Text style={[s.rateBtnText,
                                            isRated         ? { color: GREEN }    :
                                            status==='done' ? { color: '#fff' }   :
                                                              { color: '#94a3b8' }]}>
                                            { isRated         ? '✅ Sudah Dinilai'
                                            : status==='done' ? '⭐ Beri Rating Sekarang'
                                            : status==='serving' ? '⏳ Rating tersedia setelah selesai'
                                            :                  '🔒 Menu belum disajikan' }
                                        </Text>
                                    </TouchableOpacity>

                                </View>
                            );
                        })}

                        {/* Rating hint */}
                        <View style={s.hint}>
                            <Text>ℹ️</Text>
                            <Text style={s.hintText}>Rating hanya tersedia setelah waktu makan selesai.</Text>
                        </View>

                        {/* ── WEEKLY SCHEDULE ── */}
                        <SectionHeader title="Jadwal 1 Minggu ke Depan" />

                        <WeekSchedule />

                        {/* Hall info */}
                        <View style={s.hallCard}>
                            <View style={{ flex:1 }}>
                                <Text style={s.hallLabel}>LOKASI DINING HALL</Text>
                                <Text style={s.hallTitle}>Asrama Universitas Klabat</Text>
                                <Text style={s.hallAddr}>📍 Gedung Pusat, Lantai 1</Text>
                            </View>
                            <View style={s.hallIcon}><Text style={{ fontSize:28 }}>🗺️</Text></View>
                        </View>

                        <View style={{ height: 16 }} />
                    </ScrollView>
                )}

                {/* ══ MENU ══ */}
                {page === 'menu' && <FullMenuPage />}

                {/* ══ NOTIF ══ */}
                {page === 'notif' && <NotifPage />}

                {/* ══ FEEDBACK ══ */}
                {page === 'feedback' && <FeedbackPage />}

            </View>

            {/* ── BOTTOM NAV ── */}
            <View style={s.nav}>
                {([
                    { key:'home',     icon:'🏠', label:'Beranda'    },
                    { key:'menu',     icon:'🍽️', label:'Menu'       },
                    { key:'notif',    icon:'🔔', label:'Notifikasi' },
                    { key:'feedback', icon:'💬', label:'Feedback'   },
                ] as const).map(item => (
                    <TouchableOpacity key={item.key} style={s.navItem} onPress={() => setPage(item.key)}>
                        <Text style={page===item.key ? s.navIconOn : s.navIconOff}>{item.icon}</Text>
                        <Text style={page===item.key ? s.navLabelOn : s.navLabelOff}>{item.label}</Text>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity style={s.navItem} onPress={() => router.replace('/(auth)')}>
                    <Text style={s.navIconOff}>🚪</Text>
                    <Text style={s.navLabelOff}>Keluar</Text>
                </TouchableOpacity>
            </View>

            {/* ── RATING MODAL ── */}
            <Modal visible={ratingModal} transparent animationType="fade" onRequestClose={() => setRatingModal(false)}>
                <View style={s.overlay}>
                    <View style={s.modalBox}>
                        <Text style={s.modalTitle}>Nilai {ratingMeal ? { sarapan:'Sarapan', siang:'Makan Siang', malam:'Makan Malam' }[ratingMeal] : ''}</Text>
                        <Text style={s.modalSub}>
                            {ratingMeal ? `${TODAY[ratingMeal].emoji}  ${TODAY[ratingMeal].name}` : ''}
                        </Text>
                        <View style={{ flexDirection:'row', gap:8, marginBottom:8 }}>
                            {[1,2,3,4,5].map(n => (
                                <TouchableOpacity key={n} onPress={() => setStars(n)}>
                                    <Text style={{ fontSize:42, color: stars>=n ? '#f59e0b' : '#e2e8f0' }}>★</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <Text style={s.starLabel}>{['Pilih bintang','Tidak Enak','Kurang','Cukup','Enak','Sangat Enak! 🎉'][stars]}</Text>
                        <View style={{ flexDirection:'row', gap:12, width:'100%', marginTop:20 }}>
                            <TouchableOpacity style={s.btnCancel} onPress={() => setRatingModal(false)}>
                                <Text style={s.btnCancelText}>Batal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={s.btnSubmit} onPress={submitRating}>
                                <Text style={s.btnSubmitText}>Kirim Rating</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// WEEKLY SCHEDULE SUB-COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function WeekSchedule() {
    const [sel, setSel] = useState(1); // index 1 = today (Sel)
    const d = WEEK[sel];
    return (
        <View style={{ marginBottom: 20 }}>
            {/* Day chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap:8, paddingVertical:4 }}>
                {WEEK.map((w, i) => (
                    <TouchableOpacity
                        key={w.date}
                        onPress={() => setSel(i)}
                        style={[s.dayChip, sel===i && s.dayChipSel, w.isToday && sel!==i && s.dayChipToday]}
                    >
                        <Text style={[s.dayChipDay,  sel===i && { color:'#fff' }]}>{w.day}</Text>
                        <Text style={[s.dayChipDate, sel===i && { color:'#fff' }]}>{w.date}</Text>
                        {w.isToday && <View style={[s.todayDot, sel===i && { backgroundColor:'rgba(255,255,255,0.7)' }]} />}
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Detail card */}
            <View style={s.weekCard}>
                <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
                    <Text style={s.weekCardTitle}>{d.day}, {d.date} Maret 2025</Text>
                    {d.isToday && <View style={s.todayBadge}><Text style={s.todayBadgeText}>HARI INI</Text></View>}
                </View>
                {([
                    { label:'🌅 Sarapan',     time:'06:00–08:30', food: d.sarapan },
                    { label:'☀️ Makan Siang', time:'11:30–13:30', food: d.siang   },
                    { label:'🌙 Makan Malam', time:'17:30–19:30', food: d.malam   },
                ]).map(({ label, time, food }, idx) => (
                    <View key={label} style={[s.weekRow, idx === 2 && { borderBottomWidth:0 }]}>
                        <View>
                            <Text style={s.weekRowLabel}>{label}</Text>
                            <Text style={s.weekRowTime}>{time}</Text>
                        </View>
                        <View style={{ flexDirection:'row', alignItems:'center', gap:6 }}>
                            <Text style={{ fontSize:22 }}>{food.emoji}</Text>
                            <Text style={s.weekRowFood}>{food.name}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// FULL MENU PAGE
// ─────────────────────────────────────────────────────────────────────────────

function FullMenuPage() {
    const [q, setQ] = useState('');
    const [detail, setDetail] = useState<typeof FULL_MENU[0]|null>(null);
    const cats = ['Sarapan','Makan Siang','Makan Malam','Dessert'];
    const filtered = FULL_MENU.filter(m => m.name.toLowerCase().includes(q.toLowerCase()) || m.desc.toLowerCase().includes(q.toLowerCase()));

    return (
        <View style={{ flex:1 }}>
            {/* Search */}
            <View style={s.searchBar}>
                <Text>🔍</Text>
                <TextInput style={s.searchInput} value={q} onChangeText={setQ} placeholder="Cari menu..." placeholderTextColor="#9ca3af" />
                {q.length>0 && <TouchableOpacity onPress={()=>setQ('')}><Text style={{color:'#94a3b8'}}>✕</Text></TouchableOpacity>}
            </View>

            <ScrollView contentContainerStyle={{ padding:16, paddingBottom:90 }} showsVerticalScrollIndicator={false}>
                <View style={s.menuBanner}>
                    <Text>🌱</Text>
                    <Text style={{ fontSize:12, color:'#065f46', fontWeight:'500', flex:1 }}>Semua menu 100% nabati · Bebas daging</Text>
                </View>

                {cats.map(cat => {
                    const items = filtered.filter(m => m.cat === cat);
                    if (!items.length) return null;
                    const catEmoji = { Sarapan:'🌅', 'Makan Siang':'☀️', 'Makan Malam':'🌙', Dessert:'🍮' }[cat];
                    return (
                        <View key={cat}>
                            <Text style={s.menuCatLabel}>{catEmoji} {cat}</Text>
                            {items.map(item => (
                                <TouchableOpacity key={item.id} style={s.menuRow} onPress={() => setDetail(item)}>
                                    <View style={s.menuRowEmoji}><Text style={{fontSize:32}}>{item.emoji}</Text></View>
                                    <View style={{ flex:1, paddingVertical:12, paddingRight:12 }}>
                                        <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start' }}>
                                            <Text style={s.menuRowName}>{item.name}</Text>
                                            <View style={s.calPill}><Text style={s.calPillText}>{item.cal} Kal</Text></View>
                                        </View>
                                        <Text style={s.menuRowDesc} numberOfLines={1}>{item.desc}</Text>
                                        <View style={{ flexDirection:'row', gap:4, marginTop:5, flexWrap:'wrap' }}>
                                            {item.tags.map(tag => (
                                                <View key={tag} style={[s.tag, tagBg(tag)]}><Text style={[s.tagText, tagClr(tag)]}>{tag}</Text></View>
                                            ))}
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    );
                })}
            </ScrollView>

            {/* Detail sheet */}
            <Modal visible={!!detail} transparent animationType="slide" onRequestClose={() => setDetail(null)}>
                <View style={s.sheetOverlay}>
                    <View style={s.sheet}>
                        <TouchableOpacity style={s.sheetClose} onPress={() => setDetail(null)}>
                            <Text style={{ fontSize:14, color:'#64748b', fontWeight:'600' }}>✕</Text>
                        </TouchableOpacity>
                        <Text style={{ fontSize:64, textAlign:'center', marginBottom:8 }}>{detail?.emoji}</Text>
                        <Text style={s.detailName}>{detail?.name}</Text>
                        <Text style={{ fontSize:13, color:PRIMARY, textAlign:'center', fontWeight:'600', marginBottom:8 }}>{detail?.cat}</Text>
                        <Text style={{ fontSize:14, color:'#475569', textAlign:'center', lineHeight:22, marginBottom:16 }}>{detail?.desc}</Text>
                        <View style={s.detailCalCard}>
                            <Text style={{ fontSize:12, color:'#64748b' }}>Kalori</Text>
                            <Text style={{ fontSize:24, fontWeight:'bold', color:PRIMARY, marginTop:2 }}>{detail?.cal} Kal</Text>
                        </View>
                        <View style={s.allergenRow}>
                            <Text style={{ fontSize:13, fontWeight:'600', color:'#92400e' }}>⚠️ Alergen:</Text>
                            <Text style={{ fontSize:13, color:'#78350f' }}>{detail?.allergens}</Text>
                        </View>
                        <View style={{ flexDirection:'row', gap:6, marginTop:10, flexWrap:'wrap' }}>
                            {detail?.tags.map(tag => (
                                <View key={tag} style={[s.tag, tagBg(tag)]}><Text style={[s.tagText, tagClr(tag)]}>{tag}</Text></View>
                            ))}
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// NOTIF PAGE
// ─────────────────────────────────────────────────────────────────────────────

function NotifPage() {
    const INIT = [
        { id:1, type:'schedule', title:'🍜 Menu Hari Ini Sudah Tersedia', body:'Sarapan: Mie Goreng Sayur · Siang: Nasi + Tempe · Malam: Nasi Goreng Sayuran', time:'5 mnt lalu', read:false },
        { id:2, type:'alert',    title:'⚠️ Jam Operasional Berubah',      body:'Dining Hall tutup lebih awal pukul 19:00 WITA karena acara asrama malam ini.', time:'1 jam lalu', read:false },
        { id:3, type:'promo',    title:'🌱 Menu Baru: Sup Tahu Bayam',     body:'Menu baru tersedia mulai makan malam hari ini. Kaya protein nabati!', time:'3 jam lalu', read:false },
        { id:4, type:'info',     title:'📋 Jadwal Minggu Ini Diperbarui',  body:'Jadwal menu 7 hari ke depan sudah tersedia. Cek tab Beranda.', time:'Kemarin', read:true },
        { id:5, type:'info',     title:'🕐 Jam Makan Asrama',             body:'Sarapan 06:00–08:30 · Siang 11:30–13:30 · Malam 17:30–19:30 WITA.', time:'2 hari lalu', read:true },
    ];
    const [notifs, setNotifs] = useState(INIT);
    const typeColor: Record<string,string> = { schedule:PRIMARY, alert:'#dc2626', promo:GREEN, info:'#1d4ed8' };
    const unread = notifs.filter(n => !n.read).length;

    return (
        <ScrollView contentContainerStyle={{ padding:16, paddingBottom:90 }}>
            <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                <Text style={{ fontSize:20, fontWeight:'bold', color:'#0f172a' }}>Notifikasi</Text>
                {unread > 0 && (
                    <TouchableOpacity onPress={() => setNotifs(p => p.map(n => ({ ...n, read:true })))}>
                        <Text style={{ fontSize:13, color:PRIMARY, fontWeight:'600' }}>Baca Semua</Text>
                    </TouchableOpacity>
                )}
            </View>
            <View style={{ flexDirection:'row', gap:10, marginBottom:16 }}>
                {[{ val:unread, label:'Belum Dibaca', clr:'#ef4444' }, { val:notifs.length, label:'Total', clr:'#0f172a' }].map(({ val, label, clr }) => (
                    <View key={label} style={s.notifStat}>
                        <Text style={[s.notifStatNum, { color:clr }]}>{val}</Text>
                        <Text style={s.notifStatLabel}>{label}</Text>
                    </View>
                ))}
            </View>
            {notifs.map(n => (
                <TouchableOpacity key={n.id} style={[s.notifCard, !n.read && { borderColor:typeColor[n.type], backgroundColor:`${typeColor[n.type]}09` }]} onPress={() => setNotifs(p => p.map(x => x.id===n.id ? {...x, read:true} : x))}>
                    <View style={[s.notifDot, { backgroundColor: n.read ? '#e2e8f0' : typeColor[n.type] }]} />
                    <View style={{ flex:1 }}>
                        <Text style={[{ fontSize:14, fontWeight:'bold', color:'#0f172a', lineHeight:20 }, n.read && { fontWeight:'500', color:'#475569' }]}>{n.title}</Text>
                        <Text style={{ fontSize:13, color:'#64748b', marginTop:4, lineHeight:19 }}>{n.body}</Text>
                        <Text style={{ fontSize:11, color:'#94a3b8', marginTop:6 }}>{n.time}</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// FEEDBACK PAGE
// ─────────────────────────────────────────────────────────────────────────────

function FeedbackPage() {
    const FOODS = ['Mie Goreng Sayur','Bubur Kacang Hijau','Roti Bakar + Selai','Pisang Goreng','Nasi + Tempe Goreng','Sup Kacang Hijau','Gado-Gado Unklab','Capcay Goreng Tahu','Nasi Goreng Sayuran','Mie Rebus Sayur','Sup Tahu Bayam','Tumis Kangkung Tempe','Lainnya'];
    const [food, setFood] = useState('');
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [anon, setAnon] = useState(false);
    const [picker, setPicker] = useState(false);
    const [done, setDone] = useState(false);

    function submit() {
        if (!food)                          { Alert.alert('Form Belum Lengkap', 'Pilih menu yang ingin dinilai.'); return; }
        if (rating === 0)                   { Alert.alert('Form Belum Lengkap', 'Berikan rating bintang.'); return; }
        if (comment.trim().length < 10)     { Alert.alert('Form Belum Lengkap', 'Tulis komentar minimal 10 karakter.'); return; }
        setDone(true);
    }

    if (done) return (
        <View style={s.successBox}>
            <Text style={{ fontSize:60, marginBottom:16 }}>🎉</Text>
            <Text style={s.successTitle}>Feedback Terkirim!</Text>
            <Text style={s.successSub}>Terima kasih{!anon ? ', Alex' : ''}! Pendapatmu sangat berarti bagi Dining Unklab.</Text>
            <View style={s.successCard}>
                <Text style={{ fontSize:12, color:'#94a3b8', marginBottom:4 }}>Menu yang dinilai</Text>
                <Text style={{ fontSize:16, fontWeight:'bold', color:'#0f172a', marginBottom:10 }}>{food}</Text>
                <View style={{ flexDirection:'row', gap:4 }}>
                    {[1,2,3,4,5].map(n => <Text key={n} style={{ fontSize:22, color: n<=rating ? '#f59e0b' : '#e2e8f0' }}>★</Text>)}
                </View>
            </View>
            <TouchableOpacity style={[s.btnSubmit, { width:'100%', marginBottom:12 }]} onPress={() => { setFood(''); setRating(0); setComment(''); setAnon(false); setDone(false); }}>
                <Text style={s.btnSubmitText}>Kirim Lagi</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <ScrollView contentContainerStyle={{ padding:16, paddingBottom:90 }}>
            <View style={[s.menuBanner, { marginBottom:20 }]}>
                <Text>💬</Text>
                <Text style={{ fontSize:13, color:'#065f46', flex:1, lineHeight:19 }}>Pendapatmu membantu kami menyajikan menu vegan yang lebih lezat setiap hari!</Text>
            </View>

            <Text style={s.fbLabel}>Menu yang Dinilai *</Text>
            <TouchableOpacity style={s.pickerBtn} onPress={() => setPicker(true)}>
                <Text style={[{ fontSize:14, flex:1 }, !food && { color:'#9ca3af' }]}>{food || 'Pilih menu makanan...'}</Text>
                <Text style={{ color:'#94a3b8', fontSize:12 }}>▼</Text>
            </TouchableOpacity>

            <Text style={s.fbLabel}>Rating *</Text>
            <View style={{ flexDirection:'row', alignItems:'center', gap:6, marginBottom:20 }}>
                {[1,2,3,4,5].map(n => (
                    <TouchableOpacity key={n} onPress={() => setRating(n)}>
                        <Text style={{ fontSize:38, color: rating>=n ? '#f59e0b' : '#e2e8f0' }}>★</Text>
                    </TouchableOpacity>
                ))}
                {rating>0 && <Text style={{ fontSize:13, color:'#475569', fontWeight:'600' }}>{['','Tidak Puas','Kurang','Cukup','Puas','Sangat Puas! 🎉'][rating]}</Text>}
            </View>

            <Text style={s.fbLabel}>Komentar / Saran *</Text>
            <TextInput
                style={s.textarea}
                value={comment} onChangeText={setComment}
                multiline numberOfLines={5}
                placeholder="Ceritakan pengalamanmu... (min. 10 karakter)"
                placeholderTextColor="#9ca3af" textAlignVertical="top"
            />
            <Text style={{ fontSize:11, color:'#94a3b8', textAlign:'right', marginTop:4, marginBottom:18 }}>{comment.length} karakter</Text>

            <TouchableOpacity style={s.anonRow} onPress={() => setAnon(!anon)}>
                <View style={[s.checkbox, anon && s.checkboxOn]}>
                    {anon && <Text style={{ color:'#fff', fontSize:12, fontWeight:'bold' }}>✓</Text>}
                </View>
                <View style={{ flex:1 }}>
                    <Text style={{ fontSize:14, fontWeight:'600', color:'#0f172a' }}>Kirim sebagai Anonim</Text>
                    <Text style={{ fontSize:12, color:'#64748b', marginTop:2 }}>Identitasmu tidak akan ditampilkan</Text>
                </View>
                <Text style={{ fontSize:20 }}>{anon ? '🎭' : '👤'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[s.btnSubmit, { width:'100%', marginTop:20 }]} onPress={submit}>
                <Text style={s.btnSubmitText}>📨 Kirim Feedback</Text>
            </TouchableOpacity>

            {/* Food picker modal */}
            <Modal visible={picker} transparent animationType="slide" onRequestClose={() => setPicker(false)}>
                <View style={s.sheetOverlay}>
                    <View style={s.sheet}>
                        <View style={s.sheetHandle} />
                        <Text style={{ fontSize:18, fontWeight:'bold', color:'#0f172a', marginBottom:14 }}>Pilih Menu</Text>
                        <ScrollView>
                            {FOODS.map(f => (
                                <TouchableOpacity key={f} style={[s.pickerOpt, food===f && s.pickerOptActive]} onPress={() => { setFood(f); setPicker(false); }}>
                                    <Text style={[{ fontSize:15, color:'#334155' }, food===f && { color:PRIMARY, fontWeight:'600' }]}>{f}</Text>
                                    {food===f && <Text style={{ color:PRIMARY, fontWeight:'bold' }}>✓</Text>}
                                </TouchableOpacity>
                            ))}
                            <View style={{ height:24 }} />
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function SectionHeader({ title, right }: { title: string; right?: React.ReactNode }) {
    return (
        <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
            <Text style={{ fontSize:18, fontWeight:'bold', color:'#0f172a' }}>{title}</Text>
            {right}
        </View>
    );
}

function tagBg(tag: string) {
    const map: Record<string,object> = {
        VEGAN:        { backgroundColor:'rgba(4,120,87,0.12)'    },
        VEGETARIAN:   { backgroundColor:'rgba(21,128,61,0.1)'    },
        SEHAT:        { backgroundColor:'rgba(29,78,216,0.1)'    },
        'BEBAS GLUTEN':{ backgroundColor:'rgba(139,92,246,0.1)'  },
        FAVORIT:      { backgroundColor:'rgba(236,127,19,0.1)'   },
    };
    return map[tag] ?? { backgroundColor:'rgba(236,127,19,0.1)' };
}
function tagClr(tag: string) {
    const map: Record<string,object> = {
        VEGAN:        { color:'#047857' },
        VEGETARIAN:   { color:'#15803d' },
        SEHAT:        { color:'#1d4ed8' },
        'BEBAS GLUTEN':{ color:'#7c3aed' },
        FAVORIT:      { color:PRIMARY   },
    };
    return map[tag] ?? { color:PRIMARY };
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
    safe:         { flex:1, backgroundColor:BG, paddingTop: Platform.OS==='android' ? StatusBar.currentHeight : 0 },

    // Header
    header:       { flexDirection:'row', alignItems:'center', padding:16, backgroundColor:'#fff', borderBottomWidth:1, borderBottomColor:'rgba(236,127,19,0.08)' },
    avatar:       { width:40, height:40, borderRadius:20, backgroundColor:PRIMARY, alignItems:'center', justifyContent:'center' },
    avatarText:   { color:'#fff', fontWeight:'bold', fontSize:16 },
    headerTitle:  { fontSize:17, fontWeight:'bold', color:'#0f172a' },
    headerSub:    { fontSize:11, color:GREEN, fontWeight:'600', marginTop:1 },
    bellBtn:      { width:40, height:40, borderRadius:20, backgroundColor:'rgba(236,127,19,0.1)', alignItems:'center', justifyContent:'center' },
    bellBadge:    { position:'absolute', top:4, right:4, width:14, height:14, borderRadius:7, backgroundColor:'#ef4444', alignItems:'center', justifyContent:'center' },
    bellBadgeText:{ color:'#fff', fontSize:8, fontWeight:'bold' },

    // Scroll
    scroll:       { padding:16, paddingBottom:90 },

    // Banner
    banner:       { backgroundColor:PRIMARY, borderRadius:16, padding:20, flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:14, shadowColor:PRIMARY, shadowOffset:{width:0,height:4}, shadowOpacity:0.25, shadowRadius:8, elevation:5 },
    bannerTitle:  { fontSize:18, fontWeight:'bold', color:'#fff' },
    bannerSub:    { fontSize:12, color:'rgba(255,255,255,0.8)', marginTop:3 },

    // Vegan
    veganStrip:   { flexDirection:'row', alignItems:'center', backgroundColor:'rgba(4,120,87,0.07)', borderRadius:10, paddingHorizontal:14, paddingVertical:10, gap:8, borderWidth:1, borderColor:'rgba(4,120,87,0.15)', marginBottom:20 },
    veganText:    { fontSize:12, color:'#065f46', fontWeight:'500', flex:1 },

    // Pills / badges
    datePill:     { backgroundColor:'rgba(236,127,19,0.1)', paddingHorizontal:10, paddingVertical:4, borderRadius:12 },
    datePillText: { color:PRIMARY, fontSize:11, fontWeight:'bold' },
    calPill:      { backgroundColor:'rgba(236,127,19,0.1)', paddingHorizontal:8, paddingVertical:3, borderRadius:8 },
    calPillText:  { color:PRIMARY, fontSize:11, fontWeight:'bold' },
    tag:          { paddingHorizontal:6, paddingVertical:2, borderRadius:8 },
    tagText:      { fontSize:9, fontWeight:'bold' },

    // Meal card
    mealCard:     { borderRadius:16, marginBottom:14, borderWidth:1.5, overflow:'hidden' },
    mealHead:     { flexDirection:'row', justifyContent:'space-between', alignItems:'center', padding:14, paddingBottom:10 },
    mealLabel:    { fontSize:15, fontWeight:'bold', color:'#0f172a' },
    mealTime:     { fontSize:11, color:'#94a3b8', marginTop:2 },
    statusPill:   { flexDirection:'row', alignItems:'center', paddingHorizontal:9, paddingVertical:4, borderRadius:12, gap:4 },
    statusPillText:{ fontSize:9, fontWeight:'bold', letterSpacing:0.3 },
    liveBlip:     { width:6, height:6, borderRadius:3, backgroundColor:GREEN },
    foodRow:      { flexDirection:'row', paddingHorizontal:14, paddingBottom:14, gap:12 },
    foodEmojiBox: { width:72, height:72, borderRadius:14, backgroundColor:'rgba(4,120,87,0.06)', alignItems:'center', justifyContent:'center' },
    foodName:     { fontSize:15, fontWeight:'bold', color:'#0f172a' },
    foodDesc:     { fontSize:12, color:'#64748b', marginTop:3, lineHeight:17 },

    // Rate button
    rateBtn:      { marginHorizontal:14, marginBottom:14, paddingVertical:12, borderRadius:12, alignItems:'center' },
    rateBtnActive:{ backgroundColor:PRIMARY, shadowColor:PRIMARY, shadowOffset:{width:0,height:3}, shadowOpacity:0.2, shadowRadius:6, elevation:3 },
    rateBtnDone:  { backgroundColor:'rgba(4,120,87,0.1)', borderWidth:1, borderColor:'rgba(4,120,87,0.2)' },
    rateBtnLocked:{ backgroundColor:'rgba(148,163,184,0.1)', borderWidth:1, borderColor:'rgba(148,163,184,0.2)' },
    rateBtnText:  { fontWeight:'bold', fontSize:13 },

    // Hint
    hint:         { flexDirection:'row', alignItems:'center', gap:8, backgroundColor:'rgba(29,78,216,0.06)', borderRadius:10, padding:12, marginBottom:24, borderWidth:1, borderColor:'rgba(29,78,216,0.1)' },
    hintText:     { fontSize:12, color:'#1d4ed8', flex:1, fontWeight:'500' },

    // Week schedule
    dayChip:      { width:52, height:62, borderRadius:14, backgroundColor:'#fff', alignItems:'center', justifyContent:'center', borderWidth:1.5, borderColor:'rgba(236,127,19,0.1)' },
    dayChipSel:   { backgroundColor:PRIMARY, borderColor:PRIMARY },
    dayChipToday: { borderColor:PRIMARY, borderWidth:2 },
    dayChipDay:   { fontSize:11, fontWeight:'600', color:'#64748b' },
    dayChipDate:  { fontSize:17, fontWeight:'bold', color:'#0f172a', marginTop:1 },
    todayDot:     { width:5, height:5, borderRadius:3, backgroundColor:PRIMARY, marginTop:3 },
    weekCard:     { backgroundColor:'#fff', borderRadius:16, padding:16, marginTop:10, borderWidth:1, borderColor:'rgba(236,127,19,0.1)' },
    weekCardTitle:{ fontSize:15, fontWeight:'bold', color:'#0f172a' },
    todayBadge:   { backgroundColor:PRIMARY, paddingHorizontal:8, paddingVertical:3, borderRadius:10 },
    todayBadgeText:{ color:'#fff', fontSize:9, fontWeight:'bold' },
    weekRow:      { flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingVertical:11, borderBottomWidth:1, borderBottomColor:'rgba(236,127,19,0.06)' },
    weekRowLabel: { fontSize:13, fontWeight:'600', color:'#0f172a' },
    weekRowTime:  { fontSize:11, color:'#94a3b8', marginTop:1 },
    weekRowFood:  { fontSize:13, color:'#475569', fontWeight:'500', maxWidth:160 },

    // Hall card
    hallCard:     { backgroundColor:'#1e293b', borderRadius:16, padding:18, flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
    hallLabel:    { color:'rgba(255,255,255,0.6)', fontSize:9, fontWeight:'bold', letterSpacing:1 },
    hallTitle:    { color:'#fff', fontSize:16, fontWeight:'bold', marginTop:3 },
    hallAddr:     { color:'rgba(255,255,255,0.65)', fontSize:11, marginTop:4 },
    hallIcon:     { backgroundColor:'rgba(255,255,255,0.1)', padding:12, borderRadius:12 },

    // Bottom nav
    nav:          { position:'absolute', bottom:0, left:0, right:0, backgroundColor:'#fff', borderTopWidth:1, borderTopColor:'rgba(236,127,19,0.1)', flexDirection:'row', justifyContent:'space-around', paddingVertical:8, paddingBottom: Platform.OS==='ios' ? 24 : 8 },
    navItem:      { alignItems:'center', justifyContent:'center' },
    navIconOn:    { fontSize:22, color:PRIMARY },
    navIconOff:   { fontSize:22, color:'#94a3b8' },
    navLabelOn:   { fontSize:9, fontWeight:'bold', color:PRIMARY, marginTop:2 },
    navLabelOff:  { fontSize:9, fontWeight:'bold', color:'#94a3b8', marginTop:2 },

    // Modal
    overlay:      { flex:1, backgroundColor:'rgba(15,23,42,0.55)', justifyContent:'center', alignItems:'center', padding:24 },
    modalBox:     { width:'100%', maxWidth:340, backgroundColor:'#fff', borderRadius:20, padding:24, alignItems:'center' },
    modalTitle:   { fontSize:20, fontWeight:'bold', color:'#0f172a', marginBottom:4 },
    modalSub:     { fontSize:14, color:'#64748b', marginBottom:20, textAlign:'center' },
    starLabel:    { fontSize:14, color:'#475569', fontWeight:'500', height:20 },
    btnCancel:    { flex:1, paddingVertical:12, borderRadius:12, borderWidth:1.5, borderColor:'rgba(236,127,19,0.2)', alignItems:'center' },
    btnCancelText:{ color:'#64748b', fontWeight:'600', fontSize:14 },
    btnSubmit:    { flex:1, paddingVertical:12, borderRadius:12, backgroundColor:PRIMARY, alignItems:'center' },
    btnSubmitText:{ color:'#fff', fontWeight:'bold', fontSize:14 },

    // Full menu
    searchBar:    { flexDirection:'row', alignItems:'center', margin:16, backgroundColor:'#fff', borderRadius:12, paddingHorizontal:14, borderWidth:1, borderColor:'rgba(236,127,19,0.15)', gap:8 },
    searchInput:  { flex:1, paddingVertical:11, color:'#0f172a', fontSize:14 },
    menuBanner:   { flexDirection:'row', alignItems:'center', backgroundColor:'rgba(4,120,87,0.07)', borderRadius:10, padding:12, marginBottom:16, gap:8, borderWidth:1, borderColor:'rgba(4,120,87,0.15)' },
    menuCatLabel: { fontSize:15, fontWeight:'bold', color:'#0f172a', marginBottom:8, marginTop:6 },
    menuRow:      { flexDirection:'row', backgroundColor:'#fff', borderRadius:14, marginBottom:10, overflow:'hidden', borderWidth:1, borderColor:'rgba(236,127,19,0.08)' },
    menuRowEmoji: { width:70, backgroundColor:'rgba(4,120,87,0.05)', alignItems:'center', justifyContent:'center' },
    menuRowName:  { fontSize:14, fontWeight:'bold', color:'#0f172a', flex:1 },
    menuRowDesc:  { fontSize:12, color:'#64748b', marginTop:3, marginBottom:5 },

    // Sheet modal
    sheetOverlay: { flex:1, backgroundColor:'rgba(15,23,42,0.5)', justifyContent:'flex-end' },
    sheet:        { backgroundColor:'#fff', borderTopLeftRadius:24, borderTopRightRadius:24, padding:24, maxHeight:'80%' },
    sheetHandle:  { width:40, height:4, backgroundColor:'#e2e8f0', borderRadius:2, alignSelf:'center', marginBottom:16 },
    sheetClose:   { position:'absolute', top:16, right:16, width:32, height:32, borderRadius:16, backgroundColor:'rgba(100,116,139,0.1)', alignItems:'center', justifyContent:'center' },
    detailName:   { fontSize:22, fontWeight:'bold', color:'#0f172a', textAlign:'center', marginBottom:4 },
    detailCalCard:{ backgroundColor:'rgba(236,127,19,0.08)', borderRadius:12, padding:14, alignItems:'center', marginBottom:12, width:'60%', alignSelf:'center' },
    allergenRow:  { flexDirection:'row', alignItems:'center', backgroundColor:'rgba(245,158,11,0.08)', borderRadius:10, padding:12, gap:8, marginBottom:4 },

    // Notif
    notifStat:     { flex:1, backgroundColor:'#fff', borderRadius:12, padding:14, alignItems:'center', borderWidth:1, borderColor:'rgba(236,127,19,0.1)' },
    notifStatNum:  { fontSize:22, fontWeight:'bold' },
    notifStatLabel:{ fontSize:11, color:'#94a3b8', marginTop:2 },
    notifCard:     { flexDirection:'row', backgroundColor:'#fff', borderRadius:14, marginBottom:10, padding:14, borderWidth:1, borderColor:'rgba(236,127,19,0.08)', gap:12 },
    notifDot:      { width:10, height:10, borderRadius:5, marginTop:4, flexShrink:0 },

    // Feedback
    fbLabel:      { fontSize:14, fontWeight:'700', color:'#0f172a', marginBottom:8 },
    pickerBtn:    { flexDirection:'row', alignItems:'center', justifyContent:'space-between', backgroundColor:'#fff', borderWidth:1.5, borderColor:'rgba(236,127,19,0.2)', borderRadius:12, paddingHorizontal:16, paddingVertical:14, marginBottom:20 },
    textarea:     { backgroundColor:'#fff', borderWidth:1.5, borderColor:'rgba(236,127,19,0.2)', borderRadius:12, padding:14, color:'#0f172a', fontSize:14, minHeight:110, lineHeight:22 },
    anonRow:      { flexDirection:'row', alignItems:'center', gap:12, backgroundColor:'#fff', borderRadius:14, padding:16, borderWidth:1, borderColor:'rgba(236,127,19,0.1)' },
    checkbox:     { width:22, height:22, borderRadius:6, borderWidth:1.5, borderColor:'rgba(236,127,19,0.4)', alignItems:'center', justifyContent:'center' },
    checkboxOn:   { backgroundColor:PRIMARY, borderColor:PRIMARY },
    pickerOpt:    { flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingVertical:14, borderBottomWidth:1, borderBottomColor:'rgba(236,127,19,0.06)' },
    pickerOptActive:{ backgroundColor:'rgba(236,127,19,0.05)', borderRadius:8, paddingHorizontal:6 },

    // Success
    successBox:   { flex:1, justifyContent:'center', alignItems:'center', padding:32 },
    successTitle: { fontSize:24, fontWeight:'bold', color:'#0f172a', marginBottom:10 },
    successSub:   { fontSize:14, color:'#64748b', textAlign:'center', lineHeight:22, marginBottom:20 },
    successCard:  { width:'100%', backgroundColor:'#fff', borderRadius:16, padding:18, alignItems:'center', borderWidth:1, borderColor:'rgba(236,127,19,0.15)', marginBottom:20 },
});