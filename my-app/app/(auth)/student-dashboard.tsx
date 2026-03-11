import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, StatusBar, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

const PRIMARY_COLOR = '#ec7f13';
const BG_LIGHT = '#f8f7f6';

export default function StudentDashboard() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <ImageBackground
                        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8TgqEl30rMnkG1O4oeuW2GqoYs3-w6MUPXvW_kDPJ_CIRDYkRmCrBlas0DxGyGCS6p-ZfJ_RXZGrbhx1UkdIsr0akkPTzESggs1dUhCp6OL7pCdL_vYlnI89ikOofQSHTElPOJeyFhCLpE8hTTGAxJtmyRfWZOwR4f3U7L9j9hJXKm99kgZ7vA61xST8j2D-baPsfRRQbYpwrOcYBuLvn1aHFSl4EP0hEhM02BCL1f3zqug48OdLvjEoDBArbzZ3O-dZES3mVX0q3' }}
                        style={styles.profilePic}
                        imageStyle={{ borderRadius: 20 }}
                    />
                    <Text style={styles.headerTitle}>Dining Dashboard</Text>
                    <TouchableOpacity style={styles.notificationButton}>
                        <Text style={styles.notificationIcon}>🔔</Text>
                    </TouchableOpacity>
                </View>

                {/* Welcome Section */}
                <View style={styles.welcomeSection}>
                    <Text style={styles.welcomeTitle}>Welcome back, Alex!</Text>
                    <Text style={styles.welcomeSubtitle}>Ready for your next meal at North Hall?</Text>
                </View>

                {/* Quick Actions Grid */}
                <View style={styles.quickActionsGrid}>
                    <TouchableOpacity style={styles.actionCard}>
                        <Text style={styles.actionIcon}>🍽️</Text>
                        <Text style={styles.actionText}>Full Menu</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionCard}>
                        <Text style={styles.actionIcon}>⭐</Text>
                        <Text style={styles.actionText}>Rate Meal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionCard}>
                        <Text style={styles.actionIcon}>💬</Text>
                        <Text style={styles.actionText}>Feedback</Text>
                    </TouchableOpacity>
                </View>

                {/* Meal Tabs */}
                <View style={styles.tabsContainer}>
                    <TouchableOpacity style={styles.tabItem}>
                        <Text style={styles.tabText}>Breakfast</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.tabItem, styles.tabItemActive]}>
                        <Text style={[styles.tabText, styles.tabTextActive]}>Lunch</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tabItem}>
                        <Text style={styles.tabText}>Dinner</Text>
                    </TouchableOpacity>
                </View>

                {/* Menu Preview */}
                <View style={styles.menuPreviewSection}>
                    <View style={styles.menuPreviewHeader}>
                        <Text style={styles.menuPreviewTitle}>Today's Highlights</Text>
                        <View style={styles.servingBadge}>
                            <Text style={styles.servingBadgeText}>SERVING NOW</Text>
                        </View>
                    </View>

                    {/* Food Card 1 */}
                    <View style={styles.foodCard}>
                        <ImageBackground
                            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChTDur6P0-z_89btlChtn1Z2WImrU9JYpDLaIW8DSM0ydLN_zH-tjsqFOpaeE1-dBmdJVv67Ob3HRBA9HQmfFY2euG5gaiv06tY4cTaP4YF0wmPQM4KliFMppkYCOSc_UHLSXcWXss28i3TGTIbsmJmqyQJAbK7mhtDhB3v3J5Ot2X7A0kagSJ2-7UNGWy2yp-Q-9GUjXtD5OlWifeLXybrDdasljVxGcqdeXNU7qbRHTP0KnWTDiGxeD48BPgftZxPdiscDZcFhRw' }}
                            style={styles.foodImage}
                        />
                        <View style={styles.foodInfo}>
                            <View style={styles.foodInfoHeader}>
                                <View>
                                    <Text style={styles.foodTitle}>Grilled Salmon Bowl</Text>
                                    <Text style={styles.foodSubtitle}>Quinoa, kale, lemon-tahini dressing</Text>
                                </View>
                                <View style={styles.calBadge}>
                                    <Text style={styles.calText}>450 Cal</Text>
                                </View>
                            </View>
                            <View style={styles.tagsRow}>
                                <View style={styles.tagGreen}><Text style={styles.tagGreenText}>GLUTEN FREE</Text></View>
                                <View style={styles.tagBlue}><Text style={styles.tagBlueText}>HIGH PROTEIN</Text></View>
                            </View>
                        </View>
                    </View>

                    {/* Food Card 2 */}
                    <View style={styles.foodCard}>
                        <ImageBackground
                            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD121zlh-SXGdSU0vHXspzlOs5g5-4xBxJcW1sj5ijhMC8daV6aNj6IlMv8awI0nfACcP8e2QvZJn25pd5AQowTsQPBdYJnoMLZ2Q7hKUGH13KRFtDnXs4RRwxYPOVaS_D3ui1sEuNUkYG-sdneY_ap-O9yr3uFdqaEm9sSVIje8w50DUMjDJJ8qaR2zduKg6_38wn3JM9aMyhbqtqdCHaQ34PtjiaoA-42t-qslNg9PoLAyuH85UQ4saV8zhkuCpMtf1_ZYRknDFx-' }}
                            style={styles.foodImage}
                        />
                        <View style={styles.foodInfo}>
                            <View style={styles.foodInfoHeader}>
                                <View>
                                    <Text style={styles.foodTitle}>Classic Greek Salad</Text>
                                    <Text style={styles.foodSubtitle}>Feta, olives, cucumber, red onion</Text>
                                </View>
                                <View style={styles.calBadge}>
                                    <Text style={styles.calText}>320 Cal</Text>
                                </View>
                            </View>
                            <View style={styles.tagsRow}>
                                <View style={styles.tagEmerald}><Text style={styles.tagEmeraldText}>VEGETARIAN</Text></View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Hall Hours Card */}
                <View style={styles.hallHoursSection}>
                    <View style={styles.hallHoursCard}>
                        <View>
                            <Text style={styles.hallHoursLabel}>DINING HALL HOURS</Text>
                            <Text style={styles.hallHoursTitle}>North Hall Commons</Text>
                            <Text style={styles.hallHoursStatus}>⌚ Closes in 1h 45m (2:00 PM)</Text>
                        </View>
                        <View style={styles.mapIconContainer}>
                            <Text style={styles.mapIcon}>🗺️</Text>
                        </View>
                    </View>
                </View>

            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem}>
                    <Text style={styles.navIconActive}>🏠</Text>
                    <Text style={styles.navTextActive}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Text style={styles.navIcon}>🍽️</Text>
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
    scrollContainer: {
        paddingBottom: 80, // Space for bottom nav
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: 'rgba(248, 247, 246, 0.8)',
    },
    profilePic: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: PRIMARY_COLOR,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0f172a',
        flex: 1,
        paddingHorizontal: 12,
    },
    notificationButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(236, 127, 19, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    notificationIcon: {
        fontSize: 20,
    },
    welcomeSection: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    welcomeTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    welcomeSubtitle: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 4,
    },
    quickActionsGrid: {
        flexDirection: 'row',
        padding: 16,
        gap: 12,
    },
    actionCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        borderColor: 'rgba(236, 127, 19, 0.1)',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    actionIcon: {
        fontSize: 24,
        marginBottom: 4,
    },
    actionText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(236, 127, 19, 0.1)',
        marginTop: 8,
        gap: 32,
    },
    tabItem: {
        paddingVertical: 12,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabItemActive: {
        borderBottomColor: PRIMARY_COLOR,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
    },
    tabTextActive: {
        color: PRIMARY_COLOR,
        fontWeight: '700',
    },
    menuPreviewSection: {
        padding: 16,
    },
    menuPreviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    menuPreviewTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    servingBadge: {
        backgroundColor: 'rgba(236, 127, 19, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    servingBadgeText: {
        color: PRIMARY_COLOR,
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    foodCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
        borderColor: 'rgba(236, 127, 19, 0.05)',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    foodImage: {
        width: '100%',
        height: 160,
    },
    foodInfo: {
        padding: 16,
    },
    foodInfoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    foodTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    foodSubtitle: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 2,
    },
    calBadge: {
        backgroundColor: 'rgba(236, 127, 19, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    calText: {
        color: PRIMARY_COLOR,
        fontSize: 12,
        fontWeight: 'bold',
    },
    tagsRow: {
        flexDirection: 'row',
        marginTop: 12,
        gap: 8,
    },
    tagGreen: {
        backgroundColor: 'rgba(21, 128, 61, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    tagGreenText: {
        color: '#15803d',
        fontSize: 10,
        fontWeight: 'bold',
    },
    tagBlue: {
        backgroundColor: 'rgba(29, 78, 216, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    tagBlueText: {
        color: '#1d4ed8',
        fontSize: 10,
        fontWeight: 'bold',
    },
    tagEmerald: {
        backgroundColor: 'rgba(4, 120, 87, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    tagEmeraldText: {
        color: '#047857',
        fontSize: 10,
        fontWeight: 'bold',
    },
    hallHoursSection: {
        paddingHorizontal: 16,
        paddingBottom: 32,
    },
    hallHoursCard: {
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: PRIMARY_COLOR,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    hallHoursLabel: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    hallHoursTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 4,
    },
    hallHoursStatus: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
        marginTop: 8,
    },
    mapIconContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 12,
        borderRadius: 12,
    },
    mapIcon: {
        fontSize: 24,
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
