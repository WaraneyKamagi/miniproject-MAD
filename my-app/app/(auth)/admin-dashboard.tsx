import React, { useState } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, Platform, StatusBar,
    ScrollView, TouchableOpacity, Modal, Alert, TextInput
} from 'react-native';
import { useRouter } from 'expo-router';

const PRIMARY_COLOR = '#ec7f13';
const BG_LIGHT = '#f8f7f6';

// ─── DATA ─────────────────────────────────────────────────────────────────────

type StockItem = {
    id: number; name: string; stock: number; unit: string;
    min: number; category: string; lastUpdate: string;
    status: 'healthy' | 'low' | 'critical';
};

type MenuItem = {
    id: number; name: string; category: string; cal: number;
    available: boolean; tags: string[]; emoji: string;
};

type UpdateItem = {
    id: number; type: 'order' | 'menu' | 'alert' | 'feedback';
    title: string; desc: string; time: string;
};

const INITIAL_STOCK: StockItem[] = [
    { id: 1, name: 'Beras', stock: 500, unit: 'kg', min: 100, category: 'Pokok', lastUpdate: '10 Mar 2025', status: 'healthy' },
    { id: 2, name: 'Mie Telur', stock: 45, unit: 'kg', min: 50, category: 'Pokok', lastUpdate: '10 Mar 2025', status: 'low' },
    { id: 3, name: 'Tempe', stock: 8, unit: 'kg', min: 30, category: 'Protein Nabati', lastUpdate: '9 Mar 2025', status: 'critical' },
    { id: 4, name: 'Tahu', stock: 6, unit: 'kg', min: 25, category: 'Protein Nabati', lastUpdate: '9 Mar 2025', status: 'critical' },
    { id: 5, name: 'Kacang Hijau', stock: 28, unit: 'kg', min: 20, category: 'Polong', lastUpdate: '8 Mar 2025', status: 'healthy' },
    { id: 6, name: 'Bayam', stock: 12, unit: 'kg', min: 15, category: 'Sayuran', lastUpdate: '10 Mar 2025', status: 'low' },
    { id: 7, name: 'Minyak Goreng', stock: 5, unit: 'L', min: 20, category: 'Bahan Masak', lastUpdate: '8 Mar 2025', status: 'critical' },
    { id: 8, name: 'Wortel', stock: 40, unit: 'kg', min: 20, category: 'Sayuran', lastUpdate: '10 Mar 2025', status: 'healthy' },
    { id: 9, name: 'Kol / Kubis', stock: 35, unit: 'kg', min: 15, category: 'Sayuran', lastUpdate: '10 Mar 2025', status: 'healthy' },
    { id: 10, name: 'Brokoli', stock: 18, unit: 'kg', min: 12, category: 'Sayuran', lastUpdate: '9 Mar 2025', status: 'healthy' },
    { id: 11, name: 'Kangkung', stock: 10, unit: 'kg', min: 12, category: 'Sayuran', lastUpdate: '9 Mar 2025', status: 'low' },
    { id: 12, name: 'Pisang', stock: 60, unit: 'kg', min: 20, category: 'Buah', lastUpdate: '10 Mar 2025', status: 'healthy' },
    { id: 13, name: 'Bumbu Dapur', stock: 18, unit: 'kg', min: 10, category: 'Bumbu', lastUpdate: '7 Mar 2025', status: 'healthy' },
    { id: 14, name: 'Santan', stock: 8, unit: 'L', min: 15, category: 'Bahan Masak', lastUpdate: '8 Mar 2025', status: 'low' },
];

const INITIAL_MENUS: MenuItem[] = [
    { id: 1, name: 'Mie Goreng Sayur', category: 'Sarapan', cal: 380, available: true, tags: ['VEGETARIAN', 'FAVORIT'], emoji: '🍜' },
    { id: 2, name: 'Bubur Kacang Hijau', category: 'Sarapan', cal: 290, available: true, tags: ['VEGAN', 'SEHAT'], emoji: '🫘' },
    { id: 3, name: 'Roti Bakar + Selai Kacang', category: 'Sarapan', cal: 260, available: true, tags: ['VEGETARIAN'], emoji: '🍞' },
    { id: 4, name: 'Pisang Goreng', category: 'Sarapan', cal: 220, available: true, tags: ['VEGAN'], emoji: '🍌' },
    { id: 5, name: 'Nasi + Tempe Goreng', category: 'Makan Siang', cal: 410, available: true, tags: ['VEGETARIAN', 'FAVORIT'], emoji: '🍱' },
    { id: 6, name: 'Sup Kacang Hijau', category: 'Makan Siang', cal: 300, available: true, tags: ['VEGAN', 'SEHAT'], emoji: '🥣' },
    { id: 7, name: 'Gado-Gado Unklab', category: 'Makan Siang', cal: 340, available: true, tags: ['VEGETARIAN', 'BEBAS GLUTEN'], emoji: '🥗' },
    { id: 8, name: 'Capcay Goreng Tahu', category: 'Makan Siang', cal: 280, available: false, tags: ['VEGAN'], emoji: '🥦' },
    { id: 9, name: 'Nasi Goreng Sayuran', category: 'Makan Malam', cal: 420, available: true, tags: ['VEGAN', 'FAVORIT'], emoji: '🍚' },
    { id: 10, name: 'Mie Rebus Sayur', category: 'Makan Malam', cal: 340, available: true, tags: ['VEGETARIAN'], emoji: '🍲' },
    { id: 11, name: 'Sup Tahu Bayam', category: 'Makan Malam', cal: 230, available: true, tags: ['VEGAN', 'SEHAT'], emoji: '🍵' },
    { id: 12, name: 'Tumis Kangkung Tempe', category: 'Makan Malam', cal: 310, available: false, tags: ['VEGAN'], emoji: '🌿' },
    { id: 13, name: 'Pudding Kelapa Muda', category: 'Dessert', cal: 190, available: true, tags: ['VEGAN', 'BEBAS GLUTEN'], emoji: '🍮' },
];

const INITIAL_UPDATES: UpdateItem[] = [
    { id: 1, type: 'order', title: 'Pasokan Diterima', desc: '200kg Beras & 40kg Wortel segar diterima', time: '10 menit lalu' },
    { id: 2, type: 'menu', title: 'Menu Diperbarui', desc: 'Menu makan siang tanggal 11 Mar diubah', time: '2 jam lalu' },
    { id: 3, type: 'alert', title: 'Stok Kritis!', desc: 'Minyak Goreng, Tahu & Tempe di bawah minimum', time: '5 jam lalu' },
    { id: 4, type: 'feedback', title: 'Feedback Baru', desc: '12 ulasan baru dari penghuni asrama hari ini', time: '6 jam lalu' },
    { id: 5, type: 'order', title: 'Pasokan Diterima', desc: '30kg Tempe & 20kg Tahu segar tiba', time: 'Kemarin' },
];

