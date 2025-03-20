import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const MyInfo = () => {
    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
    });

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const fetchUserInfo = async () => {
        try {
            // Replace with your API endpoint
            const response = await fetch('/api/user/info');
            const data = await response.json();
            setUserInfo(data);
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>My Information</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Personal Details</Text>
                <Text><Text style={styles.label}>Name:</Text> {userInfo.name}</Text>
                <Text><Text style={styles.label}>Email:</Text> {userInfo.email}</Text>
                <Text><Text style={styles.label}>Phone:</Text> {userInfo.phone}</Text>
                <Text><Text style={styles.label}>Address:</Text> {userInfo.address}</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account Settings</Text>
                <Text>Manage your account settings and preferences.</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    section: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    label: {
        fontWeight: 'bold',
    },
});

export default MyInfo; 