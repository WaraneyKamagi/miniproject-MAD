import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, ImageBackground,
    StyleSheet, SafeAreaView, Platform, StatusBar, ScrollView,
    KeyboardAvoidingView, Modal, Linking, Alert
} from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginPage() {
    const router = useRouter();
    const [role, setRole] = useState('Student');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(true);
    const [helpVisible, setHelpVisible] = useState(false);

    const handleLogin = () => {
        if (!username.trim() || !password.trim()) {
            Alert.alert('Login Failed', 'Please enter your username/ID and password.');
            return;
        }
        if (role === 'Student') {
            router.replace('/(auth)/student-dashboard');
        } else {
            router.replace('/(auth)/admin-dashboard');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    <View style={styles.container}>
                        <View style={styles.card}>

                            {/* Header */}
                            <View style={styles.header}>
                                <View style={styles.iconContainer}>
                                    <Text style={styles.iconText}>🍽️</Text>
                                </View>
                                <Text style={styles.headerTitle}>Dorm Dining System</Text>
                                <View style={styles.headerSpacer} />
                            </View>

                            {/* Illustration */}
                            <ImageBackground
                                source={require('../../assets/images/daining.png')}
                                style={styles.backgroundImage}
                                imageStyle={{ borderRadius: 8 }}
                            />

                            <View style={styles.contentPadding}>
                                <Text style={styles.welcomeText}>Welcome Back</Text>
                                <Text style={styles.subtitleText}>Please select your role and sign in to your account</Text>

                                {/* Role Selection */}
                                <View style={styles.roleContainer}>
                                    <View style={styles.roleButtonsWrapper}>
                                        <TouchableOpacity
                                            style={[styles.roleButton, role === 'Student' && styles.roleButtonActive]}
                                            onPress={() => setRole('Student')}
                                        >
                                            <Text style={[styles.roleText, role === 'Student' && styles.roleTextActive]}>
                                                🎓 Student
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.roleButton, role === 'Admin' && styles.roleButtonActive]}
                                            onPress={() => setRole('Admin')}
                                        >
                                            <Text style={[styles.roleText, role === 'Admin' && styles.roleTextActive]}>
                                                🛡️ Admin
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* Login Form */}
                                <View style={styles.formContainer}>
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>Username or ID</Text>
                                        <View style={styles.inputWrapper}>
                                            <Text style={styles.inputIcon}>👤</Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Enter your ID"
                                                placeholderTextColor="#9ca3af"
                                                value={username}
                                                onChangeText={setUsername}
                                                autoCapitalize="none"
                                            />
                                        </View>
                                    </View>

                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>Password</Text>
                                        <View style={styles.inputWrapper}>
                                            <Text style={styles.inputIcon}>🔒</Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="••••••••"
                                                placeholderTextColor="#9ca3af"
                                                secureTextEntry
                                                value={password}
                                                onChangeText={setPassword}
                                            />
                                        </View>
                                    </View>

                                    <View style={styles.rememberRow}>
                                        <TouchableOpacity
                                            style={styles.checkboxContainer}
                                            onPress={() => setRememberMe(!rememberMe)}
                                        >
                                            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                                                {rememberMe && (
                                                    <Text style={styles.checkmark}>✓</Text>
                                                )}
                                            </View>
                                            <Text style={styles.rememberText}>Remember me</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => Alert.alert('Forgot Password', 'Please contact Dining Services to reset your password.\n\n📧 dining@dormsystem.edu\n📞 (021) 555-0100')}>
                                            <Text style={styles.forgotText}>Forgot password?</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
                                        <Text style={styles.signInText}>Sign In</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Help Link */}
                                <View style={styles.helpContainer}>
                                    <Text style={styles.helpText}>
                                        Need help?{' '}
                                        <Text style={styles.contactText} onPress={() => setHelpVisible(true)}>
                                            Contact Dining Services
                                        </Text>
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Help Modal */}
            <Modal
                visible={helpVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setHelpVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>

                        {/* Modal Header */}
                        <View style={styles.modalHeader}>
                            <View style={styles.modalIconContainer}>
                                <Text style={styles.modalIcon}>🍽️</Text>
                            </View>
                            <Text style={styles.modalTitle}>Dining Services</Text>
                            <TouchableOpacity onPress={() => setHelpVisible(false)} style={styles.modalClose}>
                                <Text style={styles.modalCloseText}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalDivider} />

                        <Text style={styles.modalSubtitle}>How can we help you?</Text>

                        {/* Contact Options */}
                        <TouchableOpacity
                            style={styles.contactOption}
                            onPress={() => Linking.openURL('mailto:dining@dormsystem.edu')}
                        >
                            <View style={styles.contactIconBox}>
                                <Text style={styles.contactOptionIcon}>📧</Text>
                            </View>
                            <View style={styles.contactOptionContent}>
                                <Text style={styles.contactOptionTitle}>Email Us</Text>
                                <Text style={styles.contactOptionValue}>dining@dormsystem.edu</Text>
                            </View>
                            <Text style={styles.contactArrow}>›</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.contactOption}
                            onPress={() => Linking.openURL('tel:+62215550100')}
                        >
                            <View style={styles.contactIconBox}>
                                <Text style={styles.contactOptionIcon}>📞</Text>
                            </View>
                            <View style={styles.contactOptionContent}>
                                <Text style={styles.contactOptionTitle}>Call Us</Text>
                                <Text style={styles.contactOptionValue}>(021) 555-0100</Text>
                            </View>
                            <Text style={styles.contactArrow}>›</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.contactOption}
                            onPress={() => Linking.openURL('https://wa.me/628155501001')}
                        >
                            <View style={styles.contactIconBox}>
                                <Text style={styles.contactOptionIcon}>💬</Text>
                            </View>
                            <View style={styles.contactOptionContent}>
                                <Text style={styles.contactOptionTitle}>WhatsApp</Text>
                                <Text style={styles.contactOptionValue}>+62 815-5501-001</Text>
                            </View>
                            <Text style={styles.contactArrow}>›</Text>
                        </TouchableOpacity>

                        <View style={styles.modalDivider} />

                        <View style={styles.modalHours}>
                            <Text style={styles.modalHoursIcon}>🕐</Text>
                            <View>
                                <Text style={styles.modalHoursTitle}>Office Hours</Text>
                                <Text style={styles.modalHoursText}>Monday – Friday, 08:00 – 17:00</Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.modalCloseButton}
                            onPress={() => setHelpVisible(false)}
                        >
                            <Text style={styles.modalCloseButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const PRIMARY_COLOR = '#ec7f13';
const BG_LIGHT = '#f8f7f6';

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: BG_LIGHT,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 16,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
    },
    card: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 5,
        overflow: 'hidden',
        borderColor: 'rgba(236, 127, 19, 0.1)',
        borderWidth: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(236, 127, 19, 0.05)',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(236, 127, 19, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconText: { fontSize: 20 },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0f172a',
        flex: 1,
        textAlign: 'center',
    },
    headerSpacer: { width: 40 },
    backgroundImage: {
        width: '100%',
        height: 180,
        backgroundColor: 'rgba(236, 127, 19, 0.05)',
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(236, 127, 19, 0.1)',
    },
    contentPadding: {
        paddingHorizontal: 24,
        paddingBottom: 32,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0f172a',
        textAlign: 'center',
        paddingTop: 8,
    },
    subtitleText: {
        fontSize: 14,
        color: '#475569',
        textAlign: 'center',
        paddingTop: 4,
        paddingBottom: 24,
    },
    roleContainer: {
        paddingVertical: 12,
        marginBottom: 24,
    },
    roleButtonsWrapper: {
        flexDirection: 'row',
        height: 48,
        backgroundColor: 'rgba(236, 127, 19, 0.05)',
        borderRadius: 12,
        padding: 4,
        borderWidth: 1,
        borderColor: 'rgba(236, 127, 19, 0.1)',
    },
    roleButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    roleButtonActive: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    roleText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
    },
    roleTextActive: { color: PRIMARY_COLOR },
    formContainer: { gap: 16 },
    inputGroup: { marginBottom: 16 },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#334155',
        marginBottom: 4,
    },
    inputWrapper: {
        position: 'relative',
        justifyContent: 'center',
    },
    inputIcon: {
        position: 'absolute',
        left: 12,
        fontSize: 20,
        zIndex: 1,
    },
    input: {
        width: '100%',
        backgroundColor: 'rgba(236, 127, 19, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(236, 127, 19, 0.1)',
        borderRadius: 12,
        paddingVertical: 12,
        paddingLeft: 40,
        paddingRight: 16,
        color: '#0f172a',
    },
    rememberRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 18,
        height: 18,
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: 'rgba(236, 127, 19, 0.4)',
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: PRIMARY_COLOR,
        borderColor: PRIMARY_COLOR,
    },
    checkmark: {
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold',
        lineHeight: 14,
    },
    rememberText: {
        fontSize: 14,
        color: '#475569',
    },
    forgotText: {
        fontSize: 14,
        fontWeight: '600',
        color: PRIMARY_COLOR,
    },
    signInButton: {
        width: '100%',
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 16,
        shadowColor: PRIMARY_COLOR,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    signInText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    helpContainer: {
        marginTop: 32,
        alignItems: 'center',
    },
    helpText: {
        fontSize: 12,
        color: '#64748b',
    },
    contactText: {
        color: PRIMARY_COLOR,
        fontWeight: '500',
    },

    // ── Modal ──────────────────────────────────────────
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalCard: {
        width: '100%',
        maxWidth: 380,
        backgroundColor: '#fff',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.15,
        shadowRadius: 30,
        elevation: 10,
        borderWidth: 1,
        borderColor: 'rgba(236, 127, 19, 0.1)',
        overflow: 'hidden',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    modalIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(236, 127, 19, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    modalIcon: { fontSize: 18 },
    modalTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#0f172a',
        flex: 1,
    },
    modalClose: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(100, 116, 139, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalCloseText: {
        fontSize: 13,
        color: '#64748b',
        fontWeight: '600',
    },
    modalDivider: {
        height: 1,
        backgroundColor: 'rgba(236, 127, 19, 0.08)',
        marginHorizontal: 16,
    },
    modalSubtitle: {
        fontSize: 13,
        color: '#64748b',
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 10,
        fontWeight: '500',
    },
    contactOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    contactIconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: 'rgba(236, 127, 19, 0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    contactOptionIcon: { fontSize: 18 },
    contactOptionContent: { flex: 1 },
    contactOptionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0f172a',
    },
    contactOptionValue: {
        fontSize: 12,
        color: PRIMARY_COLOR,
        marginTop: 1,
    },
    contactArrow: {
        fontSize: 20,
        color: '#cbd5e1',
        fontWeight: '300',
    },
    modalHours: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 10,
    },
    modalHoursIcon: { fontSize: 18 },
    modalHoursTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#334155',
    },
    modalHoursText: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 1,
    },
    modalCloseButton: {
        marginHorizontal: 16,
        marginBottom: 16,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: 'rgba(236, 127, 19, 0.08)',
        borderWidth: 1,
        borderColor: 'rgba(236, 127, 19, 0.15)',
        alignItems: 'center',
    },
    modalCloseButtonText: {
        color: PRIMARY_COLOR,
        fontWeight: '600',
        fontSize: 14,
    },
});