const FEEDBACKS = [
    { id: 1, student: 'Alex M.', food: 'Mie Goreng Sayur', rating: 5, comment: 'Rasanya enak banget! Sayurannya segar dan bumbunya pas.', time: '30 mnt lalu', status: 'new' },
    { id: 2, student: 'Sarah K.', food: 'Sup Kacang Hijau', rating: 4, comment: 'Hangat dan menyehatkan, cocok untuk sarapan pagi.', time: '1 jam lalu', status: 'new' },
    { id: 3, student: 'Anonim', food: 'Gado-Gado Unklab', rating: 4, comment: 'Saus kacangnya enak, tapi porsi sayurnya bisa lebih banyak?', time: '2 jam lalu', status: 'read' },
    { id: 4, student: 'Budi R.', food: 'Nasi + Tempe Goreng', rating: 5, comment: 'Tempenya crispy dan sambalnya pas. Enak banget!', time: '3 jam lalu', status: 'read' },
    { id: 5, student: 'Cindy L.', food: 'Nasi Goreng Sayuran', rating: 4, comment: 'Rasanya enak, sayurannya segar. Favorit di makan malam!', time: '5 jam lalu', status: 'replied' },
];

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
    const router = useRouter();
    const [activePage, setActivePage] = useState<'dashboard' | 'stock' | 'menu' | 'feedback'>('dashboard');

    return (
        <SafeAreaView style={styles.safeArea}>
            <Header activePage={activePage} />
            <View style={{ flex: 1 }}>
                {activePage === 'dashboard' && <DashboardPage />}
                {activePage === 'stock' && <StockPage />}
                {activePage === 'menu' && <MenuPage />}
                {activePage === 'feedback' && <FeedbackPage />}
            </View>
            <BottomNav activePage={activePage} setActivePage={setActivePage} router={router} />
        </SafeAreaView>
    );
}

function Header({ activePage }: { activePage: string }) {
    const titles: Record<string, string> = { dashboard: 'Dashboard Admin', stock: 'Manajemen Stok', menu: 'Manajemen Menu', feedback: 'Ulasan Penghuni' };
    return (
        <View style={styles.header}>
            <View style={styles.headerLeft}>
                <View style={styles.adminBadge}><Text style={styles.adminBadgeText}>🛡️</Text></View>
                <View>
                    <Text style={styles.headerTitle}>{titles[activePage]}</Text>
                    <Text style={styles.headerSub}>🌱 Dining Vegan Asrama Unklab</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.notificationButton} onPress={() => Alert.alert('Notifikasi Admin', '3 peringatan:\n\n⚠️ Stok Kritis: Minyak Goreng\n⚠️ Stok Kritis: Tempe\n⚠️ Stok Kritis: Tahu')}>
                <Text style={styles.iconText}>🔔</Text>
                <View style={styles.notificationDot} />
            </TouchableOpacity>
        </View>
    );
}

