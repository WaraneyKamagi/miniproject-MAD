import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, StatusBar, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

const PRIMARY_COLOR = '#ec7f13';
const BG_LIGHT = '#f8f7f6';

export default function AdminDashboard() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity style={styles.menuButton}>
                        <Text style={styles.iconText}>☰</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Dashboard</Text>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.notificationButton}>
                        <Text style={styles.iconText}>🔔</Text>
                        <View style={styles.notificationDot} />
                    </TouchableOpacity>
                    <ImageBackground
                        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEBHwKrpFbo8lJHEQRev1T03B3lsctNYT1XUF5U0m6QMRriVJvb7MRb8L7lP2dsatbwWIE-iauda8O7qqsix8wMLY7IqPMvfXI9InFWPlstuyXCTko9G7K1EyNK64P29fZhK2KKzLWkYBdf9wARLVvXmqyJzduXH38LERmw1BAuIclUD-qiJAn6CO2LoC0qNtfh9XtFx-f7QA3H2RGoZj7m0XMN6m-Fn0FK_vkrMGQxC16Jdw3133doTE8e36lHotTYMbDJK33Tq8Z' }}
                        style={styles.profileImage}
                        imageStyle={{ borderRadius: 16 }}
                    />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.contentPadding}>
                    {/* Stat Cards */}
                    <View style={styles.statsGrid}>
                        <View style={styles.statCard}>
                            <View style={styles.statHeader}>
                                <View style={styles.statIconContainerGreen}><Text style={styles.statIcon}>📦</Text></View>
                                <Text style={styles.statTrendUp}>↑ +12%</Text>
                            </View>
                            <Text style={styles.statLabel}>Total Ingredients</Text>
                            <Text style={styles.statValue}>124</Text>
                        </View>
                        <View style={styles.statCard}>
                            <View style={styles.statHeader}>
                                <View style={styles.statIconContainerOrange}><Text style={styles.statIcon}>⚠️</Text></View>
                                <Text style={styles.statTrendUp}>↑ +2%</Text>
                            </View>
                            <Text style={styles.statLabel}>Stock Alerts</Text>
                            <Text style={styles.statValue}>8</Text>
                        </View>
                    </View>

                    <View style={styles.statsGrid}>
                        <View style={styles.statCard}>
                            <View style={styles.statHeader}>
                                <View style={styles.statIconContainerBlue}><Text style={styles.statIcon}>📋</Text></View>
                                <Text style={styles.statTrendDown}>↓ -5%</Text>
                            </View>
                            <Text style={styles.statLabel}>Active Menus</Text>
                            <Text style={styles.statValue}>12</Text>
                        </View>
                        <View style={styles.statCard}>
                            <View style={styles.statHeader}>
                                <View style={styles.statIconContainerEmerald}><Text style={styles.statIcon}>💬</Text></View>
                                <Text style={styles.statTrendUp}>↑ +18%</Text>
                            </View>
                            <Text style={styles.statLabel}>Today's Feedback</Text>
                            <Text style={styles.statValue}>45</Text>
                        </View>
                    </View>

                    {/* Recent Updates */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Updates</Text>
                        <TouchableOpacity><Text style={styles.viewAllText}>All History</Text></TouchableOpacity>
                    </View>

                    <View style={styles.updatesContainer}>
                        <View style={styles.updateItem}>
                            <View style={styles.updateIconContainerBlue}><Text style={styles.updateIcon}>🚚</Text></View>
                            <View style={styles.updateContent}>
                                <Text style={styles.updateTitle}>Order Received</Text>
                                <Text style={styles.updateDesc}>200kg of Rice (Premium) added</Text>
                            </View>
                            <Text style={styles.updateTime}>10m</Text>
                        </View>
                        <View style={styles.updateItem}>
                            <View style={styles.updateIconContainerPrimary}><Text style={styles.updateIcon}>📝</Text></View>
                            <View style={styles.updateContent}>
                                <Text style={styles.updateTitle}>Menu Updated</Text>
                                <Text style={styles.updateDesc}>Lunch menu changed for 24th Oct</Text>
                            </View>
                            <Text style={styles.updateTime}>2h</Text>
                        </View>
                        <View style={styles.updateItem}>
                            <View style={styles.updateIconContainerRed}><Text style={styles.updateIcon}>❗</Text></View>
                            <View style={styles.updateContent}>
                                <Text style={styles.updateTitle}>Critical Stock Alert</Text>
                                <Text style={styles.updateDesc}>Milk (Whole) below min threshold</Text>
                            </View>
                            <Text style={styles.updateTime}>5h</Text>
                        </View>
                    </View>

                    {/* Stock Monitoring */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Stock Monitoring</Text>
                        <TouchableOpacity><Text style={styles.viewAllText}>View All</Text></TouchableOpacity>
                    </View>

                    <View style={styles.tableContainer}>
                        <View style={styles.tableRowHeader}>
                            <Text style={[styles.tableCellHeader, { flex: 2 }]}>Name</Text>
                            <Text style={[styles.tableCellHeader, { flex: 1 }]}>Stock</Text>
                            <Text style={[styles.tableCellHeader, { flex: 1 }]}>Status</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCell, { flex: 2, fontWeight: 'bold' }]}>Rice (Premium)</Text>
                            <Text style={[styles.tableCellCentered, { flex: 1, fontWeight: 'bold' }]}>500kg</Text>
                            <View style={[{ flex: 1 }, styles.badgeEmerald]}>
                                <Text style={styles.badgeTextEmerald}>Healthy</Text>
                            </View>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCell, { flex: 2, fontWeight: 'bold' }]}>Chicken Breast</Text>
                            <Text style={[styles.tableCellCentered, { flex: 1, fontWeight: 'bold', color: '#ea580c' }]}>45kg</Text>
                            <View style={[{ flex: 1 }, styles.badgeOrange]}>
                                <Text style={styles.badgeTextOrange}>Low Stock</Text>
                            </View>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCell, { flex: 2, fontWeight: 'bold' }]}>Milk (Whole)</Text>
                            <Text style={[styles.tableCellCentered, { flex: 1, fontWeight: 'bold', color: '#dc2626' }]}>5L</Text>
                            <View style={[{ flex: 1 }, styles.badgeRed]}>
                                <Text style={styles.badgeTextRed}>Critical</Text>
                            </View>
                        </View>
                    </View>

                </View>
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem}>
                    <Text style={styles.navIconActive}>📊</Text>
                    <Text style={styles.navTextActive}>Dashboard</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Text style={styles.navIcon}>📦</Text>
                    <Text style={styles.navText}>Stock</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Text style={styles.navIcon}>📋</Text>
                    <Text style={styles.navText}>Menu</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/(auth)')}>
                    <Text style={styles.navIcon}>🚪</Text>
                    <Text style={styles.navText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: BG_LIGHT,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    menuButton: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconText: {
        fontSize: 20,
        color: '#475569',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    notificationButton: {
        position: 'relative',
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationDot: {
        position: 'absolute',
        top: 4,
        right: 4,
        width: 8,
        height: 8,
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#fff',
    },
    profileImage: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#e2e8f0',
    },
    scrollContainer: {
        paddingBottom: 80, // Space for bottom nav
    },
    contentPadding: {
        padding: 16,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 16,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        borderColor: 'rgba(0,0,0,0.05)',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    statHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    statIconContainerGreen: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        width: 36,
        height: 36,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statIconContainerOrange: {
        backgroundColor: 'rgba(234, 88, 12, 0.1)',
        width: 36,
        height: 36,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statIconContainerBlue: {
        backgroundColor: 'rgba(56, 187, 248, 0.1)',
        width: 36,
        height: 36,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statIconContainerEmerald: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        width: 36,
        height: 36,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statIcon: {
        fontSize: 16,
    },
    statTrendUp: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#10b981',
    },
    statTrendDown: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#ef4444',
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: '#64748b',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0f172a',
        marginTop: 4,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    viewAllText: {
        fontSize: 12,
        fontWeight: '600',
        color: PRIMARY_COLOR,
    },
    updatesContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        borderColor: 'rgba(0,0,0,0.05)',
        borderWidth: 1,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        gap: 16,
    },
    updateItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    updateIconContainerBlue: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(56, 187, 248, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    updateIconContainerPrimary: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(236, 127, 19, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    updateIconContainerRed: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    updateIcon: {
        fontSize: 18,
    },
    updateContent: {
        flex: 1,
    },
    updateTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    updateDesc: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 2,
    },
    updateTime: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#94a3b8',
        textTransform: 'uppercase',
    },
    tableContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderColor: 'rgba(0,0,0,0.05)',
        borderWidth: 1,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    tableRowHeader: {
        flexDirection: 'row',
        backgroundColor: '#f8fafc',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    tableCellHeader: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#64748b',
        textTransform: 'uppercase',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
        alignItems: 'center',
    },
    tableCell: {
        fontSize: 12,
        color: '#0f172a',
    },
    tableCellCentered: {
        fontSize: 12,
        color: '#0f172a',
        textAlign: 'center',
    },
    badgeEmerald: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
        alignItems: 'center',
    },
    badgeTextEmerald: {
        color: '#10b981',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    badgeOrange: {
        backgroundColor: 'rgba(234, 88, 12, 0.1)',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
        alignItems: 'center',
    },
    badgeTextOrange: {
        color: '#ea580c',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    badgeRed: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
        alignItems: 'center',
    },
    badgeTextRed: {
        color: '#dc2626',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: 'rgba(236, 127, 19, 0.1)',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 8,
        paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    navIconActive: {
        fontSize: 24,
        color: PRIMARY_COLOR,
    },
    navIcon: {
        fontSize: 24,
        color: '#94a3b8',
        opacity: 0.5,
    },
    navTextActive: {
        fontSize: 10,
        fontWeight: 'bold',
        color: PRIMARY_COLOR,
        marginTop: 2,
    },
    navText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#94a3b8',
        marginTop: 2,
    },
});
