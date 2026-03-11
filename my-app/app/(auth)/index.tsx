import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, StyleSheet, SafeAreaView, Platform, StatusBar, ScrollView, KeyboardAvoidingView, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginPage() {
    const router = useRouter();
    const [role, setRole] = useState('Student');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(true);

    const handleLogin = () => {
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
                            {/* TopAppBar Component */}
                            <View style={styles.header}>
                                <View style={styles.iconContainer}>
                                    <Text style={styles.iconText}>🍽️</Text>
                                </View>
                                <Text style={styles.headerTitle}>Dorm Dining System</Text>
                                <View style={styles.headerSpacer} />
                            </View>

                            {/* Illustration Area */}
                            <View style={styles.imageContainer}>
                                <ImageBackground
                                    source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYtzCOvVJNS2I7eMJSLSUtnsJ5XScC2FYJg4qmBpM53mIUxDXGhrNfCVvUe58GHWt3SFg-LEyHKrzG2dXPeSGEPg-EnrGvLW4ZfeTdsOOGhpYlDUh7HSRozYcNEHgzpDGHaUxQ7vn0OBm6hle6XKN4kg366W7dnSp3tpedeLFKT71K0XDIA-FvE0qelttP1UIIRcCUaKsQwF0pBDMBrJY3nj-9DWruS46JZe7g00nMChTnStuo9jLWNfiBY5UnDu1gl8syBjX9M99P' }}
                                    style={styles.backgroundImage}
                                    imageStyle={{ borderRadius: 8 }}
                                >
                                </ImageBackground>
                            </View>

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
                                            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]} />
                                            <Text style={styles.rememberText}>Remember me</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity>
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
                                        Need help? <Text style={styles.contactText}>Contact Dining Services</Text>
                                    </Text>
                                </View>
                            </View>

                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
    iconText: {
        fontSize: 20,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0f172a',
        flex: 1,
        textAlign: 'center',
    },
    headerSpacer: {
        width: 40,
    },
    imageContainer: {
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
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
    roleTextActive: {
        color: PRIMARY_COLOR,
    },
    formContainer: {
        gap: 16,
    },
    inputGroup: {
        marginBottom: 16,
    },
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
        width: 16,
        height: 16,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(236, 127, 19, 0.3)',
        marginRight: 8,
    },
    checkboxChecked: {
        backgroundColor: PRIMARY_COLOR,
        borderColor: PRIMARY_COLOR,
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
});