function BottomNav({ activePage, setActivePage, router }: any) {
    const items = [
        { key: 'dashboard', icon: '📊', label: 'Dashboard' },
        { key: 'stock', icon: '📦', label: 'Stok' },
        { key: 'menu', icon: '📋', label: 'Menu' },
        { key: 'feedback', icon: '💬', label: 'Ulasan' },
    ];
    return (
        <View style={styles.bottomNav}>
            {items.map((item) => (
                <TouchableOpacity key={item.key} style={styles.navItem} onPress={() => setActivePage(item.key)}>
                    <Text style={activePage === item.key ? styles.navIconActive : styles.navIcon}>{item.icon}</Text>
                    <Text style={activePage === item.key ? styles.navTextActive : styles.navText}>{item.label}</Text>
                </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/(auth)')}>
                <Text style={styles.navIcon}>🚪</Text>
                <Text style={styles.navText}>Keluar</Text>
            </TouchableOpacity>
        </View>
    );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────

function DashboardPage() {
    const [updates] = useState<UpdateItem[]>(INITIAL_UPDATES);
    const criticals = INITIAL_STOCK.filter(s => s.status === 'critical').length;
    const lows = INITIAL_STOCK.filter(s => s.status === 'low').length;

    const updateMeta = (type: string) => {
        switch (type) {
            case 'order': return { bg: 'rgba(56,187,248,0.12)', icon: '🚚' };
            case 'menu': return { bg: 'rgba(236,127,19,0.12)', icon: '📝' };
            case 'alert': return { bg: 'rgba(239,68,68,0.12)', icon: '❗' };
            default: return { bg: 'rgba(4,120,87,0.12)', icon: '💬' };
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.contentPadding}>
                <View style={styles.welcomeBanner}>
                    <View>
                        <Text style={styles.bannerGreeting}>Selamat Pagi, Admin! 👋</Text>
                        <Text style={styles.bannerSub}>Rabu, 11 Maret 2025 · Asrama Unklab</Text>
                    </View>
                    <Text style={{ fontSize: 40 }}>🌿</Text>
                </View>

                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <View style={styles.statHeader}>
                            <View style={[styles.statIconBox, { backgroundColor: 'rgba(16,185,129,0.12)' }]}><Text style={styles.statIcon}>📦</Text></View>
                            <Text style={styles.statTrendUp}>↑ +2</Text>
                        </View>
                        <Text style={styles.statLabel}>Total Bahan</Text>
                        <Text style={styles.statValue}>{INITIAL_STOCK.length}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <View style={styles.statHeader}>
                            <View style={[styles.statIconBox, { backgroundColor: 'rgba(234,88,12,0.12)' }]}><Text style={styles.statIcon}>⚠️</Text></View>
                            <Text style={styles.statTrendBad}>↑ +2</Text>
                        </View>
                        <Text style={styles.statLabel}>Stok Kritis</Text>
                        <Text style={[styles.statValue, { color: '#dc2626' }]}>{criticals + lows}</Text>
                    </View>
                </View>
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <View style={styles.statHeader}>
                            <View style={[styles.statIconBox, { backgroundColor: 'rgba(56,187,248,0.12)' }]}><Text style={styles.statIcon}>📋</Text></View>
                            <Text style={styles.statTrendUp}>↑ +1</Text>
                        </View>
                        <Text style={styles.statLabel}>Menu Aktif</Text>
                        <Text style={styles.statValue}>{INITIAL_MENUS.filter(m => m.available).length}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <View style={styles.statHeader}>
                            <View style={[styles.statIconBox, { backgroundColor: 'rgba(4,120,87,0.12)' }]}><Text style={styles.statIcon}>💬</Text></View>
                            <Text style={styles.statTrendUp}>↑ +18%</Text>
                        </View>
                        <Text style={styles.statLabel}>Ulasan Hari Ini</Text>
                        <Text style={styles.statValue}>12</Text>
                    </View>
                </View>

                {criticals > 0 && (
                    <View style={styles.alertBanner}>
                        <Text style={styles.alertIcon}>🚨</Text>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.alertTitle}>{criticals} Bahan Stok Kritis!</Text>
                            <Text style={styles.alertDesc}>Minyak Goreng, Tempe & Tahu perlu segera diisi ulang.</Text>
                        </View>
                    </View>
                )}

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Aktivitas Terkini</Text>
                </View>
                <View style={styles.updatesContainer}>
                    {updates.map((u) => {
                        const meta = updateMeta(u.type);
                        return (
                            <View key={u.id} style={styles.updateItem}>
                                <View style={[styles.updateIconBox, { backgroundColor: meta.bg }]}><Text style={styles.updateIcon}>{meta.icon}</Text></View>
                                <View style={styles.updateContent}>
                                    <Text style={styles.updateTitle}>{u.title}</Text>
                                    <Text style={styles.updateDesc}>{u.desc}</Text>
                                </View>
                                <Text style={styles.updateTime}>{u.time}</Text>
                            </View>
                        );
                    })}
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Pantauan Stok</Text>
                </View>
                <View style={styles.tableContainer}>
                    <View style={styles.tableRowHeader}>
                        <Text style={[styles.tableCellHeader, { flex: 2 }]}>Nama Bahan</Text>
                        <Text style={[styles.tableCellHeader, { flex: 1, textAlign: 'center' }]}>Stok</Text>
                        <Text style={[styles.tableCellHeader, { flex: 1, textAlign: 'center' }]}>Status</Text>
                    </View>
                    {INITIAL_STOCK.slice(0, 7).map((item) => (
                        <View key={item.id} style={styles.tableRow}>
                            <Text style={[styles.tableCell, { flex: 2 }]}>{item.name}</Text>
                            <Text style={[styles.tableCell, { flex: 1, textAlign: 'center', color: item.status === 'critical' ? '#dc2626' : item.status === 'low' ? '#ea580c' : '#0f172a', fontWeight: 'bold' }]}>
                                {item.stock}{item.unit}
                            </Text>
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <View style={getStatusBadgeStyle(item.status)}>
                                    <Text style={getStatusTextStyle(item.status)}>{getStatusLabel(item.status)}</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
                <View style={{ height: 16 }} />
            </View>
        </ScrollView>
    );
}

// ─── STOCK ────────────────────────────────────────────────────────────────────

function StockPage() {
    const [stocks, setStocks] = useState<StockItem[]>(INITIAL_STOCK);
    const [filterStatus, setFilterStatus] = useState<'all' | 'healthy' | 'low' | 'critical'>('all');
    const [search, setSearch] = useState('');
    const [editModal, setEditModal] = useState(false);
    const [addModal, setAddModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
    const [editStock, setEditStock] = useState('');
    const [newName, setNewName] = useState('');
    const [newStock, setNewStock] = useState('');
    const [newUnit, setNewUnit] = useState('kg');
    const [newMin, setNewMin] = useState('');
    const [newCategory, setNewCategory] = useState('');

    const filtered = stocks.filter(s =>
        (filterStatus === 'all' || s.status === filterStatus) &&
        s.name.toLowerCase().includes(search.toLowerCase())
    );

    const openEdit = (item: StockItem) => { setSelectedItem(item); setEditStock(String(item.stock)); setEditModal(true); };

    const saveEdit = () => {
        if (!selectedItem || isNaN(Number(editStock))) return;
        const val = Number(editStock);
        setStocks(prev => prev.map(s => {
            if (s.id !== selectedItem.id) return s;
            const status: StockItem['status'] = val <= s.min * 0.3 ? 'critical' : val < s.min ? 'low' : 'healthy';
            return { ...s, stock: val, status, lastUpdate: '11 Mar 2025' };
        }));
        setEditModal(false);
        Alert.alert('Berhasil ✅', `Stok ${selectedItem.name} diperbarui menjadi ${editStock} ${selectedItem.unit}`);
    };

    const addStock = () => {
        if (!newName || !newStock || !newMin) { Alert.alert('Lengkapi Form', 'Isi semua field yang diperlukan.'); return; }
        const val = Number(newStock), min = Number(newMin);
        const status: StockItem['status'] = val <= min * 0.3 ? 'critical' : val < min ? 'low' : 'healthy';
        setStocks(prev => [...prev, { id: Date.now(), name: newName, stock: val, unit: newUnit, min, category: newCategory || 'Lainnya', lastUpdate: '11 Mar 2025', status }]);
        setNewName(''); setNewStock(''); setNewUnit('kg'); setNewMin(''); setNewCategory('');
        setAddModal(false);
        Alert.alert('Berhasil ✅', `${newName} ditambahkan ke daftar stok.`);
    };

    const deleteItem = (item: StockItem) => {
        Alert.alert('Hapus Bahan', `Hapus "${item.name}"?`, [
            { text: 'Batal', style: 'cancel' },
            { text: 'Hapus', style: 'destructive', onPress: () => setStocks(prev => prev.filter(s => s.id !== item.id)) },
        ]);
    };

    const criticals = stocks.filter(s => s.status === 'critical').length;
    const lows = stocks.filter(s => s.status === 'low').length;

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.subHeader}>
                <View style={styles.searchRow}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput style={styles.searchInput} placeholder="Cari bahan..." placeholderTextColor="#9ca3af" value={search} onChangeText={setSearch} />
                </View>
                <TouchableOpacity style={styles.addBtn} onPress={() => setAddModal(true)}>
                    <Text style={styles.addBtnText}>+ Tambah</Text>
                </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 48, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: 'rgba(236,127,19,0.06)' }} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8, gap: 8, alignItems: 'center' }}>
                {([['all', `Semua (${stocks.length})`], ['healthy', `✅ Aman (${stocks.filter(s => s.status === 'healthy').length})`], ['low', `⚠️ Rendah (${lows})`], ['critical', `🚨 Kritis (${criticals})`]] as const).map(([f, label]) => (
                    <TouchableOpacity key={f} style={[styles.filterChip, filterStatus === f && styles.filterChipActive]} onPress={() => setFilterStatus(f)}>
                        <Text style={[styles.filterChipText, filterStatus === f && styles.filterChipTextActive]}>{label}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 90 }} showsVerticalScrollIndicator={false}>
                {filtered.map((item) => (
                    <View key={item.id} style={styles.stockCard}>
                        <View style={styles.stockCardTop}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.stockName}>{item.name}</Text>
                                <Text style={styles.stockCategory}>{item.category} · {item.lastUpdate}</Text>
                            </View>
                            <View style={getStatusBadgeStyle(item.status)}>
                                <Text style={getStatusTextStyle(item.status)}>{getStatusLabel(item.status)}</Text>
                            </View>
                        </View>
                        <View style={styles.stockProgress}>
                            <View style={styles.progressBg}>
                                <View style={[styles.progressFill, {
                                    width: `${Math.min(100, (item.stock / (item.min * 2)) * 100)}%` as any,
                                    backgroundColor: item.status === 'critical' ? '#dc2626' : item.status === 'low' ? '#ea580c' : '#10b981',
                                }]} />
                            </View>
                            <Text style={styles.stockQty}>
                                <Text style={{ fontWeight: 'bold', color: item.status === 'critical' ? '#dc2626' : item.status === 'low' ? '#ea580c' : '#0f172a' }}>{item.stock}{item.unit}</Text>
                                <Text style={{ color: '#94a3b8' }}> / min {item.min}{item.unit}</Text>
                            </Text>
                        </View>
                        <View style={styles.stockActions}>
                            <TouchableOpacity style={styles.stockEditBtn} onPress={() => openEdit(item)}>
                                <Text style={styles.stockEditBtnText}>✏️ Edit Stok</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.stockDeleteBtn} onPress={() => deleteItem(item)}>
                                <Text style={styles.stockDeleteBtnText}>🗑️ Hapus</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
                {filtered.length === 0 && <View style={styles.emptyState}><Text style={{ fontSize: 50, marginBottom: 12 }}>📦</Text><Text style={styles.emptyTitle}>Tidak ditemukan</Text></View>}
            </ScrollView>

            {/* Edit Modal */}
            <Modal visible={editModal} transparent animationType="fade" onRequestClose={() => setEditModal(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Edit Stok</Text>
                        <Text style={styles.modalSubtitle}>{selectedItem?.name}</Text>
                        <Text style={styles.inputLabel}>Jumlah Stok Baru ({selectedItem?.unit})</Text>
                        <TextInput style={styles.modalInput} keyboardType="numeric" value={editStock} onChangeText={setEditStock} placeholder="0" placeholderTextColor="#9ca3af" />
                        <Text style={styles.inputHint}>Minimum stok: {selectedItem?.min}{selectedItem?.unit}</Text>
                        <View style={styles.modalBtns}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditModal(false)}><Text style={styles.cancelBtnText}>Batal</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.submitBtn} onPress={saveEdit}><Text style={styles.submitBtnText}>Simpan</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Add Modal */}
            <Modal visible={addModal} transparent animationType="slide" onRequestClose={() => setAddModal(false)}>
                <View style={styles.sheetOverlay}>
                    <View style={styles.sheetCard}>
                        <View style={styles.sheetHandle} />
                        <Text style={styles.modalTitle}>Tambah Bahan Baru</Text>
                        <ScrollView>
                            <Text style={styles.inputLabel}>Nama Bahan *</Text>
                            <TextInput style={styles.modalInput} value={newName} onChangeText={setNewName} placeholder="cth: Ubi Jalar" placeholderTextColor="#9ca3af" />
                            <Text style={styles.inputLabel}>Jumlah Stok *</Text>
                            <TextInput style={styles.modalInput} keyboardType="numeric" value={newStock} onChangeText={setNewStock} placeholder="0" placeholderTextColor="#9ca3af" />
                            <Text style={styles.inputLabel}>Satuan</Text>
                            <View style={styles.unitRow}>
                                {['kg', 'L', 'pcs', 'ikat', 'bks'].map(u => (
                                    <TouchableOpacity key={u} style={[styles.unitChip, newUnit === u && styles.unitChipActive]} onPress={() => setNewUnit(u)}>
                                        <Text style={[styles.unitChipText, newUnit === u && styles.unitChipTextActive]}>{u}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <Text style={styles.inputLabel}>Stok Minimum *</Text>
                            <TextInput style={styles.modalInput} keyboardType="numeric" value={newMin} onChangeText={setNewMin} placeholder="0" placeholderTextColor="#9ca3af" />
                            <Text style={styles.inputLabel}>Kategori</Text>
                            <View style={styles.unitRow}>
                                {['Sayuran', 'Pokok', 'Protein Nabati', 'Buah', 'Bumbu', 'Bahan Masak'].map(c => (
                                    <TouchableOpacity key={c} style={[styles.unitChip, newCategory === c && styles.unitChipActive]} onPress={() => setNewCategory(c)}>
                                        <Text style={[styles.unitChipText, newCategory === c && styles.unitChipTextActive]}>{c}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <View style={styles.modalBtns}>
                                <TouchableOpacity style={styles.cancelBtn} onPress={() => setAddModal(false)}><Text style={styles.cancelBtnText}>Batal</Text></TouchableOpacity>
                                <TouchableOpacity style={styles.submitBtn} onPress={addStock}><Text style={styles.submitBtnText}>Tambah</Text></TouchableOpacity>
                            </View>
                            <View style={{ height: 24 }} />
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

// ─── MENU ─────────────────────────────────────────────────────────────────────

function MenuPage() {
    const [menus, setMenus] = useState<MenuItem[]>(INITIAL_MENUS);
    const [filterCat, setFilterCat] = useState('Semua');
    const [addModal, setAddModal] = useState(false);
    const [newName, setNewName] = useState('');
    const [newCat, setNewCat] = useState('Sarapan');
    const [newCal, setNewCal] = useState('');
    const [newEmoji, setNewEmoji] = useState('🍽️');
    const [newTags, setNewTags] = useState<string[]>([]);

    const categories = ['Semua', 'Sarapan', 'Makan Siang', 'Makan Malam', 'Dessert'];
    const filtered = filterCat === 'Semua' ? menus : menus.filter(m => m.category === filterCat);

    const toggleAvailable = (id: number) => setMenus(prev => prev.map(m => m.id === id ? { ...m, available: !m.available } : m));

    const deleteMenu = (item: MenuItem) => {
        Alert.alert('Hapus Menu', `Hapus "${item.name}"?`, [
            { text: 'Batal', style: 'cancel' },
            { text: 'Hapus', style: 'destructive', onPress: () => setMenus(prev => prev.filter(m => m.id !== item.id)) },
        ]);
    };

    const addMenu = () => {
        if (!newName || !newCal) { Alert.alert('Lengkapi Form', 'Isi nama dan kalori menu.'); return; }
        setMenus(prev => [...prev, { id: Date.now(), name: newName, category: newCat, cal: Number(newCal), available: true, tags: newTags, emoji: newEmoji }]);
        setNewName(''); setNewCal(''); setNewEmoji('🍽️'); setNewTags([]);
        setAddModal(false);
        Alert.alert('Berhasil ✅', `${newName} ditambahkan ke menu.`);
    };

    const toggleTag = (tag: string) => setNewTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.menuStatsRow}>
                <View style={styles.menuStat}><Text style={styles.menuStatVal}>{menus.length}</Text><Text style={styles.menuStatLabel}>Total</Text></View>
                <View style={styles.menuStatDivider} />
                <View style={styles.menuStat}><Text style={[styles.menuStatVal, { color: '#10b981' }]}>{menus.filter(m => m.available).length}</Text><Text style={styles.menuStatLabel}>Aktif</Text></View>
                <View style={styles.menuStatDivider} />
                <View style={styles.menuStat}><Text style={[styles.menuStatVal, { color: '#94a3b8' }]}>{menus.filter(m => !m.available).length}</Text><Text style={styles.menuStatLabel}>Nonaktif</Text></View>
                <TouchableOpacity style={styles.menuAddBtn} onPress={() => setAddModal(true)}>
                    <Text style={styles.menuAddBtnText}>+ Tambah</Text>
                </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll} contentContainerStyle={styles.catScrollContent}>
                {categories.map(c => (
                    <TouchableOpacity key={c} style={[styles.catChip, filterCat === c && styles.catChipActive]} onPress={() => setFilterCat(c)}>
                        <Text style={[styles.catChipText, filterCat === c && styles.catChipTextActive]}>{c}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 90 }} showsVerticalScrollIndicator={false}>
                {filtered.map(item => (
                    <View key={item.id} style={[styles.menuCard, !item.available && styles.menuCardDisabled]}>
                        <View style={styles.menuCardLeft}>
                            <Text style={{ fontSize: 32 }}>{item.emoji}</Text>
                        </View>
                        <View style={styles.menuCardContent}>
                            <View style={styles.menuCardHeader}>
                                <Text style={[styles.menuCardName, !item.available && { color: '#94a3b8' }]}>{item.name}</Text>
                                <TouchableOpacity style={[styles.toggleBtn, item.available ? styles.toggleBtnOn : styles.toggleBtnOff]} onPress={() => toggleAvailable(item.id)}>
                                    <Text style={[styles.toggleBtnText, item.available ? styles.toggleBtnTextOn : styles.toggleBtnTextOff]}>
                                        {item.available ? '✅ Aktif' : '⛔ Nonaktif'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.menuCardMeta}>
                                <Text style={styles.menuCardCat}>{item.category}</Text>
                                <Text style={styles.menuCardDot}>·</Text>
                                <Text style={styles.menuCardCal}>{item.cal} Kal</Text>
                            </View>
                            <View style={styles.tagsRow}>
                                {item.tags.map(tag => (
                                    <View key={tag} style={[styles.tag, getTagStyle(tag)]}>
                                        <Text style={[styles.tagText, getTagTextStyle(tag)]}>{tag}</Text>
                                    </View>
                                ))}
                            </View>
                            <TouchableOpacity style={styles.deleteMenuBtn} onPress={() => deleteMenu(item)}>
                                <Text style={styles.deleteMenuBtnText}>🗑️ Hapus</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
                {filtered.length === 0 && <View style={styles.emptyState}><Text style={{ fontSize: 50, marginBottom: 12 }}>📋</Text><Text style={styles.emptyTitle}>Tidak ada menu</Text></View>}
            </ScrollView>

            {/* Add Menu Modal */}
            <Modal visible={addModal} transparent animationType="slide" onRequestClose={() => setAddModal(false)}>
                <View style={styles.sheetOverlay}>
                    <View style={styles.sheetCard}>
                        <View style={styles.sheetHandle} />
                        <Text style={styles.modalTitle}>Tambah Menu Vegan</Text>
                        <ScrollView>
                            <Text style={styles.inputLabel}>Emoji Menu</Text>
                            <View style={styles.emojiRow}>
                                {['🍜', '🍱', '🥗', '🍲', '🫘', '🍚', '🥣', '🥦', '🍞', '🍠', '🌿', '🍮', '🍵', '🍌'].map(e => (
                                    <TouchableOpacity key={e} style={[styles.emojiChip, newEmoji === e && styles.emojiChipActive]} onPress={() => setNewEmoji(e)}>
                                        <Text style={{ fontSize: 22 }}>{e}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <Text style={styles.inputLabel}>Nama Menu *</Text>
                            <TextInput style={styles.modalInput} value={newName} onChangeText={setNewName} placeholder="cth: Tumis Tahu Sayur" placeholderTextColor="#9ca3af" />
                            <Text style={styles.inputLabel}>Kategori</Text>
                            <View style={styles.unitRow}>
                                {['Sarapan', 'Makan Siang', 'Makan Malam', 'Dessert'].map(c => (
                                    <TouchableOpacity key={c} style={[styles.unitChip, newCat === c && styles.unitChipActive]} onPress={() => setNewCat(c)}>
                                        <Text style={[styles.unitChipText, newCat === c && styles.unitChipTextActive]}>{c}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <Text style={styles.inputLabel}>Kalori *</Text>
                            <TextInput style={styles.modalInput} keyboardType="numeric" value={newCal} onChangeText={setNewCal} placeholder="cth: 350" placeholderTextColor="#9ca3af" />
                            <Text style={styles.inputLabel}>Label</Text>
                            <View style={styles.unitRow}>
                                {['VEGAN', 'VEGETARIAN', 'SEHAT', 'BEBAS GLUTEN', 'FAVORIT'].map(tag => (
                                    <TouchableOpacity key={tag} style={[styles.unitChip, newTags.includes(tag) && styles.unitChipActive]} onPress={() => toggleTag(tag)}>
                                        <Text style={[styles.unitChipText, newTags.includes(tag) && styles.unitChipTextActive]}>{tag}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <View style={styles.modalBtns}>
                                <TouchableOpacity style={styles.cancelBtn} onPress={() => setAddModal(false)}><Text style={styles.cancelBtnText}>Batal</Text></TouchableOpacity>
                                <TouchableOpacity style={styles.submitBtn} onPress={addMenu}><Text style={styles.submitBtnText}>Tambah Menu</Text></TouchableOpacity>
                            </View>
                            <View style={{ height: 24 }} />
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

// ─── FEEDBACK ─────────────────────────────────────────────────────────────────

function FeedbackPage() {
    const [feedbacks, setFeedbacks] = useState(FEEDBACKS);
    const [replyModal, setReplyModal] = useState(false);
    const [selectedFb, setSelectedFb] = useState<typeof FEEDBACKS[0] | null>(null);
    const [replyText, setReplyText] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'read' | 'replied'>('all');

    const filtered = filterStatus === 'all' ? feedbacks : feedbacks.filter(f => f.status === filterStatus);
    const newCount = feedbacks.filter(f => f.status === 'new').length;
    const avgRating = feedbacks.length > 0 ? (feedbacks.reduce((a, b) => a + b.rating, 0) / feedbacks.length).toFixed(1) : '0';

    const openReply = (fb: typeof FEEDBACKS[0]) => {
        setSelectedFb(fb); setReplyText(''); setReplyModal(true);
        setFeedbacks(prev => prev.map(f => f.id === fb.id ? { ...f, status: 'read' } : f));
    };

    const sendReply = () => {
        if (!replyText.trim()) { Alert.alert('Tulis Balasan', 'Isi balasan terlebih dahulu.'); return; }
        setFeedbacks(prev => prev.map(f => f.id === selectedFb?.id ? { ...f, status: 'replied' } : f));
        setReplyModal(false);
        Alert.alert('Terkirim ✅', `Balasan untuk ${selectedFb?.student} berhasil dikirim!`);
    };

    const deleteFb = (id: number) => {
        Alert.alert('Hapus Ulasan', 'Hapus ulasan ini?', [
            { text: 'Batal', style: 'cancel' },
            { text: 'Hapus', style: 'destructive', onPress: () => setFeedbacks(prev => prev.filter(f => f.id !== id)) },
        ]);
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.fbStatsRow}>
                <View style={styles.fbStat}><Text style={styles.fbStatVal}>{feedbacks.length}</Text><Text style={styles.fbStatLabel}>Total</Text></View>
                <View style={styles.fbStatDiv} />
                <View style={styles.fbStat}><Text style={[styles.fbStatVal, { color: '#ef4444' }]}>{newCount}</Text><Text style={styles.fbStatLabel}>Baru</Text></View>
                <View style={styles.fbStatDiv} />
                <View style={styles.fbStat}><Text style={[styles.fbStatVal, { color: '#f59e0b' }]}>⭐ {avgRating}</Text><Text style={styles.fbStatLabel}>Rata-rata</Text></View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 48, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: 'rgba(236,127,19,0.06)' }} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8, gap: 8, alignItems: 'center' }}>
                {(['all', 'new', 'read', 'replied'] as const).map(f => (
                    <TouchableOpacity key={f} style={[styles.filterChip, filterStatus === f && styles.filterChipActive]} onPress={() => setFilterStatus(f)}>
                        <Text style={[styles.filterChipText, filterStatus === f && styles.filterChipTextActive]}>
                            {f === 'all' ? 'Semua' : f === 'new' ? `🆕 Baru (${newCount})` : f === 'read' ? '👁️ Dibaca' : '✅ Dibalas'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 90 }} showsVerticalScrollIndicator={false}>
                {filtered.map(fb => (
                    <View key={fb.id} style={[styles.fbCard, fb.status === 'new' && styles.fbCardNew]}>
                        <View style={styles.fbCardHeader}>
                            <View style={styles.fbAvatar}>
                                <Text style={styles.fbAvatarText}>{fb.student === 'Anonim' ? '🎭' : fb.student[0]}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.fbStudentName}>{fb.student}</Text>
                                <Text style={styles.fbFoodName}>{fb.food}</Text>
                            </View>
                            <View style={styles.fbRight}>
                                <View style={styles.fbStarsRow}>
                                    {[1,2,3,4,5].map(s => <Text key={s} style={{ fontSize: 12, color: s <= fb.rating ? '#f59e0b' : '#e2e8f0' }}>★</Text>)}
                                </View>
                                <View style={[styles.fbStatusBadge, { backgroundColor: fb.status === 'new' ? 'rgba(239,68,68,0.1)' : fb.status === 'replied' ? 'rgba(16,185,129,0.1)' : 'rgba(148,163,184,0.1)' }]}>
                                    <Text style={[styles.fbStatusText, { color: fb.status === 'new' ? '#dc2626' : fb.status === 'replied' ? '#10b981' : '#64748b' }]}>
                                        {fb.status === 'new' ? 'Baru' : fb.status === 'replied' ? 'Dibalas' : 'Dibaca'}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <Text style={styles.fbComment}>"{fb.comment}"</Text>
                        <View style={styles.fbFooter}>
                            <Text style={styles.fbTime}>{fb.time}</Text>
                            <View style={styles.fbActions}>
                                <TouchableOpacity style={styles.fbReplyBtn} onPress={() => openReply(fb)}>
                                    <Text style={styles.fbReplyBtnText}>💬 Balas</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.fbDeleteBtn} onPress={() => deleteFb(fb.id)}>
                                    <Text style={styles.fbDeleteBtnText}>🗑️</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}
                {filtered.length === 0 && <View style={styles.emptyState}><Text style={{ fontSize: 50, marginBottom: 12 }}>💬</Text><Text style={styles.emptyTitle}>Tidak ada ulasan</Text></View>}
            </ScrollView>

            <Modal visible={replyModal} transparent animationType="fade" onRequestClose={() => setReplyModal(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Balas Ulasan</Text>
                        <View style={styles.replyQuote}>
                            <Text style={styles.replyQuoteStudent}>— {selectedFb?.student}</Text>
                            <Text style={styles.replyQuoteText}>"{selectedFb?.comment}"</Text>
                        </View>
                        <Text style={styles.inputLabel}>Balasan Admin</Text>
                        <TextInput style={[styles.modalInput, { height: 100, textAlignVertical: 'top' }]} multiline value={replyText} onChangeText={setReplyText} placeholder="Tulis balasan untuk penghuni asrama ini..." placeholderTextColor="#9ca3af" />
                        <View style={styles.modalBtns}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setReplyModal(false)}><Text style={styles.cancelBtnText}>Batal</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.submitBtn} onPress={sendReply}><Text style={styles.submitBtnText}>Kirim Balasan</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function getStatusLabel(s: string) { return s === 'healthy' ? 'Aman' : s === 'low' ? 'Rendah' : 'Kritis'; }
function getStatusBadgeStyle(s: string) {
    if (s === 'healthy') return { backgroundColor: 'rgba(16,185,129,0.1)', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 12 };
    if (s === 'low') return { backgroundColor: 'rgba(234,88,12,0.1)', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 12 };
    return { backgroundColor: 'rgba(239,68,68,0.1)', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 12 };
}
function getStatusTextStyle(s: string) {
    return { color: s === 'healthy' ? '#10b981' : s === 'low' ? '#ea580c' : '#dc2626', fontSize: 10, fontWeight: 'bold' as const, textTransform: 'uppercase' as const };
}
function getTagStyle(tag: string) {
    switch (tag) {
        case 'VEGAN': return { backgroundColor: 'rgba(4,120,87,0.12)' };
        case 'VEGETARIAN': return { backgroundColor: 'rgba(21,128,61,0.1)' };
        case 'SEHAT': return { backgroundColor: 'rgba(29,78,216,0.1)' };
        case 'BEBAS GLUTEN': return { backgroundColor: 'rgba(139,92,246,0.1)' };
        default: return { backgroundColor: 'rgba(236,127,19,0.1)' };
    }
}
function getTagTextStyle(tag: string) {
    switch (tag) {
        case 'VEGAN': return { color: '#047857' };
        case 'VEGETARIAN': return { color: '#15803d' };
        case 'SEHAT': return { color: '#1d4ed8' };
        case 'BEBAS GLUTEN': return { color: '#7c3aed' };
        default: return { color: PRIMARY_COLOR };
    }
}

// ─── STYLES ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: BG_LIGHT, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    adminBadge: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(236,127,19,0.12)', alignItems: 'center', justifyContent: 'center' },
    adminBadgeText: { fontSize: 18 },
    headerTitle: { fontSize: 15, fontWeight: 'bold', color: '#0f172a' },
    headerSub: { fontSize: 11, color: '#047857', fontWeight: '600', marginTop: 1 },
    iconText: { fontSize: 20 },
    notificationButton: { position: 'relative', width: 36, height: 36, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(236,127,19,0.08)', borderRadius: 18 },
    notificationDot: { position: 'absolute', top: 6, right: 6, width: 8, height: 8, backgroundColor: '#ef4444', borderRadius: 4, borderWidth: 1, borderColor: '#fff' },
    scrollContainer: { paddingBottom: 90 },
    contentPadding: { padding: 16 },
    welcomeBanner: { backgroundColor: PRIMARY_COLOR, borderRadius: 16, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, shadowColor: PRIMARY_COLOR, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 5 },
    bannerGreeting: { fontSize: 17, fontWeight: 'bold', color: '#fff' },
    bannerSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
    statsGrid: { flexDirection: 'row', gap: 14, marginBottom: 14 },
    statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
    statHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    statIconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    statIcon: { fontSize: 16 },
    statTrendUp: { fontSize: 11, fontWeight: 'bold', color: '#10b981' },
    statTrendBad: { fontSize: 11, fontWeight: 'bold', color: '#ef4444' },
    statLabel: { fontSize: 11, fontWeight: '500', color: '#64748b' },
    statValue: { fontSize: 26, fontWeight: 'bold', color: '#0f172a', marginTop: 4 },
    alertBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(239,68,68,0.08)', borderRadius: 12, padding: 14, marginBottom: 20, gap: 10, borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)' },
    alertIcon: { fontSize: 22 },
    alertTitle: { fontSize: 14, fontWeight: 'bold', color: '#dc2626' },
    alertDesc: { fontSize: 12, color: '#7f1d1d', marginTop: 2 },
    sectionHeader: { marginTop: 8, marginBottom: 12 },
    sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#0f172a' },
    updatesContainer: { backgroundColor: '#fff', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)', marginBottom: 24, gap: 14 },
    updateItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    updateIconBox: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    updateIcon: { fontSize: 18 },
    updateContent: { flex: 1 },
    updateTitle: { fontSize: 13, fontWeight: 'bold', color: '#0f172a' },
    updateDesc: { fontSize: 12, color: '#64748b', marginTop: 2 },
    updateTime: { fontSize: 10, fontWeight: 'bold', color: '#94a3b8' },
    tableContainer: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)', overflow: 'hidden' },
    tableRowHeader: { flexDirection: 'row', backgroundColor: '#f8fafc', paddingVertical: 10, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
    tableCellHeader: { fontSize: 10, fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' },
    tableRow: { flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.04)', alignItems: 'center' },
    tableCell: { fontSize: 13, color: '#0f172a' },
    bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: 'rgba(236,127,19,0.1)', flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 8, paddingBottom: Platform.OS === 'ios' ? 24 : 8 },
    navItem: { alignItems: 'center', justifyContent: 'center' },
    navIconActive: { fontSize: 22, color: PRIMARY_COLOR },
    navIcon: { fontSize: 22, color: '#94a3b8' },
    navTextActive: { fontSize: 9, fontWeight: 'bold', color: PRIMARY_COLOR, marginTop: 2 },
    navText: { fontSize: 9, fontWeight: 'bold', color: '#94a3b8', marginTop: 2 },
    subHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: 'rgba(236,127,19,0.08)', gap: 10 },
    searchRow: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: BG_LIGHT, borderRadius: 10, paddingHorizontal: 10, borderWidth: 1, borderColor: 'rgba(236,127,19,0.12)' },
    searchIcon: { fontSize: 14, marginRight: 6 },
    searchInput: { flex: 1, paddingVertical: 9, color: '#0f172a', fontSize: 14 },
    addBtn: { backgroundColor: PRIMARY_COLOR, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 },
    addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
    filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: BG_LIGHT, borderWidth: 1, borderColor: 'rgba(236,127,19,0.1)' },
    filterChipActive: { backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR },
    filterChipText: { fontSize: 11, fontWeight: '600', color: '#64748b' },
    filterChipTextActive: { color: '#fff' },
    stockCard: { backgroundColor: '#fff', borderRadius: 14, marginBottom: 12, padding: 14, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
    stockCardTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
    stockName: { fontSize: 15, fontWeight: 'bold', color: '#0f172a' },
    stockCategory: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
    stockProgress: { marginBottom: 10 },
    progressBg: { height: 6, backgroundColor: '#f1f5f9', borderRadius: 3, marginBottom: 6, overflow: 'hidden' },
    progressFill: { height: 6, borderRadius: 3 },
    stockQty: { fontSize: 12 },
    stockActions: { flexDirection: 'row', gap: 10 },
    stockEditBtn: { flex: 1, paddingVertical: 8, borderRadius: 10, backgroundColor: 'rgba(236,127,19,0.08)', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(236,127,19,0.15)' },
    stockEditBtnText: { color: PRIMARY_COLOR, fontWeight: '600', fontSize: 13 },
    stockDeleteBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 10, backgroundColor: 'rgba(239,68,68,0.08)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.15)' },
    stockDeleteBtnText: { color: '#dc2626', fontWeight: '600', fontSize: 13 },
    menuStatsRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: 'rgba(236,127,19,0.08)', gap: 8 },
    menuStat: { alignItems: 'center' },
    menuStatVal: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' },
    menuStatLabel: { fontSize: 10, color: '#94a3b8', marginTop: 1 },
    menuStatDivider: { width: 1, height: 30, backgroundColor: 'rgba(236,127,19,0.1)', marginHorizontal: 8 },
    menuAddBtn: { marginLeft: 'auto', backgroundColor: PRIMARY_COLOR, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
    menuAddBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
    catScroll: { maxHeight: 48, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: 'rgba(236,127,19,0.06)' },
    catScrollContent: { paddingHorizontal: 16, paddingVertical: 8, gap: 8, alignItems: 'center' },
    catChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: BG_LIGHT, borderWidth: 1, borderColor: 'rgba(236,127,19,0.12)' },
    catChipActive: { backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR },
    catChipText: { fontSize: 12, fontWeight: '600', color: '#64748b' },
    catChipTextActive: { color: '#fff' },
    menuCard: { backgroundColor: '#fff', borderRadius: 14, marginBottom: 12, flexDirection: 'row', overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(236,127,19,0.08)' },
    menuCardDisabled: { opacity: 0.55 },
    menuCardLeft: { width: 72, backgroundColor: 'rgba(4,120,87,0.05)', alignItems: 'center', justifyContent: 'center' },
    menuCardContent: { flex: 1, padding: 12 },
    menuCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
    menuCardName: { fontSize: 14, fontWeight: 'bold', color: '#0f172a', flex: 1 },
    toggleBtn: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginLeft: 6 },
    toggleBtnOn: { backgroundColor: 'rgba(16,185,129,0.1)' },
    toggleBtnOff: { backgroundColor: 'rgba(148,163,184,0.1)' },
    toggleBtnText: { fontSize: 11, fontWeight: 'bold' },
    toggleBtnTextOn: { color: '#10b981' },
    toggleBtnTextOff: { color: '#94a3b8' },
    menuCardMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
    menuCardCat: { fontSize: 11, color: PRIMARY_COLOR, fontWeight: '600' },
    menuCardDot: { fontSize: 11, color: '#cbd5e1' },
    menuCardCal: { fontSize: 11, color: '#64748b' },
    tagsRow: { flexDirection: 'row', gap: 5, flexWrap: 'wrap', marginBottom: 8 },
    tag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
    tagText: { fontSize: 9, fontWeight: 'bold' },
    deleteMenuBtn: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, backgroundColor: 'rgba(239,68,68,0.08)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.12)' },
    deleteMenuBtnText: { color: '#dc2626', fontSize: 11, fontWeight: '600' },
    fbStatsRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: 'rgba(236,127,19,0.08)' },
    fbStat: { flex: 1, alignItems: 'center' },
    fbStatVal: { fontSize: 22, fontWeight: 'bold', color: '#0f172a' },
    fbStatLabel: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
    fbStatDiv: { width: 1, height: 30, backgroundColor: 'rgba(236,127,19,0.1)' },
    fbCard: { backgroundColor: '#fff', borderRadius: 14, marginBottom: 12, padding: 14, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
    fbCardNew: { borderColor: 'rgba(239,68,68,0.2)', backgroundColor: 'rgba(254,242,242,0.5)' },
    fbCardHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10, gap: 10 },
    fbAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(236,127,19,0.12)', alignItems: 'center', justifyContent: 'center' },
    fbAvatarText: { fontSize: 16, fontWeight: 'bold', color: PRIMARY_COLOR },
    fbStudentName: { fontSize: 14, fontWeight: 'bold', color: '#0f172a' },
    fbFoodName: { fontSize: 12, color: '#64748b', marginTop: 1 },
    fbRight: { alignItems: 'flex-end', gap: 4 },
    fbStarsRow: { flexDirection: 'row', gap: 1 },
    fbStatusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
    fbStatusText: { fontSize: 10, fontWeight: 'bold' },
    fbComment: { fontSize: 13, color: '#475569', fontStyle: 'italic', lineHeight: 20, marginBottom: 10 },
    fbFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    fbTime: { fontSize: 11, color: '#94a3b8' },
    fbActions: { flexDirection: 'row', gap: 8 },
    fbReplyBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: 'rgba(236,127,19,0.1)', borderWidth: 1, borderColor: 'rgba(236,127,19,0.2)' },
    fbReplyBtnText: { color: PRIMARY_COLOR, fontWeight: '600', fontSize: 12 },
    fbDeleteBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: 'rgba(239,68,68,0.08)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.12)' },
    fbDeleteBtnText: { fontSize: 12 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(15,23,42,0.55)', justifyContent: 'center', alignItems: 'center', padding: 24 },
    modalCard: { width: '100%', maxWidth: 380, backgroundColor: '#fff', borderRadius: 20, padding: 24 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#0f172a', marginBottom: 4 },
    modalSubtitle: { fontSize: 14, color: '#64748b', marginBottom: 16 },
    inputLabel: { fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 6, marginTop: 12 },
    inputHint: { fontSize: 11, color: '#94a3b8', marginTop: 4 },
    modalInput: { backgroundColor: BG_LIGHT, borderWidth: 1.5, borderColor: 'rgba(236,127,19,0.2)', borderRadius: 12, padding: 12, color: '#0f172a', fontSize: 14 },
    modalBtns: { flexDirection: 'row', gap: 12, marginTop: 20 },
    cancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1.5, borderColor: 'rgba(236,127,19,0.2)', alignItems: 'center' },
    cancelBtnText: { color: '#64748b', fontWeight: '600', fontSize: 14 },
    submitBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: PRIMARY_COLOR, alignItems: 'center' },
    submitBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
    sheetOverlay: { flex: 1, backgroundColor: 'rgba(15,23,42,0.5)', justifyContent: 'flex-end' },
    sheetCard: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '85%' },
    sheetHandle: { width: 40, height: 4, backgroundColor: '#e2e8f0', borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
    unitRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
    unitChip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 16, backgroundColor: BG_LIGHT, borderWidth: 1, borderColor: 'rgba(236,127,19,0.15)' },
    unitChipActive: { backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR },
    unitChipText: { fontSize: 12, fontWeight: '600', color: '#64748b' },
    unitChipTextActive: { color: '#fff' },
    emojiRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
    emojiChip: { width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: BG_LIGHT, borderWidth: 1.5, borderColor: 'transparent' },
    emojiChipActive: { borderColor: PRIMARY_COLOR, backgroundColor: 'rgba(236,127,19,0.08)' },
    replyQuote: { backgroundColor: BG_LIGHT, borderLeftWidth: 3, borderLeftColor: PRIMARY_COLOR, padding: 12, borderRadius: 8, marginBottom: 4 },
    replyQuoteStudent: { fontSize: 11, fontWeight: 'bold', color: PRIMARY_COLOR, marginBottom: 4 },
    replyQuoteText: { fontSize: 13, color: '#475569', fontStyle: 'italic' },
    emptyState: { alignItems: 'center', paddingVertical: 60 },
    emptyTitle: { fontSize: 17, fontWeight: 'bold', color: '#94a3b8' },
});