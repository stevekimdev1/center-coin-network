import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const Referral = () => {
    const [referralCount, setReferralCount] = useState(0);
    const [referrals, setReferrals] = useState([]);

    useEffect(() => {
        fetchReferralData();
    }, []);

    const fetchReferralData = async () => {
        try {
            // Replace with your API endpoints
            const countResponse = await fetch('/api/referrals/count');
            const countData = await countResponse.json();
            setReferralCount(countData.count);

            const referralsResponse = await fetch('/api/referrals/list');
            const referralsData = await referralsResponse.json();
            setReferrals(referralsData);
        } catch (error) {
            console.error('Error fetching referral data:', error);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Referral Program</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Your Referrals</Text>
                <Text>You have referred {referralCount} friends.</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Referral List</Text>
                {referrals.map((referral) => (
                    <View key={referral.id} style={styles.referralItem}>
                        <Text>{referral.name}: {referral.balance} {referral.currency}</Text>
                    </View>
                ))}
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
    referralItem: {
        marginBottom: 10,
    },
});

export default Referral; 